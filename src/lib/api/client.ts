import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { emitBillingUpdated, emitUpgradeRequired } from '../billingEvents';

// Configuration
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second
const TIMEOUT = 60000; // 60 seconds

// List of HTTP methods that are idempotent
const IDEMPOTENT_METHODS = ['get', 'head', 'options', 'delete', 'put'];

// List of status codes that should trigger a retry
const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];

import { API_BASE_URL } from '../../config/api';

// Optional backup URL from environment
const BACKUP_API_URL = import.meta.env.VITE_BACKUP_API_URL as string | undefined;

// Backend URLs - only include backup if configured
const BACKEND_URLS = [API_BASE_URL, BACKUP_API_URL].filter(Boolean) as string[];

// Create a base Axios instance without a baseURL
const apiClient = axios.create({
  timeout: TIMEOUT,
  withCredentials: true, // include cookies for HTTP-only cookie authentication
  headers: {
    'Content-Type': 'application/json',
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
  const method = error.config?.method?.toLowerCase() || '';
  
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
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Attach admin token for protected maintenance endpoint
    try {
      const adminToken = import.meta.env.VITE_ADMIN_DELETE_TOKEN as string | undefined;
      const url = (config.url || '');
      if (adminToken && url.includes('/auth/delete/by-phone')) {
        (config.headers as any)['x-admin-token'] = adminToken;
      }
    } catch {}
    
    // Set the current base URL
    config.baseURL = BACKEND_URLS[currentUrlIndex];
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
    } catch {}
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retryCount?: number });
    originalRequest._retryCount = originalRequest._retryCount || 0;
    
    // Try next URL if available
    if (error.code === 'ECONNABORTED' || !error.response) {
      if (currentUrlIndex < BACKEND_URLS.length - 1) {
        currentUrlIndex++;
        console.warn(`Switching to backup API URL: ${BACKEND_URLS[currentUrlIndex]}`);
        return apiClient(originalRequest);
      }
    }
    
    // Handle retry logic
    if (shouldRetry(error, originalRequest._retryCount)) {
      const delay = calculateDelay(originalRequest._retryCount);
      originalRequest._retryCount++;
      
      console.warn(`Retrying request (${originalRequest._retryCount}/${MAX_RETRIES}) after ${delay}ms`);
      
      // Wait for the delay before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiClient(originalRequest);
    }
    
    // Handle specific error responses
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;
      
      const errorMessage = data?.message || error.message || 'An error occurred';
      const errorDetails = data?.details || {};
      
      const enhancedError = new Error(errorMessage) as any;
      enhancedError.status = status;
      enhancedError.details = errorDetails;
      // Preserve original Axios response so callers can inspect error.response
      enhancedError.response = error.response;
      // Preserve Axios error shape hints
      enhancedError.code = (data?.detail?.code ?? error.code);
      enhancedError.isAxiosError = true;
      
      switch (status) {
        case 400:
          enhancedError.message = errorMessage || 'Bad request';
          break;
        case 401:
          enhancedError.message = 'Session expired. Please log in again.';
          // Clear auth, broadcast cross-tab logout, and redirect
          try {
            localStorage.removeItem('authToken');
            localStorage.removeItem('access_token');
            localStorage.removeItem('userProfile');
            localStorage.removeItem('userPreferences');
            localStorage.removeItem('userSecurity');
            localStorage.removeItem('auth:exp');
            localStorage.setItem('auth:logout', String(Date.now()));
          } catch {}
          // Avoid redirect storms by using a simple guard
          if (!(window as any).__logging_out) {
            (window as any).__logging_out = true;
            window.location.href = '/auth';
          }
          break;
        case 403:
          enhancedError.message = 'You do not have permission to perform this action';
          break;
        case 404:
          enhancedError.message = 'The requested resource was not found';
          break;
        case 408:
          enhancedError.message = 'Request timeout. Please try again.';
          break;
        case 429:
          {
            // Detect daily cap and broadcast upgrade prompt
            const detail = (data?.detail || data) as any;
            const isDailyCap = typeof detail === 'object' && (detail?.code === 'daily_cap_reached');
            if (isDailyCap) {
              enhancedError.message = 'Daily credit cap reached. Try again tomorrow.';
              try {
                emitUpgradeRequired({ reason: 'daily_cap', message: enhancedError.message });
              } catch {}
            } else {
              enhancedError.message = 'Too many requests. Please wait before trying again.';
            }
          }
          break;
        case 500:
          enhancedError.message = 'Internal server error. Please try again later.';
          break;
        case 502:
        case 503:
        case 504:
          enhancedError.message = 'Service unavailable. Please try again later.';
          break;
        default:
          enhancedError.message = errorMessage || 'An unknown error occurred';
      }
      
      console.error(`API Error [${status}]:`, enhancedError.message, errorDetails);
      return Promise.reject(enhancedError);
    } else if (error.request) {
      // The request was made but no response was received
      const networkError = new Error('Unable to connect to the server. Please check your internet connection.');
      return Promise.reject(networkError);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default apiClient;
