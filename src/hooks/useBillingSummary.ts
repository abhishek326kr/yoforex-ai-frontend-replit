import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/api";

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

  useEffect(() => {
    let cancelled = false;
    async function fetchSummary() {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== 'undefined'
          ? (localStorage.getItem('authToken') || localStorage.getItem('access_token'))
          : null;
        const res = await fetch(`${API_BASE_URL}/billing/billing/summary`, {
          // include cookies for session auth (SameSite)
          credentials: 'include',
          headers: {
            "accept": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as BillingSummary;
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load billing summary");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSummary();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
