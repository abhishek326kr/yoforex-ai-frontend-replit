import { TradingLayout } from "@/components/layout/TradingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { AlertTriangle, ArrowLeft, RotateCcw, Loader2, CheckCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useBillingSummary } from "@/hooks/useBillingSummary";
import { listInvoices } from "@/lib/api/billing";
import { emitBillingUpdated } from "@/lib/billingEvents";

export default function BillingFailure() {
  const [, navigate] = useLocation();
  const { data: billing, refresh } = useBillingSummary();
  const spInit = useMemo(() => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ""), []);
  const orderId = useMemo(() => spInit.get("order_id") || undefined, [spInit]);
  const provider = useMemo(() => (spInit.get('provider') || '').toLowerCase(), [spInit]);
  const [checking, setChecking] = useState<boolean>(false);
  const [recovered, setRecovered] = useState<boolean>(false);

  // If coming from CoinPayments cancel/success pages, the checkout may have returned before IPN confirmed.
  // We poll briefly for webhook completion and show a hint if it succeeds despite the initial failure page.
  useEffect(() => {
    let cancelled = false;
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
    if (provider !== 'coinpayments') return;
    const run = async () => {
      setChecking(true);
      const maxTries = 15; // ~30s
      let expected: 'pro' | 'max' | undefined;
      try {
        const s = localStorage.getItem('cp_last_plan');
        if (s === 'pro' || s === 'max') expected = s;
      } catch {}
      for (let i = 0; i < maxTries && !cancelled; i++) {
        try {
          try { await refresh?.(); emitBillingUpdated(); } catch {}
          const planNow = (billing?.plan || '').toLowerCase();
          if ((expected && planNow === expected) || (planNow === 'pro' || planNow === 'max')) {
            setRecovered(true);
            break;
          }
          try {
            const invs = await listInvoices();
            const recentCoin = invs.find(inv => (inv.provider || '').toLowerCase() === 'coinpayments');
            if (recentCoin) { setRecovered(true); break; }
          } catch {}
        } catch {}
        await delay(2000);
      }
      if (!cancelled) setChecking(false);
    };
    void run();
    return () => { cancelled = true; };
  }, [provider, refresh, billing]);

  return (
    <TradingLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="trading-card p-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            {recovered ? (
              <>
                <CheckCircle className="h-10 w-10 text-trading-profit" />
                <h1 className="text-2xl font-bold heading-trading">Payment Confirmed</h1>
                <p className="text-muted-foreground">Your CoinPayments order has been confirmed via webhook.</p>
              </>
            ) : (
              <>
                <AlertTriangle className="h-10 w-10 text-trading-loss" />
                <h1 className="text-2xl font-bold heading-trading">Payment Failed</h1>
                <p className="text-muted-foreground">{orderId ? `Order ${orderId} could not be completed.` : 'Your payment could not be completed.'}</p>
                {provider === 'coinpayments' && checking && (
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Waiting for crypto confirmation…
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => navigate('/billing')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Billing
            </Button>
            {recovered ? (
              <Button className="btn-trading-primary" onClick={() => navigate('/billing')}>
                <ArrowLeft className="h-4 w-4 mr-2" /> View Updated Plan
              </Button>
            ) : (
              <Button className="btn-trading-primary" onClick={() => navigate('/pricing')}>
                <RotateCcw className="h-4 w-4 mr-2" /> Try Again
              </Button>
            )}
          </div>
        </Card>
      </div>
    </TradingLayout>
  );
}
