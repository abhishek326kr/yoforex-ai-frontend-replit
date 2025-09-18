import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "@/config/api";
import { BILLING_UPDATED_EVENT } from "@/lib/billingEvents";
import apiClient from "@/lib/api/client";

export type BillingSummary = {
  plan: string;
  monthly_credits_remaining: number;
  monthly_credits_max: number;
  daily_credits_spent?: number;
  daily_cap?: number;
  daily_available?: number;
  allowed_models?: string[];
};

export function useBillingSummary() {
  const [data, setData] = useState<BillingSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`${API_BASE_URL}/billing/summary`);
      setData(res.data as BillingSummary);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load billing summary");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    // initial fetch
    refresh();
    // listen for global billing updates
    const onBillingUpdated = (evt: Event) => {
      if (cancelled) return;
      try {
        const anyEvt = evt as CustomEvent<any>;
        const detail = anyEvt?.detail as {
          charged_credits?: number;
          monthly_credits_remaining?: number;
          daily_credits_spent?: number;
        } | undefined;

        // Optimistically merge into current cached state for instant UI update
        if (detail && (detail.charged_credits || detail.monthly_credits_remaining || detail.daily_credits_spent)) {
          setData((prev) => {
            if (!prev) return prev; // wait for initial load
            let remaining = prev.monthly_credits_remaining;
            let dailySpent = prev.daily_credits_spent ?? 0;

            if (typeof detail.monthly_credits_remaining === 'number') {
              remaining = detail.monthly_credits_remaining;
            } else if (typeof detail.charged_credits === 'number') {
              remaining = Math.max(0, remaining - detail.charged_credits);
            }

            if (typeof detail.daily_credits_spent === 'number') {
              dailySpent = detail.daily_credits_spent;
            } else if (typeof detail.charged_credits === 'number') {
              dailySpent = Math.max(0, dailySpent + detail.charged_credits);
            }

            return {
              ...prev,
              monthly_credits_remaining: remaining,
              daily_credits_spent: dailySpent,
            };
          });
        }

        // Also trigger a background refresh to sync authoritative values
        refresh();
      } catch {
        refresh();
      }
    };
    window.addEventListener(BILLING_UPDATED_EVENT, onBillingUpdated as EventListener);
    // also refresh when tab regains focus or becomes visible
    const onFocus = () => { if (!cancelled) refresh(); };
    const onVisibility = () => { if (!cancelled && document.visibilityState === 'visible') refresh(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      window.removeEventListener(BILLING_UPDATED_EVENT, onBillingUpdated as EventListener);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refresh]);

  return { data, loading, error, refresh, setData };
}
