export const BILLING_UPDATED_EVENT = 'billing:updated';

export type BillingUpdateDetail = {
  charged_credits?: number;
  monthly_credits_remaining?: number;
  daily_credits_spent?: number;
} | undefined;

export function emitBillingUpdated(detail?: BillingUpdateDetail) {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent(BILLING_UPDATED_EVENT, { detail }));
  } catch {
    // no-op
  }
}
