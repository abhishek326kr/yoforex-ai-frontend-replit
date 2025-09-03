import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "@/config/api";
import { BILLING_UPDATED_EVENT } from "@/lib/billingEvents";

export type BillingSummary = {
  plan: string;
  monthly_credits_remaining: number;
  monthly_credits_max: number;
  daily_credits_spent?: number;
  daily_cap?: number;
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
      const token = typeof window !== 'undefined'
        ? (localStorage.getItem('authToken') || localStorage.getItem('access_token'))
        : null;
      const res = await fetch(`${API_BASE_URL}/billing/summary`, {
        credentials: 'include',
        headers: {
          "accept": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as BillingSummary;
      setData(json);
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
    const onBillingUpdated = () => {
      if (!cancelled) {
        refresh();
      }
    };
    window.addEventListener(BILLING_UPDATED_EVENT, onBillingUpdated as EventListener);
    return () => {
      cancelled = true;
      window.removeEventListener(BILLING_UPDATED_EVENT, onBillingUpdated as EventListener);
    };
  }, [refresh]);

  return { data, loading, error, refresh, setData };
}
