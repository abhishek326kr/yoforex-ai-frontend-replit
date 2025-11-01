import { TradingLayout } from "@/components/layout/TradingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { AlertTriangle, ArrowLeft, RotateCcw, Loader2, CheckCircle, CreditCard, HelpCircle, Mail, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useBillingSummary } from "@/hooks/useBillingSummary";
import { listInvoices } from "@/lib/api/billing";
import { emitBillingUpdated } from "@/lib/billingEvents";
import { motion } from "framer-motion";

export default function BillingFailure() {
  const [, navigate] = useLocation();
  const { data: billing, refresh } = useBillingSummary();
  const spInit = useMemo(() => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ""), []);
  const orderId = useMemo(() => spInit.get("order_id") || undefined, [spInit]);
  const provider = useMemo(() => (spInit.get('provider') || '').toLowerCase(), [spInit]);
  const errorReason = useMemo(() => spInit.get("reason") || undefined, [spInit]);
  const [checking, setChecking] = useState<boolean>(false);
  const [recovered, setRecovered] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
    if (provider !== 'coinpayments') return;
    const run = async () => {
      setChecking(true);
      const maxTries = 15;
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
                {recovered ? (
                  <CheckCircle className="h-24 w-24 text-trading-profit" />
                ) : (
                  <AlertTriangle className="h-24 w-24 text-trading-loss" />
                )}
              </motion.div>
              
              <motion.h1
                className={`text-4xl font-bold ${recovered ? 'bg-gradient-to-r from-trading-profit via-green-400 to-trading-profit' : 'bg-gradient-to-r from-trading-loss via-red-400 to-trading-loss'} bg-clip-text text-transparent`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {recovered ? 'Payment Confirmed!' : 'Payment Failed'}
              </motion.h1>
              
              <motion.p
                className="text-lg text-muted-foreground max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {recovered 
                  ? 'Your CoinPayments order has been confirmed via webhook.' 
                  : 'We encountered an issue processing your payment. Don\'t worry, no charges were made to your account.'}
              </motion.p>

              {provider === 'coinpayments' && checking && (
                <motion.div
                  className="flex items-center justify-center text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Waiting for crypto confirmation…
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        {!recovered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card className="trading-card mt-6 p-6 bg-gradient-to-br from-card to-card/50">
              <h2 className="text-xl font-semibold mb-4 heading-trading">What Went Wrong?</h2>
              <div className="space-y-3">
                {orderId && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-destructive/10">
                      <XCircle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Transaction ID</p>
                      <p className="font-mono text-sm font-medium">{orderId}</p>
                    </div>
                  </div>
                )}
                {errorReason && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-destructive/10">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Error Reason</p>
                      <p className="font-medium">{errorReason}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <p className="font-medium">Transaction could not be completed</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {!recovered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-center heading-trading">Troubleshooting Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="trading-card p-6 h-full cursor-pointer bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-shadow" onClick={() => navigate('/pricing')}>
                  <div className="flex flex-col items-start space-y-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <RotateCcw className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">Try Again</h3>
                    <p className="text-sm text-muted-foreground">
                      Retry the payment with the same or different payment method.
                    </p>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="trading-card p-6 h-full bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col items-start space-y-3">
                    <div className="p-3 rounded-full bg-blue-500/10">
                      <CreditCard className="h-6 w-6 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-lg">Check Payment Method</h3>
                    <p className="text-sm text-muted-foreground">
                      Verify your card details, billing address, and ensure you have sufficient funds.
                    </p>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="trading-card p-6 h-full cursor-pointer bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-shadow" onClick={() => window.location.href = 'mailto:info@yoforex.net'}>
                  <div className="flex flex-col items-start space-y-3">
                    <div className="p-3 rounded-full bg-orange-500/10">
                      <Mail className="h-6 w-6 text-orange-500" />
                    </div>
                    <h3 className="font-semibold text-lg">Contact Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Our team is ready to help you resolve any payment issues.
                    </p>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="trading-card p-6 h-full cursor-pointer bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-shadow" onClick={() => navigate('/billing')}>
                  <div className="flex flex-col items-start space-y-3">
                    <div className="p-3 rounded-full bg-purple-500/10">
                      <HelpCircle className="h-6 w-6 text-purple-500" />
                    </div>
                    <h3 className="font-semibold text-lg">Use Different Method</h3>
                    <p className="text-sm text-muted-foreground">
                      Try an alternative payment method like crypto or a different card.
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
          {recovered ? (
            <>
              <Button
                size="lg"
                className="btn-trading-primary"
                onClick={() => navigate('/billing')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                View Updated Plan
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button
                size="lg"
                className="btn-trading-primary"
                onClick={() => navigate('/pricing')}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = 'mailto:info@yoforex.net'}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => navigate('/billing')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Billing
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
            Common reasons for payment failures include insufficient funds, incorrect card details, or bank restrictions.
          </p>
          <p className="mt-2">
            Need immediate assistance? Contact us at{' '}
            <a href="mailto:info@yoforex.net" className="text-primary hover:underline">
              info@yoforex.net
            </a>
          </p>
        </motion.div>
      </div>
    </TradingLayout>
  );
}
