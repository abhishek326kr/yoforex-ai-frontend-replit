<<<<<<< HEAD
import { toast as toastUi } from '@/hooks/use-toast';
import apiClient from '@/lib/api/client';
=======
import { toast as toastUi } from "@/hooks/use-toast";
import apiClient from "@/lib/api/client";
>>>>>>> puspal

export type ApiError = any;

// Centralized friendly mapping fallback
<<<<<<< HEAD
const friendlyMap = (apiClient as any).BACKEND_FRIENDLY_MESSAGES as Record<string, string> | undefined;

export function showApiError(err: ApiError, opts?: { title?: string; defaultMessage?: string }) {
  const t = (toastUi as any);
  const title = opts?.title || 'Error';
  const defaultMessage = opts?.defaultMessage || 'Something went wrong. Please try again.';

  // Try common shapes from axios / apiClient rejection
  const status = err?.status || err?.response?.status;
  const details = err?.details || err?.response?.data?.detail || err?.response?.data || err?.message;
=======
const friendlyMap = (apiClient as any).BACKEND_FRIENDLY_MESSAGES as
  | Record<string, string>
  | undefined;

export function showApiError(
  err: ApiError,
  opts?: { title?: string; defaultMessage?: string }
) {
  const t = toastUi as any;
  const title = opts?.title || "Error";
  const defaultMessage =
    opts?.defaultMessage || "Something went wrong. Please try again.";

  // Try common shapes from axios / apiClient rejection
  const status = err?.status || err?.response?.status;
  const details =
    err?.details ||
    err?.response?.data?.detail ||
    err?.response?.data ||
    err?.message;

  if (details && typeof details === 'object' && 'error' in details && typeof details.error === 'object') {
    // Handle OpenAI API errors
    if (details.error.message) {
      return t({ title: 'AI Service Error', description: details.error.message, variant: 'destructive' });
    }
    // Handle nested error objects
    if (details.error.error && typeof details.error.error === 'object' && details.error.error.message) {
      return t({ title: 'AI Service Error', description: details.error.error.message, variant: 'destructive' });
    }
  }
>>>>>>> puspal

  // Preferred: { code, error }
  let code: string | undefined;
  let message: string | undefined;
<<<<<<< HEAD
  if (details && typeof details === 'object') {
    code = details.code || details.error || details.message;
    message = details.error || details.message || details.msg;
  }

  // If parseFastApiError style returned a simple message
  if (!message && typeof details === 'string') {
=======
  if (details && typeof details === "object") {
    code = details.code || details.error || details.message;
    message = details.error || details.message || details.msg;

    // If error is an object with a message property (common in API errors)
    if (
      typeof details.error === "object" &&
      details.error &&
      details.error.message
    ) {
      message = details.error.message;
    }
  }

  // If parseFastApiError style returned a simple message
  if (!message && typeof details === "string") {
>>>>>>> puspal
    message = details;
  }

  // If apiClient attached a message (from enhancedError.message)
  if (!message && err?.message) message = err.message;

  // Map known backend codes to friendly messages
  if (code && friendlyMap && friendlyMap[code]) {
    message = friendlyMap[code];
  }

  // Final fallback
  if (!message) message = defaultMessage;

  try {
<<<<<<< HEAD
    t({ title, description: String(message), variant: 'destructive' });
=======
    t({ title, description: String(message), variant: "destructive" });
>>>>>>> puspal
  } catch (ex) {
    // Fallback if use-toast export shape differs
    try {
      (toastUi as any).error?.({ title, description: String(message) });
    } catch {
<<<<<<< HEAD
      console.error('Failed to show toast', ex, message);
=======
      console.error("Failed to show toast", ex, message);
>>>>>>> puspal
    }
  }
}
