import { useEffect, useMemo, useState } from "react";
import { CashfreePlanCheckout } from "@/components/billing/CashfreePlanCheckout";

import { TradingLayout } from "@/components/layout/TradingLayout";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { listInvoices, downloadInvoice, type InvoiceInfo, listTransactions, type TransactionInfo, checkCashfreeFinalized, finalizeCashfreeNow, getPlanDetails, type PlanDetailsResponse } from "@/lib/api/billing";
import { emitBillingUpdated } from "@/lib/billingEvents";

import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Plus,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Search
} from "lucide-react";
import { useBillingSummary } from "@/hooks/useBillingSummary";

// removed hardcoded currentPlan; using API-driven plan details

// (transactions API types imported above)

const creditUsage = [
  { date: "2024-01-22", single: 12, multiAI: 2, total: 3300 },
  { date: "2024-01-21", single: 8, multiAI: 1, total: 1950 },
  { date: "2024-01-20", single: 15, multiAI: 0, total: 2250 },
  { date: "2024-01-19", single: 6, multiAI: 3, total: 3150 },
  { date: "2024-01-18", single: 10, multiAI: 1, total: 2250 }
];

export function Billing() {
  // Lock billing UI in production by default unless explicitly unlocked
  const isProd = import.meta.env.MODE === 'production';
  const LOCKED_FLAG = String(import.meta.env.VITE_BILLING_LOCKED ?? (isProd ? 'true' : 'false')).toLowerCase();
  const UNLOCK_FLAG = String(import.meta.env.VITE_BILLING_UNLOCK ?? 'false').toLowerCase();
  const billingLocked = (LOCKED_FLAG === 'true') && (UNLOCK_FLAG !== 'true');

  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [creditAmount, setCreditAmount] = useState(1000);
  const { data: billing, loading: billingLoading, error: billingError, refresh: refreshBilling } = useBillingSummary();
  const [planDetails, setPlanDetails] = useState<PlanDetailsResponse | null>(null);
  const [planLoading, setPlanLoading] = useState<boolean>(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<TransactionInfo[] | null>(null);
  const [txnLoading, setTxnLoading] = useState<boolean>(false);
  const [txnError, setTxnError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<InvoiceInfo[]>([]);
  const [invLoading, setInvLoading] = useState<boolean>(false);
  const [invError, setInvError] = useState<string | null>(null);
  const { toast } = useToast();
  const [finalizeChecking, setFinalizeChecking] = useState<boolean>(false);
  const [finalized, setFinalized] = useState<boolean>(false);
  const [finalizedInvoiceId, setFinalizedInvoiceId] = useState<string | null>(null);
  const [finalizeRunning, setFinalizeRunning] = useState<boolean>(false);
  const [bannerVisible, setBannerVisible] = useState<boolean>(true);
  // Auto-start plan checkout if URL contains ?plan=pro|max
  const planParam = (() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const p = (sp.get("plan") || "").toLowerCase();
      if (p === "pro" || p === "max") return p as "pro" | "max";
    } catch { }
    return undefined;
  })();

  // Parse payment status banner
  const paymentBanner = useMemo(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const status = (sp.get("status") || "").toLowerCase();
      const orderId = sp.get("order_id") || undefined;
      if (!status) return null;
      return { status, orderId } as { status: "success" | "failed" | "pending" | string; orderId?: string };
    } catch {
      return null;
    }
  }, []);

  // Load plan details
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setPlanLoading(true);
      setPlanError(null);
      try {
        const data = await getPlanDetails();
        if (!cancelled) setPlanDetails(data);
      } catch (e: any) {
        if (!cancelled) setPlanError(e?.message || "Failed to load plan details");
      } finally {
        if (!cancelled) setPlanLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  // Load transactions
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setTxnLoading(true);
      setTxnError(null);
      try {
        const data = await listTransactions();
        if (!cancelled) setTransactions(data);
      } catch (e: any) {
        if (!cancelled) setTxnError(e?.message || "Failed to load transactions");
      } finally {
        if (!cancelled) setTxnLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  // Load invoices
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setInvLoading(true);
      setInvError(null);
      try {
        const data = await listInvoices();
        if (!cancelled) setInvoices(data);
      } catch (e: any) {
        if (!cancelled) setInvError(e?.message || "Failed to load invoices");
      } finally {
        if (!cancelled) setInvLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  // React to payment status
  useEffect(() => {
    if (!paymentBanner) return;
    // Show the banner when status param is present
    setBannerVisible(true);
    // Auto-hide after 5 minutes
    const hideTimer = setTimeout(() => setBannerVisible(false), 5 * 60 * 1000);
    // Refresh billing summary for authoritative values
    try { refreshBilling?.(); } catch { }
    const { status, orderId } = paymentBanner;
    if (status === "success") {
      toast({ title: "Payment successful", description: orderId ? `Order ${orderId} confirmed.` : undefined });
      // Poll webhook finalize endpoint to update UI
      if (orderId) {
        let cancelled = false;
        const run = async () => {
          setFinalizeChecking(true);
          const maxTries = 12; // ~24s
          const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
          for (let i = 0; i < maxTries && !cancelled; i++) {
            try {
              const res = await checkCashfreeFinalized(orderId);
              if (res.finalized) {
                setFinalized(true);
                setFinalizedInvoiceId(res.invoice_id || null);
                try { await refreshBilling?.(); } catch { }
                break;
              }
            } catch { }
            await delay(2000);
          }
          if (!cancelled) setFinalizeChecking(false);
        };
        void run();
        return () => { cancelled = true; };
      }
    } else if (status === "failed") {
      toast({ title: "Payment failed", description: orderId ? `Order ${orderId} failed.` : undefined, variant: "destructive" });
    } else if (status === "pending") {
      toast({ title: "Payment pending", description: orderId ? `Awaiting confirmation for ${orderId}.` : undefined });
    }
    // Optionally strip status params from URL after a short delay
    const t = setTimeout(() => {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("status");
        // keep order_id for invoices lookup if you want, else remove both
        // url.searchParams.delete("order_id");
        window.history.replaceState({}, "", url.toString());
      } catch { }
    }, 2500);
    return () => { clearTimeout(t); clearTimeout(hideTimer); };
  }, [paymentBanner, refreshBilling, toast]);

  const getCreditCost = (credits: number) => {
    const currentPlanName = (planDetails?.plan || billing?.plan || 'free').toLowerCase();
    const baseRate = currentPlanName === 'max' ? 20 : 25;
    return (credits / 1000) * baseRate;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-trading-profit";
      case "processing": return "text-yellow-500";
      case "failed": return "text-trading-loss";
      default: return "text-muted-foreground";
    }
  };

  if (billingLocked) {
    return (
      <TradingLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="trading-card p-8 text-center">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold heading-trading">Billing Temporarily Locked</h1>
              <p className="text-muted-foreground text-sm">
                Billing operations are disabled in production at the moment. Please try again later or contact support.
              </p>
            </div>
          </Card>
        </div>
      </TradingLayout>
    );
  }

  return (
    <TradingLayout>
      <div className="space-y-6">
        {/* Payment finalization banner */}
        {paymentBanner?.status === 'success' && bannerVisible && (
          <Card className="trading-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {finalizeChecking && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {finalizeChecking ? 'Finalizing your upgrade…' : finalized ? 'Upgrade complete' : 'Awaiting confirmation'}
                  </p>
                  {paymentBanner.orderId && (
                    <p className="text-xs text-muted-foreground">Order {paymentBanner.orderId}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {finalized && finalizedInvoiceId && (
                  <Button size="sm" variant="outline" onClick={() => downloadInvoice(finalizedInvoiceId)}>
                    <Download className="h-4 w-4 mr-1" /> Invoice
                  </Button>
                )}
                {!finalized && paymentBanner?.orderId && (
                  <Button size="sm" variant="outline" disabled={finalizeRunning} onClick={async () => {
                    try {
                      setFinalizeRunning(true);
                      // Pass plan hint if present in URL so backend can finalize even if tags were missing
                      let hintPlan = planParam;
                      if (!hintPlan) {
                        try {
                          const stored = localStorage.getItem('cf_last_plan');
                          if (stored === 'pro' || stored === 'max') hintPlan = stored as 'pro' | 'max';
                        } catch {}
                      }
                      const res = await finalizeCashfreeNow(paymentBanner.orderId!, hintPlan ? { plan: hintPlan } : undefined);
                      if (res?.finalized) {
                        setFinalized(true);
                        if (res.invoice_id) setFinalizedInvoiceId(res.invoice_id);
                        try { await refreshBilling?.(); } catch { }
                        try { localStorage.removeItem('cf_last_plan'); } catch {}
                        try { emitBillingUpdated(); } catch {}
                      } else {
                        // Invoice generation can lag by a second; poll briefly
                        try {
                          const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
                          for (let i = 0; i < 5; i++) {
                            const chk = await checkCashfreeFinalized(paymentBanner.orderId!);
                            if (chk.finalized) {
                              setFinalized(true);
                              if (chk.invoice_id) setFinalizedInvoiceId(chk.invoice_id);
                              try { await refreshBilling?.(); } catch { }
                              try { localStorage.removeItem('cf_last_plan'); } catch {}
                              try { emitBillingUpdated(); } catch {}
                              break;
                            }
                            await delay(1000);
                          }
                        } catch { }
                      }
                    } finally {
                      setFinalizeRunning(false);
                    }
                  }}>
                    {finalizeRunning ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
                    Finalize Now
                  </Button>
                )}
                <Button size="sm" onClick={() => refreshBilling?.()} disabled={billingLoading} className="btn-trading-primary">
                  {billingLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
                  Refresh
                </Button>
              </div>
            </div>
          </Card>
        )}
        {planParam ? <CashfreePlanCheckout plan={planParam} /> : null}
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold heading-trading">Billing & Payments</h1>
            <p className="text-muted-foreground mt-1">
              Manage your subscription, credits, and payment history
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Dialog open={showAddCredits} onOpenChange={setShowAddCredits}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Buy Credits
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Purchase Additional Credits</DialogTitle>
                  <DialogDescription>
                    Add more credits to your account for additional AI analyses
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="credits">Number of Credits</Label>
                    <Select onValueChange={(value) => setCreditAmount(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select credit amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000">1,000 credits - ${getCreditCost(1000)}</SelectItem>
                        <SelectItem value="2500">2,500 credits - ${getCreditCost(2500)}</SelectItem>
                        <SelectItem value="5000">5,000 credits - ${getCreditCost(5000)}</SelectItem>
                        <SelectItem value="10000">10,000 credits - ${getCreditCost(10000)}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-dark rounded-lg">
                    <span>Total Cost:</span>
                    <span className="text-xl font-bold text-foreground">${getCreditCost(creditAmount)}</span>
                  </div>
                  <Button className="w-full btn-trading-primary">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Purchase Credits
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button className="btn-trading-primary">
              <Download className="h-4 w-4 mr-2" />
              Download Statement
            </Button>
          </div>
        </div>

        {/* Current Plan Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="trading-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Current Plan</h3>
                <p className="text-sm text-muted-foreground">Active subscription</p>
              </div>
              <Badge className="bg-gradient-primary">
                {(() => {
                  const p = (planDetails?.plan || billing?.plan || 'free');
                  return p;
                })()}
              </Badge>
            </div>
            <div className="space-y-3">
              {planError && (
                <p className="text-sm text-destructive">{planError}</p>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Monthly Cost:</span>
                <span className="font-medium text-foreground">{planLoading ? '…' : `$${(planDetails?.monthly_price_usd ?? 0).toFixed(0)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Next Billing:</span>
                <span className="font-medium text-foreground">{planLoading ? '…' : (planDetails?.next_billing_date_iso || '')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3 text-trading-profit" />
                  <span className="text-sm font-medium text-trading-profit">{(planDetails?.status || 'active').charAt(0).toUpperCase() + (planDetails?.status || 'active').slice(1)}</span>
                </div>
              </div>
              {(() => {
                const current = (billing?.plan || "free").toLowerCase();
                const nextPlan = current === 'free' ? 'pro' : (current === 'pro' ? 'max' : undefined);
                const label = nextPlan ? `Upgrade to ${nextPlan.toUpperCase()}` : 'On Highest Plan';
                const disabled = !nextPlan;
                return (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    disabled={disabled}
                    onClick={() => {
                      if (!nextPlan) return;
                      try { window.location.href = `/billing?plan=${nextPlan}`; } catch { window.location.href = '/billing'; }
                    }}
                  >
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                );
              })()}
            </div>
          </Card>

          <Card className="trading-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Credits Remaining</h3>
                <p className="text-sm text-muted-foreground">Your monthly credits and daily usage</p>
              </div>
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-3">
              {billingError && (
                <p className="text-sm text-destructive">{billingError}</p>
              )}
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">
                  {billingLoading && !billing ? (
                    <span className="text-muted-foreground">…</span>
                  ) : (
                    (billing?.monthly_credits_remaining ?? 0).toLocaleString()
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  of {(billing?.monthly_credits_max ?? 0).toLocaleString()} credits
                </p>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2" aria-label="credits-progress">
                <div
                  className="bg-gradient-primary h-2 rounded-full"
                  style={{
                    width: `${(() => {
                      const max = billing?.monthly_credits_max ?? 0;
                      const rem = billing?.monthly_credits_remaining ?? 0;
                      if (!max) return 0;
                      const pct = Math.floor((rem / max) * 100);
                      return Math.min(100, Math.max(0, pct));
                    })()}%`
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Daily used: {(billing?.daily_credits_spent ?? 0).toLocaleString()}
                  {typeof billing?.daily_cap === 'number' && (
                    <>
                      {" "}/ {(billing?.daily_cap ?? 0).toLocaleString()}
                    </>
                  )}
                </span>
                <span>
                  {(() => {
                    const max = billing?.monthly_credits_max ?? 0;
                    const rem = billing?.monthly_credits_remaining ?? 0;
                    if (!max) return '0%';
                    const pct = Math.floor((rem / max) * 100);
                    return `${Math.min(100, Math.max(0, pct))}%`;
                  })()}
                </span>
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={() => refreshBilling?.()} disabled={billingLoading}>
                  {billingLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Refreshing
                    </>
                  ) : (
                    'Refresh'
                  )}
                </Button>
                <Button size="sm" className="btn-trading-primary" onClick={() => setShowAddCredits(true)}>
                  <Plus className="h-3 w-3 mr-1" /> Buy Credits
                </Button>
              </div>
            </div>
          </Card>

          <Card className="trading-card p-6 hidden ">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Account Balance</h3>
                <p className="text-sm text-muted-foreground">Available funds</p>
              </div>
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">$2,847.92</p>
                <p className="text-sm text-trading-profit">+$124.50 today</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" className="btn-trading-primary">
                  <Plus className="h-3 w-3 mr-1" />
                  Deposit
                </Button>
                <Button size="sm" variant="outline">
                  <ArrowDownLeft className="h-3 w-3 mr-1" />
                  Withdraw
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Billing Tabs */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="credits">Credit Usage</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          {/* Transaction History */}
          <TabsContent value="transactions">
            <Card className="trading-card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
                    <p className="text-sm text-muted-foreground">All account transactions and payments</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search transactions..." className="pl-10 w-64" />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="subscription">Subscriptions</SelectItem>
                        <SelectItem value="credits">Credits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {txnError && (
                    <p className="text-sm text-destructive">{txnError}</p>
                  )}
                  {txnLoading && !transactions && (
                    <p className="text-sm text-muted-foreground">Loading…</p>
                  )}
                  {!txnLoading && !txnError && (transactions?.length ?? 0) === 0 && (
                    <p className="text-sm text-muted-foreground">No transactions yet.</p>
                  )}
                  {(transactions || []).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-dark border border-border/20">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-primary/10 flex items-center justify-center">
                          {transaction.type === 'subscription' && <Calendar className="h-5 w-5 text-primary" />}
                          {transaction.type === 'credits' && <Wallet className="h-5 w-5 text-secondary" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{transaction.description}</p>
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <span>{new Date(transaction.date).toLocaleString()}</span>
                            <span>•</span>
                            <span>{transaction.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className={`font-semibold ${transaction.amount > 0 ? 'text-trading-profit' : 'text-foreground'}`}>
                          {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toFixed(2)} {transaction.currency}
                        </p>
                        <div className={`flex items-center space-x-1 ${getStatusColor(transaction.status)}`}>
                          {transaction.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                          {transaction.status === 'processing' && <Loader2 className="h-3 w-3 animate-spin" />}
                          {transaction.status === 'failed' && <AlertTriangle className="h-3 w-3" />}
                          <span className="text-sm font-medium capitalize">{transaction.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Credit Usage */}
          <TabsContent value="credits">
            <Card className="trading-card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Credit Usage Analytics</h3>
                    <p className="text-sm text-muted-foreground">Daily credit consumption breakdown</p>
                  </div>
                  <Select defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">7 Days</SelectItem>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="90days">90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {creditUsage.map((usage, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-dark border border-border/20">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-secondary/10 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{usage.date}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{usage.single} single analyses</span>
                            <span>•</span>
                            <span>{usage.multiAI} multi-AI analyses</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{usage.total.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">credits used</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Invoices */}
          <TabsContent value="invoices">
            <Card className="trading-card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Invoices & Receipts</h3>
                    <p className="text-sm text-muted-foreground">Download your billing documents</p>
                  </div>
                </div>

                {invError && (
                  <p className="text-sm text-destructive">{invError}</p>
                )}
                {invLoading ? (
                  <p className="text-sm text-muted-foreground">Loading…</p>
                ) : (
                  <div className="space-y-3">
                    {invoices.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No invoices yet.</p>
                    ) : (
                      invoices.map((inv) => (
                        <div key={inv.invoice_id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-dark border border-border/20">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-lg bg-gradient-primary/10 flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{inv.invoice_id}</p>
                              <div className="text-sm text-muted-foreground">
                                <span>{new Date(inv.created_at).toLocaleString()}</span>
                                {typeof inv.totals?.amount === 'number' && (
                                  <>
                                    <span> • </span>
                                    <span>{(inv.totals.amount || 0).toFixed(2)} {inv.currency || ''}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => downloadInvoice(inv.invoice_id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TradingLayout>
  );
}