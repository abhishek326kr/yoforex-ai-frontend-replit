import { TradingLayout } from "@/components/layout/TradingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, Download, ArrowRight, Loader2 } from "lucide-react";
import { useBillingSummary } from "@/hooks/useBillingSummary";
import { downloadInvoice, listInvoices, checkCashfreeFinalized, finalizeCashfreeNow } from "@/lib/api/billing";
import { emitBillingUpdated } from "@/lib/billingEvents";

export default function BillingSuccess() {
  const [, navigate] = useLocation();
  const { data: billing, refresh } = useBillingSummary();
  // Guard to prevent duplicate polling loops when component re-renders
  const startedRef = (typeof window !== 'undefined') ? (window as any).__billing_success_started ?? { current: false } : { current: false };
  if (typeof window !== 'undefined' && !(window as any).__billing_success_started) {
    (window as any).__billing_success_started = startedRef;
  }
  const [webhookDone, setWebhookDone] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  // Refresh billing on mount
  useEffect(() => { try { refresh?.(); emitBillingUpdated(); } catch {} }, []);

  const spInit = useMemo(() => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ""), []);
  const provider = useMemo(() => (spInit.get('provider') || '').toLowerCase(), [spInit]);
  const orderId = useMemo(() => {
    const sp = spInit;
    return sp.get("order_id") || undefined;
  }, [spInit]);
  const [cpChecking, setCpChecking] = useState<boolean>(false);

  // Poll webhook completion
  // Cashfree: check invoice INV-<orderId> or finalized status.
  // CoinPayments: no orderId query by default; poll for plan change and recent invoice with provider coinpayments.
  useEffect(() => {
    let cancelled = false;
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

    if (startedRef.current) {
      return () => { cancelled = true; };
    }
    startedRef.current = true;

    // CoinPayments flow
    if (provider === 'coinpayments') {
      const runCp = async () => {
        setChecking(true);
        setCpChecking(true);
        const maxTries = 15; // ~30s
        // expected plan from localStorage (optional hint)
        let expected: 'pro' | 'max' | undefined;
        try {
          const s = localStorage.getItem('cp_last_plan');
          if (s === 'pro' || s === 'max') expected = s;
        } catch {}

        for (let i = 0; i < maxTries && !cancelled; i++) {
          try {
            // Check plan from latest hook state; refresh sparingly
            try { await refresh?.(); } catch {}
            const planNow = (window as any).__latest_billing_plan || (billing?.plan || '').toLowerCase();
            if ((expected && planNow === expected) || (planNow === 'pro' || planNow === 'max')) {
              setWebhookDone(true);
              break;
            }
            // Check invoices for any recent CoinPayments invoice
            try {
              const invs = await listInvoices();
              const recentCoin = invs.find(inv => (inv.provider || '').toLowerCase() === 'coinpayments');
              if (recentCoin) {
                setWebhookDone(true);
                break;
              }
            } catch {}
          } catch {}
          await delay(2000);
        }
        setCpChecking(false);
        setChecking(false);
      };
      void runCp();
      return () => { cancelled = true; };
    }

    // Cashfree flow (default)
    const run = async () => {
      if (!orderId) { setChecking(false); return; }
      setChecking(true);
      const maxTries = 12; // ~24s total before attempting manual finalize
      for (let i = 0; i < maxTries && !cancelled; i++) {
        try {
          const invs = await listInvoices();
          const found = invs.some(inv => inv.invoice_id === `INV-${orderId}`);
          if (found) {
            setWebhookDone(true);
            try { emitBillingUpdated(); } catch {}
            break;
          }
          try {
            const status = await checkCashfreeFinalized(orderId);
            if (status?.finalized) {
              setWebhookDone(true);
              try { await refresh?.(); emitBillingUpdated(); } catch {}
              break;
            }
          } catch {}
          // refresh less aggressively; rely on next loop iteration
        } catch {}
        await delay(2000);
      }
      if (!cancelled && !webhookDone && orderId) {
        try {
          await finalizeCashfreeNow(orderId);
          try { await refresh?.(); emitBillingUpdated(); } catch {}
          const invs2 = await listInvoices();
          const found2 = invs2.some(inv => inv.invoice_id === `INV-${orderId}`);
          if (found2) {
            setWebhookDone(true);
          } else {
            try {
              const status2 = await checkCashfreeFinalized(orderId);
              if (status2?.finalized) setWebhookDone(true);
            } catch {}
          }
        } catch {}
      }
      if (!cancelled) setChecking(false);
    };
    void run();
    return () => { cancelled = true; };
  }, [provider, orderId]);

  return (
    <TradingLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="trading-card p-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <CheckCircle className="h-10 w-10 text-trading-profit" />
            <h1 className="text-2xl font-bold heading-trading">Payment Successful</h1>
            <p className="text-muted-foreground">{orderId ? `Order ${orderId} has been confirmed.` : 'Your payment has been confirmed.'}</p>
            {checking && (
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> {provider === 'coinpayments' ? 'Waiting for crypto confirmation…' : 'Finalizing your upgrade…'}
              </div>
            )}
            {!checking && !webhookDone && (
              <p className="text-xs text-muted-foreground">This may take a moment. If your plan has not updated, please refresh the Billing page.</p>
            )}
            {webhookDone && (
              <p className="text-xs text-trading-profit">Invoice generated and upgrade finalized.</p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button className="btn-trading-primary" onClick={() => navigate('/billing')}>
              <ArrowRight className="h-4 w-4 mr-2" /> Go to Billing
            </Button>
            {orderId && (
              <Button variant="outline" onClick={() => downloadInvoice(`INV-${orderId}`)}>
                <Download className="h-4 w-4 mr-2" /> Download Invoice
              </Button>
            )}
          </div>
        </Card>
      </div>
    </TradingLayout>
  );
}
