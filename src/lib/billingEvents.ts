export const BILLING_UPDATED_EVENT = 'billing:updated';
export const UPGRADE_REQUIRED_EVENT = 'billing:upgrade_required';

export type BillingUpdateDetail = {
  charged_credits?: number;
  monthly_credits_remaining?: number;
  daily_credits_spent?: number;
} | undefined;

export type UpgradeRequiredDetail = {
  reason?: 'daily_cap' | 'insufficient_credits' | string;
  message?: string;
} | undefined;

export function emitBillingUpdated(detail?: BillingUpdateDetail) {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent(BILLING_UPDATED_EVENT, { detail }));
  } catch {
    // no-op
  }
}

export function emitUpgradeRequired(detail?: UpgradeRequiredDetail) {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent(UPGRADE_REQUIRED_EVENT, { detail }));
  } catch {
    // no-op
  }
}
