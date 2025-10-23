import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { emitBillingUpdated, emitUpgradeRequired } from "../billingEvents";

// Configuration
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second
const TIMEOUT = 60000; // 60 seconds

// List of HTTP methods that are idempotent
const IDEMPOTENT_METHODS = ["get", "head", "options", "delete", "put"];

// List of status codes that should trigger a retry
const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];

import { API_BASE_URL } from "../../config/api";

// Optional backup URL from environment
const BACKUP_API_URL = import.meta.env.VITE_BACKUP_API_URL as
  | string
  | undefined;

// Backend URLs - only include backup if configured
const BACKEND_URLS = [API_BASE_URL, BACKUP_API_URL].filter(Boolean) as string[];

// Create a base Axios instance without a baseURL
const apiClient = axios.create({
  timeout: TIMEOUT,
  withCredentials: true, // include cookies for HTTP-only cookie authentication
  headers: {
    "Content-Type": "application/json",
  },
});

// Track current URL index
let currentUrlIndex = 0;

// Calculate delay for retries using exponential backoff
const calculateDelay = (retryCount: number): number => {
  return Math.min(BASE_DELAY * Math.pow(2, retryCount), 30000); // Max 30s delay
};

// Check if a request should be retried
const shouldRetry = (error: AxiosError, retryCount: number): boolean => {
  const method = error.config?.method?.toLowerCase() || "";

  // Don't retry if we've reached max retries
  if (retryCount >= MAX_RETRIES) return false;

  // Only retry idempotent methods
  if (!IDEMPOTENT_METHODS.includes(method)) return false;

  // Retry on network errors or specific status codes
  if (!error.response) return true; // Network error
  if (RETRY_STATUS_CODES.includes(Number(error.response.status))) return true;

  return false;
};

// Request interceptor for adding auth token and handling retries
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach admin token for protected maintenance endpoint
    try {
      const adminToken = import.meta.env.VITE_ADMIN_DELETE_TOKEN as
        | string
        | undefined;
      const url = config.url || "";
      if (adminToken && url.includes("/auth/delete/by-phone")) {
        (config.headers as any)["x-admin-token"] = adminToken;
      }
    } catch { }

    // Set the current base URL
    config.baseURL = BACKEND_URLS[currentUrlIndex];

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to extract a meaningful message/code/details from FastAPI-style error payloads
function parseFastApiError(data: any): {
  message?: string;
  code?: string | number;
  details?: any;
} {
  if (!data) return {};
  // FastAPI commonly returns { detail: "message" } or { detail: { code, error } } or { detail: [ { loc, msg, type }, ... ] }
  const detail = (data as any).detail;
  // If detail is a string but contains embedded JSON (some backends stringify nested errors), try to extract it
  if (typeof detail === "string") {
    // quick heuristic: find first { and last }
    const first = detail.indexOf("{");
    const last = detail.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      try {
        const inner = JSON.parse(detail.slice(first, last + 1));
        // If inner looks like a FastAPI detail object, normalize it
        if (inner && (inner.detail || inner.error || inner.message)) {
          return parseFastApiError(inner);
        }
        // Otherwise, fall through and let the string be used as message
      } catch (e) {
        // ignore parse errors and continue
      }
    }
  }
  // Case 1: detail is a string
  if (typeof detail === "string") {
    return { message: detail, code: (data as any).code, details: undefined };
  }
  // Case 2: detail is an array (validation errors 422)
  if (Array.isArray(detail)) {
    try {
      const msgs = detail
        .map((d: any) => d?.msg || JSON.stringify(d))
        .filter(Boolean);
      return { message: msgs.join("; "), code: 422, details: detail };
    } catch {
      return { message: "Validation error", code: 422, details: detail };
    }
  }
  // Case 3: detail is an object with known fields
  if (detail && typeof detail === "object") {
    const msg = detail.error || detail.message || detail.msg;
    const code = detail.code || (data as any).code;
    return { message: msg, code, details: detail };
  }
  // Generic shapes
  if (typeof (data as any).message === "string") {
    return {
      message: (data as any).message,
      code: (data as any).code,
      details: (data as any).details,
    };
  }
  return {};
}

// Map backend error codes to friendly messages for lay users
const BACKEND_FRIENDLY_MESSAGES: Record<string, string> = {
  // Payments
  cashfree_error:
    "Payment provider error. Please try again or contact support if the problem persists.",
  not_paid: "Payment not completed. No changes were made.",
  bad_signature:
    "Payment callback verification failed. If you completed payment, contact support.",
  bad_payload: "Received invalid data from the payment provider.",
  plan_price_missing:
    "This plan currently has a configuration issue. Please contact support.",
  bad_tokens: "Invalid token amount selected. Please choose a valid pack.",

  // Permissions / auth
  forbidden: "You do not have permission to perform this action.",
  user_not_found:
    "User account not found. Please sign in again or contact support.",

  // Billing / usage
  daily_cap_reached:
    "You have reached your daily usage limit. Please try again tomorrow or upgrade your plan.",

  // Promo / input
  invalid_promo: "Promo code not recognized or expired.",
  bad_request: "Invalid request. Please check your input and try again.",
  model_not_allowed:
    "One or more selected models are not allowed on your current plan.",
};

// Response interceptor for handling errors and retries
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // If backend returns a billing summary, broadcast it so subscribers refresh
    try {
      const billing = (response?.data as any)?.billing;
      if (billing) {
        emitBillingUpdated({
          monthly_credits_remaining: billing.monthly_credits_remaining,
          daily_credits_spent: billing.daily_credits_spent,
        });
      }
    } catch { }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retryCount?: number;
    };
    originalRequest._retryCount = originalRequest._retryCount || 0;

    // Try next URL if available
    if (error.code === "ECONNABORTED" || !error.response) {
      if (currentUrlIndex < BACKEND_URLS.length - 1) {
        currentUrlIndex++;
        console.warn(
          `Switching to backup API URL: ${BACKEND_URLS[currentUrlIndex]}`
        );
        return apiClient(originalRequest);
      }
    }

    // Handle retry logic
    if (shouldRetry(error, originalRequest._retryCount)) {
      const delay = calculateDelay(originalRequest._retryCount);
      originalRequest._retryCount++;

      console.warn(
        `Retrying request (${originalRequest._retryCount}/${MAX_RETRIES}) after ${delay}ms`
      );

      // Wait for the delay before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
      return apiClient(originalRequest);
    }

    // Handle specific error responses
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      // Prefer FastAPI-style parsing, then fall back
      const parsed = parseFastApiError(data);
      const errorMessage =
        parsed.message || error.message || "An error occurred";
      const errorDetails = parsed.details || data?.details || {};

      const enhancedError = new Error(errorMessage) as any;
      enhancedError.status = status;
      enhancedError.details = errorDetails;
      // Preserve original Axios response so callers can inspect error.response
      enhancedError.response = error.response;
      // Preserve Axios error shape hints
      enhancedError.code = parsed.code ?? data?.detail?.code ?? error.code;
      enhancedError.isAxiosError = true;

      switch (status) {
        case 400:
          enhancedError.message = errorMessage || "Bad request";
          break;
        case 401:
          enhancedError.message = "Session expired. Please log in again.";
          // Clear auth, broadcast cross-tab logout, and redirect
          try {
            localStorage.removeItem("authToken");
            localStorage.removeItem("access_token");
            localStorage.removeItem("userProfile");
            localStorage.removeItem("userPreferences");
            localStorage.removeItem("userSecurity");
            localStorage.removeItem("auth:exp");
            localStorage.setItem("auth:logout", String(Date.now()));
          } catch { }
          // Avoid redirect storms by using a simple guard
          if (!(window as any).__logging_out) {
            (window as any).__logging_out = true;
            window.location.href = "/auth";
          }
          break;
        case 403:
          enhancedError.message =
            "You do not have permission to perform this action";
          break;
        case 404:
          enhancedError.message = "The requested resource was not found";
          break;
        case 405:
          enhancedError.message =
            "Method not allowed. Please check the HTTP method for this endpoint.";
          break;
        case 422:
          enhancedError.message =
            parsed.message || "Validation error. Please check your inputs.";
          break;
        case 408:
          enhancedError.message = "Request timeout. Please try again.";
          break;
        case 429:
          {
            // Detect daily cap and broadcast upgrade prompt
            const detail = (data?.detail || data) as any;
            const isDailyCap =
              typeof detail === "object" &&
              detail?.code === "daily_cap_reached";
            if (isDailyCap) {
              enhancedError.message =
                "Daily credit cap reached. Try again tomorrow.";
              try {
                emitUpgradeRequired({
                  reason: "daily_cap",
                  message: enhancedError.message,
                });
              } catch { }
            } else {
              enhancedError.message =
                "Too many requests. Please wait before trying again.";
            }
          }
          break;
        case 500:
          enhancedError.message =
            "Internal server error. Please try again later.";
          break;
        case 502:
        case 503:
        case 504:
          enhancedError.message =
            "Service unavailable. Please try again later.";
          break;
        default:
          enhancedError.message = errorMessage || "An unknown error occurred";
      }

      console.error(
        `API Error [${status}]:`,
        enhancedError.message,
        errorDetails
      );
      return Promise.reject(enhancedError);
    } else if (error.request) {
      // The request was made but no response was received
      // Likely a network error, CORS failure, or timeout blocked by the browser
      const msg =
        error.code === "ECONNABORTED"
          ? "Request timed out. Please try again."
          : "Network or CORS error. Please try again, and ensure the backend allows this origin.";
      const networkError = new Error(msg);
      return Promise.reject(networkError);
    } else {
      // Something happened in setting up the request
      console.error("Request setup error:", error.message);
      return Promise.reject(error);
    }
  }
);

// Attach friendly mapping to the export for UI access
(apiClient as any).BACKEND_FRIENDLY_MESSAGES = BACKEND_FRIENDLY_MESSAGES;

export default apiClient;
