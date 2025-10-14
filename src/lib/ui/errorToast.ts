import { toast as toastUi } from '@/hooks/use-toast';
import apiClient from '@/lib/api/client';

export type ApiError = any;

// Centralized friendly mapping fallback
const friendlyMap = (apiClient as any).BACKEND_FRIENDLY_MESSAGES as Record<string, string> | undefined;

export function showApiError(err: ApiError, opts?: { title?: string; defaultMessage?: string }) {
  const t = (toastUi as any);
  const title = opts?.title || 'Error';
  const defaultMessage = opts?.defaultMessage || 'Something went wrong. Please try again.';

  // Try common shapes from axios / apiClient rejection
  const status = err?.status || err?.response?.status;
  const details = err?.details || err?.response?.data?.detail || err?.response?.data || err?.message;

  // Preferred: { code, error }
  let code: string | undefined;
  let message: string | undefined;
  if (details && typeof details === 'object') {
    code = details.code || details.error || details.message;
    message = details.error || details.message || details.msg;
  }

  // If parseFastApiError style returned a simple message
  if (!message && typeof details === 'string') {
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
    t({ title, description: String(message), variant: 'destructive' });
  } catch (ex) {
    // Fallback if use-toast export shape differs
    try {
      (toastUi as any).error?.({ title, description: String(message) });
    } catch {
      console.error('Failed to show toast', ex, message);
    }
  }
}
