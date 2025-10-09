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

  // Module-level shared cache/dedupe to prevent multiple components from spamming the API
  // These live on the window object to ensure a single instance across HMR reload boundaries as well
  const g: any = (typeof window !== 'undefined') ? window : {};
  if (!g.__billing_summary_cache) {
    g.__billing_summary_cache = {
      cachedData: null as BillingSummary | null,
      lastFetch: 0 as number,
      inFlight: null as Promise<BillingSummary> | null,
    };
  }
  const cache = g.__billing_summary_cache as { cachedData: BillingSummary | null; lastFetch: number; inFlight: Promise<BillingSummary> | null };

  // Global single-shot listener/scheduler setup
  if (!g.__billing_summary_bus) {
    g.__billing_summary_bus = {
      listenersInstalled: false,
      scheduled: false,
      timer: null as ReturnType<typeof setTimeout> | null,
      schedule: (fn: () => void, delayMs = 800) => {
        if (g.__billing_summary_bus.scheduled) return;
        g.__billing_summary_bus.scheduled = true;
        g.__billing_summary_bus.timer && clearTimeout(g.__billing_summary_bus.timer);
        g.__billing_summary_bus.timer = setTimeout(() => {
          g.__billing_summary_bus.scheduled = false;
          try { fn(); } catch {}
        }, delayMs);
      },
    };
  }
  const bus: any = g.__billing_summary_bus;

  const fetchSummaryThrottled = useCallback(async () => {
    // Return in-flight promise if a request is already ongoing
    if (cache.inFlight) return cache.inFlight;
    const now = Date.now();
    // If cached within 3s, serve from cache
    if (cache.cachedData && now - (cache.lastFetch || 0) < 3000) {
      return cache.cachedData as BillingSummary;
    }
    cache.inFlight = (async () => {
      try {
        const res = await apiClient.get(`${API_BASE_URL}/billing/summary`);
        cache.cachedData = res.data as BillingSummary;
        cache.lastFetch = Date.now();
        return cache.cachedData as BillingSummary;
      } finally {
        // Clear inFlight after a microtask to allow listeners to chain onto the same promise
        Promise.resolve().then(() => { cache.inFlight = null; });
      }
    })();
    return cache.inFlight;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSummaryThrottled();
      setData(res);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load billing summary");
    } finally {
      setLoading(false);
    }
  }, [fetchSummaryThrottled]);

  useEffect(() => {
    let cancelled = false;
    // Seed state from cache immediately if present
    if (cache.cachedData) setData(cache.cachedData);
    // Only the first subscriber triggers an immediate fetch; others rely on cache
    if (!g.__billing_summary_first_fetch_done) {
      g.__billing_summary_first_fetch_done = true;
      refresh();
    }
    // Install global listeners once
    if (!bus.listenersInstalled) {
      const onBillingUpdated = (evt: Event) => {
        if (cancelled) return;
        try {
          const anyEvt = evt as CustomEvent<any>;
          const detail = anyEvt?.detail as {
            charged_credits?: number;
            monthly_credits_remaining?: number;
            daily_credits_spent?: number;
          } | undefined;
          if (detail && (detail.charged_credits || detail.monthly_credits_remaining || detail.daily_credits_spent)) {
            cache.cachedData = {
              ...(cache.cachedData || { plan: 'free', monthly_credits_remaining: 0, monthly_credits_max: 0 }),
              monthly_credits_remaining: typeof detail.monthly_credits_remaining === 'number'
                ? detail.monthly_credits_remaining
                : Math.max(0, (cache.cachedData?.monthly_credits_remaining || 0) - (detail.charged_credits || 0)),
              daily_credits_spent: typeof detail.daily_credits_spent === 'number'
                ? detail.daily_credits_spent
                : Math.max(0, (cache.cachedData?.daily_credits_spent || 0) + (detail.charged_credits || 0)),
            } as BillingSummary;
          }
          // Coalesce a background refresh soon (skip when tab hidden)
          if (typeof document === 'undefined' || document.visibilityState === 'visible') {
            bus.schedule(() => { fetchSummaryThrottled().then(() => { /* update cache only */ }); }, 1200);
          }
        } catch {
          if (typeof document === 'undefined' || document.visibilityState === 'visible') {
            bus.schedule(() => { fetchSummaryThrottled().then(() => {}); }, 1500);
          }
        }
      };
      window.addEventListener(BILLING_UPDATED_EVENT, onBillingUpdated as EventListener);
      bus.listenersInstalled = true;
      // Persist removers for future teardown if needed (not removing to avoid reinstall storms)
      g.__billing_summary_uninstall = () => {
        window.removeEventListener(BILLING_UPDATED_EVENT, onBillingUpdated as EventListener);
        bus.listenersInstalled = false;
      };
    }
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refresh, setData };
}
