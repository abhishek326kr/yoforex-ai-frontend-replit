import { TradingLayout } from "@/components/layout/TradingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, Download, ArrowRight, Loader2 } from "lucide-react";
import { useBillingSummary } from "@/hooks/useBillingSummary";
import { downloadInvoice, listInvoices } from "@/lib/api/billing";
import { emitBillingUpdated } from "@/lib/billingEvents";

export default function BillingSuccess() {
  const [, navigate] = useLocation();
  const { data: billing, refresh } = useBillingSummary();
  const [webhookDone, setWebhookDone] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  // Refresh billing on mount
  useEffect(() => { try { refresh?.(); emitBillingUpdated(); } catch {} }, [refresh]);

  const orderId = useMemo(() => {
    const sp = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : "");
    return sp.get("order_id") || undefined;
  }, []);

  // Poll webhook completion by checking if an invoice exists for this order
  useEffect(() => {
    let cancelled = false;
    if (!orderId) { setChecking(false); return; }
    const run = async () => {
      setChecking(true);
      const maxTries = 12; // ~24s
      const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
      for (let i = 0; i < maxTries && !cancelled; i++) {
        try {
          // 1) Check invoices for INV-<orderId>
          const invs = await listInvoices();
          const found = invs.some(inv => inv.invoice_id === `INV-${orderId}`);
          if (found) {
            setWebhookDone(true);
            try { emitBillingUpdated(); } catch {}
            break;
          }
          // 2) Also refresh billing to pick up plan changes
          try { await refresh?.(); emitBillingUpdated(); } catch {}
        } catch {}
        await delay(2000);
      }
      if (!cancelled) setChecking(false);
    };
    void run();
    return () => { cancelled = true; };
  }, [orderId, refresh]);

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
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Finalizing your upgrade…
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
