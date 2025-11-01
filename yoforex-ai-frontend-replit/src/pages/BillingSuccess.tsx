import { TradingLayout } from "@/components/layout/TradingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, Download, ArrowRight, Loader2, Copy, TrendingUp, CreditCard, Calendar, Package, ChartBar, Settings } from "lucide-react";
import { useBillingSummary } from "@/hooks/useBillingSummary";
import { downloadInvoice, listInvoices, checkCashfreeFinalized, finalizeCashfreeNow } from "@/lib/api/billing";
import { emitBillingUpdated } from "@/lib/billingEvents";
import { motion } from "framer-motion";

export default function BillingSuccess() {
  const [, navigate] = useLocation();
  const { data: billing, refresh } = useBillingSummary();
  const startedRef = (typeof window !== 'undefined') ? (window as any).__billing_success_started ?? { current: false } : { current: false };
  if (typeof window !== 'undefined' && !(window as any).__billing_success_started) {
    (window as any).__billing_success_started = startedRef;
  }
  const [webhookDone, setWebhookDone] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => { try { refresh?.(); emitBillingUpdated(); } catch {} }, []);

  const spInit = useMemo(() => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ""), []);
  const provider = useMemo(() => (spInit.get('provider') || '').toLowerCase(), [spInit]);
  const orderId = useMemo(() => {
    const sp = spInit;
    return sp.get("order_id") || undefined;
  }, [spInit]);
  const statusParam = useMemo(() => {
    try { return (spInit.get('status') || '').toLowerCase(); } catch { return undefined; }
  }, [spInit]);
  const [cpChecking, setCpChecking] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
    if (statusParam === 'cancelled') {
      setChecking(false);
      return () => { cancelled = true; };
    }
    if (startedRef.current) {
      return () => { cancelled = true; };
    }
    startedRef.current = true;

    if (provider === 'coinpayments') {
      const runCp = async () => {
        setChecking(true);
        setCpChecking(true);
        const maxTries = 15;
        let expected: 'pro' | 'max' | undefined;
        try {
          const s = localStorage.getItem('cp_last_plan');
          if (s === 'pro' || s === 'max') expected = s;
        } catch {}

        for (let i = 0; i < maxTries && !cancelled; i++) {
          try {
            try { await refresh?.(); } catch {}
            const planNow = (window as any).__latest_billing_plan || (billing?.plan || '').toLowerCase();
            if ((expected && planNow === expected) || (planNow === 'pro' || planNow === 'max')) {
              setWebhookDone(true);
              break;
            }
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

    const run = async () => {
      if (!orderId) { setChecking(false); return; }
      setChecking(true);
      const maxTries = 12;
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
        } catch {}
        await delay(2000);
      }
      if (!cancelled && !webhookDone && orderId) {
        setChecking(false);
      } else {
        if (!cancelled) setChecking(false);
      }
    };
    void run();
    return () => { cancelled = true; };
  }, [provider, orderId]);

  useEffect(() => {
    if (!webhookDone) return;
    const t = setTimeout(() => navigate('/billing'), 6000);
    return () => clearTimeout(t);
  }, [webhookDone, navigate]);

  const isCancelled = statusParam === 'cancelled';
  const isPending = statusParam === 'pending';
  const isSuccess = !isCancelled && !isPending;

  const planPurchased = useMemo(() => {
    if (billing?.plan) {
      const plan = billing.plan.toLowerCase();
      if (plan === 'pro') return 'Pro Plan';
      if (plan === 'max') return 'Max Plan';
    }
    return 'Subscription Plan';
  }, [billing]);

  return (
    <TradingLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="trading-card p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <CheckCircle className={`h-24 w-24 ${isCancelled ? 'text-muted-foreground' : 'text-trading-profit'}`} />
              </motion.div>
              
              <motion.h1
                className="text-4xl font-bold bg-gradient-to-r from-trading-profit via-green-400 to-trading-profit bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {isCancelled ? 'Upgrade Cancelled' : (isPending ? 'Payment Pending' : 'Payment Successful!')}
              </motion.h1>
              
              <motion.p
                className="text-lg text-muted-foreground max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {isCancelled 
                  ? 'You closed or cancelled the checkout. No changes were made to your plan.' 
                  : (isPending 
                    ? 'Your payment is being processed. This may take a few moments.' 
                    : 'Your payment has been successfully processed and your account has been upgraded!')}
              </motion.p>

              {checking && (
                <motion.div
                  className="flex items-center justify-center text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {provider === 'coinpayments' ? 'Waiting for crypto confirmation…' : 'Finalizing your upgrade…'}
                </motion.div>
              )}

              {webhookDone && (
                <motion.div
                  className="flex items-center gap-2 text-sm text-trading-profit"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle className="h-4 w-4" />
                  Upgrade confirmed and invoice generated!
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        {!isCancelled && orderId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card className="trading-card mt-6 p-6 bg-gradient-to-br from-card to-card/50">
              <h2 className="text-xl font-semibold mb-4 heading-trading">Transaction Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm font-medium">{orderId}</p>
                      <button
                        className="inline-flex items-center gap-1 text-xs hover:text-primary transition-colors"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(orderId);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1500);
                          } catch {}
                        }}
                        title="Copy order ID"
                      >
                        <Copy className="h-3 w-3" />
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Plan Purchased</p>
                    <p className="font-medium">{planPurchased}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction Date</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium capitalize">{provider || 'Cashfree'}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {!isCancelled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-center heading-trading">What's Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="trading-card p-6 h-full cursor-pointer bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-shadow" onClick={() => navigate('/trading')}>
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 rounded-full bg-trading-profit/10">
                      <TrendingUp className="h-8 w-8 text-trading-profit" />
                    </div>
                    <h3 className="font-semibold text-lg">Start Trading</h3>
                    <p className="text-sm text-muted-foreground">
                      Begin using your AI-powered trading signals and start making profitable trades.
                    </p>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="trading-card p-6 h-full cursor-pointer bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-shadow" onClick={() => navigate('/billing')}>
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Settings className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">Manage Your Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      View your subscription details, invoices, and manage billing settings.
                    </p>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="trading-card p-6 h-full cursor-pointer bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard')}>
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 rounded-full bg-blue-500/10">
                      <ChartBar className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-lg">View Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Check your portfolio performance, analytics, and trading statistics.
                    </p>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          {!isCancelled && (
            <>
              <Button
                size="lg"
                className="btn-trading-primary"
                onClick={() => navigate('/trading')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Start Trading
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/billing')}
              >
                <Settings className="h-4 w-4 mr-2" />
                View Billing
              </Button>
              {orderId && (
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => downloadInvoice(`INV-${orderId}`)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
              )}
            </>
          )}
          {isCancelled && (
            <>
              <Button
                size="lg"
                className="btn-trading-primary"
                onClick={() => navigate('/billing')}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Back to Billing
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          <p>
            {provider === 'coinpayments'
              ? 'Crypto confirmations may take a few minutes. Your plan will update automatically once confirmed.'
              : !isCancelled && 'Your upgrade will be reflected immediately. You can now access all premium features.'}
          </p>
          <p className="mt-2">
            Need help? Contact support at{' '}
            <a href="mailto:info@yoforex.net" className="text-primary hover:underline">
              info@yoforex.net
            </a>
          </p>
        </motion.div>
      </div>
    </TradingLayout>
  );
}
