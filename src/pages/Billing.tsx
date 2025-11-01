import { useEffect, useMemo, useState } from "react";
import { CashfreePlanCheckout } from "@/components/billing/CashfreePlanCheckout";
import { CoinPaymentsPlanCheckout } from "@/components/billing/CoinPaymentsPlanCheckout";
import { TradingLayout } from "@/components/layout/TradingLayout";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  listInvoices,
  downloadInvoice,
  type InvoiceInfo,
  listTransactions,
  type TransactionInfo,
  getPlanDetails,
  type PlanDetailsResponse,
  startCashfreeTokensOrder,
  getCashfreeOrderStatus,
} from "@/lib/api/billing";
import clientApi from "@/lib/api/client";
import { load } from "@cashfreepayments/cashfree-js";
import type { Cashfree } from "@cashfreepayments/cashfree-js";
import { CASHFREE_MODE } from "@/config/payments";
import { toast } from "@/components/ui/use-toast";
import { emitBillingUpdated } from "@/lib/billingEvents";
import {
  CreditCard, Download, Calendar, DollarSign, TrendingUp, CheckCircle, Loader2, AlertTriangle, Plus, Wallet,
  ArrowUpRight, ArrowDownLeft, Search, Zap, Clock, RefreshCw, FileText, TrendingDown, Check, X, Award,
  Shield, Crown, Sparkles, BarChart3, Filter
} from "lucide-react";
import { useBillingSummary } from "@/hooks/useBillingSummary";
import { getUserPricing, formatPriceUSDToLocal } from "@/lib/pricing";
import { useAuth } from "@/hooks/useAuth";
import { CryptoCurrencySelector } from "@/components/billing/CryptoCurrencySelector";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend, BarChart, Bar
} from "recharts";

const creditUsageData = [
  { date: "Jan 18", single: 2250, multiAI: 450, total: 2700 },
  { date: "Jan 19", single: 1800, multiAI: 1350, total: 3150 },
  { date: "Jan 20", single: 2250, multiAI: 0, total: 2250 },
  { date: "Jan 21", single: 1200, multiAI: 750, total: 1950 },
  { date: "Jan 22", single: 1800, multiAI: 1500, total: 3300 },
  { date: "Jan 23", single: 2700, multiAI: 2700, total: 5400 },
  { date: "Jan 24", single: 2100, multiAI: 1800, total: 3900 },
];

export function Billing() {
  const isProd = import.meta.env.MODE === "production";
  const CASHFREE_LOCKED = false;
  const billingLocked = false;

  const { user } = useAuth();
  const isIndianUser = useMemo(() => {
    if (!user?.phone) return false;
    return user.phone.startsWith("+91");
  }, [user?.phone]);

  const isCashfreeLocked = !isIndianUser;

  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [creditAmount, setCreditAmount] = useState(100000);
  const [searchTxn, setSearchTxn] = useState("");
  const [searchInv, setSearchInv] = useState("");
  const [filterTxn, setFilterTxn] = useState("all");
  
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
  const [bannerVisible, setBannerVisible] = useState<boolean>(true);
  const [pricingTick, setPricingTick] = useState(0);
  const userPricing = getUserPricing();

  const [showProvider, setShowProvider] = useState<boolean>(false);
  const [pendingPlan, setPendingPlan] = useState<("pro" | "max") | null>(null);
  const [showCryptoSelector, setShowCryptoSelector] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [buyingTokens, setBuyingTokens] = useState<boolean>(false);

  const planParam = (() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const p = (sp.get("plan") || "").toLowerCase();
      if (p === "pro" || p === "max") return p as "pro" | "max";
    } catch {}
    return undefined;
  })();

  useEffect(() => {
    const onFx = () => setPricingTick((x) => x + 1);
    const onStorage = (e: StorageEvent) => {
      if (!e || e.key === "userProfile") setPricingTick((x) => x + 1);
    };
    const onProfile = () => setPricingTick((x) => x + 1);
    window.addEventListener("fx:updated", onFx as EventListener);
    window.addEventListener("storage", onStorage);
    window.addEventListener("profile:updated", onProfile as EventListener);
    return () => {
      window.removeEventListener("fx:updated", onFx as EventListener);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("profile:updated", onProfile as EventListener);
    };
  }, []);

  type Provider = "coinpayments" | "cashfree";
  const providerParam: Provider = useMemo(() => {
    try {
      const path = window.location.pathname.toLowerCase();
      if (path.includes("/billing/coinpayments")) return "coinpayments";
      if (path.includes("/billing/phonepe") || path.includes("/billing/cashfree"))
        return isCashfreeLocked ? "coinpayments" : "cashfree";
    } catch {}
    try {
      const sp = new URLSearchParams(window.location.search);
      const prov = (sp.get("provider") || "").toLowerCase();
      if (prov === "coinpayments") return "coinpayments";
    } catch {}
    return isCashfreeLocked ? "coinpayments" : "cashfree";
  }, [isCashfreeLocked, CASHFREE_LOCKED]);

  const currencyParam = useMemo(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      return sp.get("currency") || undefined;
    } catch {}
    return undefined;
  }, []);

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

  useEffect(() => {
    if (!paymentBanner) return;
    setBannerVisible(true);
    const hideTimer = setTimeout(() => setBannerVisible(false), 5 * 60 * 1000);
    try { refreshBilling?.(); } catch {}
    const { status, orderId } = paymentBanner;
    if (status === "success") {
      toast({ title: "Payment successful", description: orderId ? `Order ${orderId} confirmed.` : undefined });
    } else if (status === "failed") {
      toast({ title: "Payment failed", description: orderId ? `Order ${orderId} failed.` : undefined, variant: "destructive" });
    } else if (status === "cancelled") {
      toast({ title: "Payment cancelled", description: orderId ? `Order ${orderId} was cancelled.` : undefined, variant: "destructive" });
    } else if (status === "pending") {
      toast({ title: "Payment pending", description: orderId ? `Awaiting confirmation for ${orderId}.` : undefined });
    }
    const t = setTimeout(() => {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("status");
        window.history.replaceState({}, "", url.toString());
      } catch {}
    }, 2500);
    return () => {
      clearTimeout(t);
      clearTimeout(hideTimer);
    };
  }, [paymentBanner, refreshBilling, toast]);

  const getCreditCost = (credits: number) => {
    const bundlePricesUSD: Record<number, number> = {
      100000: 1.0,
      500000: 4.0,
      1000000: 7.5,
      5000000: 30.0,
    };
    if (credits in bundlePricesUSD) return bundlePricesUSD[credits];
    return (credits / 1_000_000) * 7.5;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-trading-profit";
      case "processing": return "text-yellow-500";
      case "failed": return "text-trading-loss";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-trading-profit/10 text-trading-profit border-trading-profit/20"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>;
      case "processing":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "failed":
        return <Badge className="bg-trading-loss/10 text-trading-loss border-trading-loss/20"><X className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(t => {
      const matchesSearch = searchTxn === "" ||
        t.description.toLowerCase().includes(searchTxn.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTxn.toLowerCase());
      const matchesFilter = filterTxn === "all" || t.type === filterTxn;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchTxn, filterTxn]);

  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];
    return invoices.filter(inv =>
      searchInv === "" ||
      inv.invoice_id.toLowerCase().includes(searchInv.toLowerCase())
    );
  }, [invoices, searchInv]);

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
      <div className="space-y-6 pb-8">
        {(() => {
          const planName = (planDetails?.plan || billing?.plan || "free").toLowerCase();
          const isFree = planName === "free";
          const rem = billing?.monthly_credits_remaining ?? 0;
          const low = rem > 0 && rem < 50_000;
          if (!isFree || !low) return null;
          return (
            <Card className="trading-card p-4 border-yellow-500/30 animate-in slide-in-from-top-2 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-500">Low tokens on Free plan</p>
                    <p className="text-xs text-muted-foreground">
                      You have {rem.toLocaleString()} tokens left. Free plan has no monthly renewal. To continue analyses, please add tokens via our Telegram or upgrade to PRO/MAX.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="inline-flex items-center gap-2 px-2 sm:px-3" variant="secondary" onClick={() => {
                    window.open("https://t.me/+n0jVrMKTReg0Y2M1", "_blank", "noopener,noreferrer");
                  }}>
                    <img src="/telegram.png" alt="Telegram" width={20} height={20} />
                    <span className="hidden sm:inline">Join Telegram</span>
                  </Button>
                  <Button size="sm" className="btn-trading-primary" onClick={() => {
                    setPendingPlan("pro");
                    setShowProvider(true);
                  }}>Upgrade to PRO</Button>
                </div>
              </div>
            </Card>
          );
        })()}

        {paymentBanner?.status === "success" && bannerVisible && (
          <Card className="trading-card p-4 animate-in slide-in-from-top-2 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 text-trading-profit" />
                <div>
                  <p className="text-sm font-medium text-foreground">Payment successful</p>
                  {paymentBanner.orderId && <p className="text-xs text-muted-foreground">Order {paymentBanner.orderId}</p>}
                </div>
              </div>
              <Button size="sm" onClick={() => refreshBilling?.()} disabled={billingLoading} className="btn-trading-primary">
                {billingLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
                Refresh
              </Button>
            </div>
          </Card>
        )}

        {planParam ? (
          providerParam === "coinpayments" ? (
            <CoinPaymentsPlanCheckout plan={planParam} currency={currencyParam} />
          ) : (
            <CashfreePlanCheckout plan={planParam} />
          )
        ) : null}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in fade-in-50 duration-700">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Billing & Payments</h1>
            <p className="text-muted-foreground mt-1">Manage your subscription, tokens, and payment history</p>
          </div>
        </div>

        {/* Visual Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-700">
          {/* Current Plan Card */}
          <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Plan</CardTitle>
                <Crown className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {planLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="space-y-2">
                  <Badge
                    className={(() => {
                      const p = (planDetails?.plan || billing?.plan || "free").toLowerCase();
                      if (p === "free") return "bg-gradient-to-r from-gray-500 to-gray-600 text-white text-base px-3 py-1";
                      if (p === "pro") return "bg-gradient-to-r from-blue-500 to-primary text-white text-base px-3 py-1";
                      if (p === "max") return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-base px-3 py-1";
                      return "bg-gradient-to-r from-primary to-primary/80 text-white text-base px-3 py-1";
                    })()}
                  >
                    {(planDetails?.plan || billing?.plan || "free").toUpperCase()}
                  </Badge>
                  {planDetails?.is_expiring_soon && planDetails?.days_until_expiry !== null && (
                    <p className="text-xs text-yellow-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Expires in {planDetails.days_until_expiry} days
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Credits Remaining Card */}
          <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Credits Remaining</CardTitle>
                <Zap className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {billingLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-foreground">
                    {(billing?.monthly_credits_remaining ?? 0).toLocaleString()}
                  </p>
                  <Progress
                    value={(() => {
                      const max = billing?.monthly_credits_max ?? 0;
                      const rem = billing?.monthly_credits_remaining ?? 0;
                      if (!max) return 0;
                      return Math.floor((rem / max) * 100);
                    })()}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {(() => {
                      const max = billing?.monthly_credits_max ?? 0;
                      const rem = billing?.monthly_credits_remaining ?? 0;
                      if (!max) return "0% of total";
                      const pct = Math.floor((rem / max) * 100);
                      return `${pct}% of ${max.toLocaleString()} total`;
                    })()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Credits Used This Month Card */}
          <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Used This Month</CardTitle>
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {billingLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-foreground">
                    {(() => {
                      const max = billing?.monthly_credits_max ?? 0;
                      const rem = billing?.monthly_credits_remaining ?? 0;
                      return (max - rem).toLocaleString();
                    })()}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <TrendingUp className="h-3 w-3 text-trading-profit" />
                    <span className="text-muted-foreground">
                      {billing?.daily_credits_spent ?? 0} today
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Billing Date Card */}
          <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Next Billing</CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {planLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    {planDetails?.next_billing_date_human || "No renewal"}
                  </p>
                  {planDetails?.status && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {planDetails.status === "active" ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1 text-trading-profit" />
                            Auto-renewal ON
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3 mr-1 text-muted-foreground" />
                            {planDetails.status}
                          </>
                        )}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Plan Details Card */}
        <Card className="bg-gradient-to-br from-primary/5 via-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg animate-in zoom-in-95 duration-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Plan Details
                </CardTitle>
                <CardDescription className="mt-1">Your subscription benefits and features</CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => refreshBilling?.()}
                      disabled={billingLoading || planLoading}
                      className="hover:bg-primary/10 transition-colors"
                    >
                      <RefreshCw className={`h-4 w-4 ${billingLoading || planLoading ? "animate-spin" : ""}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh billing data</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            {planLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : planError ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">{planError}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Monthly Credits</p>
                      <p className="text-lg font-semibold text-foreground">
                        {(billing?.monthly_credits_max ?? 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Daily Limit</p>
                      <p className="text-lg font-semibold text-foreground">
                        {billing?.daily_cap ? billing.daily_cap.toLocaleString() : "Unlimited"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Monthly Price</p>
                      <p className="text-lg font-semibold text-foreground">
                        {planDetails?.monthly_price_usd ? `$${planDetails.monthly_price_usd.toFixed(2)}/mo` : "Free"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Provider</p>
                      <p className="text-lg font-semibold text-foreground capitalize">
                        {planDetails?.provider || "None"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-border/30 pt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Plan Features</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                        <Check className="h-4 w-4 text-trading-profit" />
                        <span>AI Trading Signals</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                        <Check className="h-4 w-4 text-trading-profit" />
                        <span>Multi-AI Analysis</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                        <Check className="h-4 w-4 text-trading-profit" />
                        <span>Live Market Data</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                        <Check className="h-4 w-4 text-trading-profit" />
                        <span>Trading Journal</span>
                      </div>
                      {(planDetails?.plan || billing?.plan || "free").toLowerCase() !== "free" && (
                        <>
                          <div className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                            <Check className="h-4 w-4 text-trading-profit" />
                            <span>Priority Support</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                            <Check className="h-4 w-4 text-trading-profit" />
                            <span>Advanced Analytics</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="space-y-3">
                    {planDetails?.is_expiring_soon && planDetails?.days_until_expiry !== null && (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 animate-pulse">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-500">Plan Expiring Soon</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Your plan expires in {planDetails.days_until_expiry} days
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all hover:scale-105"
                      onClick={() => {
                        setPendingPlan((planDetails?.plan || billing?.plan || "free").toLowerCase() === "pro" ? "max" : "pro");
                        setShowProvider(true);
                      }}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {(planDetails?.plan || billing?.plan || "free").toLowerCase() === "free"
                        ? "Upgrade to PRO"
                        : (planDetails?.plan || billing?.plan || "free").toLowerCase() === "pro"
                        ? "Upgrade to MAX"
                        : "Change Plan"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-primary/10 hover:border-primary transition-colors"
                      disabled
                      onClick={() => setShowAddCredits(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Buy Tokens
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Billing Tabs */}
        <Tabs defaultValue="usage" className="space-y-6 animate-in fade-in-50 duration-700">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="usage" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <BarChart3 className="h-4 w-4 mr-2" />
              Credit Usage
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Wallet className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="invoices" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <FileText className="h-4 w-4 mr-2" />
              Invoices
            </TabsTrigger>
          </TabsList>

          {/* Credit Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <Card className="bg-gradient-glass backdrop-blur-sm border-border/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Credit Usage Over Time
                    </CardTitle>
                    <CardDescription>Track your Single AI vs Multi-AI credit consumption</CardDescription>
                  </div>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                      <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={creditUsageData}>
                    <defs>
                      <linearGradient id="colorSingle" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMulti" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '0.75rem' }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '0.75rem' }} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="single"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorSingle)"
                      name="Single AI"
                    />
                    <Area
                      type="monotone"
                      dataKey="multiAI"
                      stroke="hsl(var(--secondary))"
                      fillOpacity={1}
                      fill="url(#colorMulti)"
                      name="Multi-AI"
                    />
                  </AreaChart>
                </ResponsiveContainer>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Single AI Usage</p>
                        <p className="text-2xl font-bold text-foreground mt-1">
                          {creditUsageData.reduce((sum, d) => sum + d.single, 0).toLocaleString()}
                        </p>
                      </div>
                      <Zap className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Multi-AI Usage</p>
                        <p className="text-2xl font-bold text-foreground mt-1">
                          {creditUsageData.reduce((sum, d) => sum + d.multiAI, 0).toLocaleString()}
                        </p>
                      </div>
                      <Sparkles className="h-8 w-8 text-secondary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="transactions">
            <Card className="trading-card">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
                    <p className="text-sm text-muted-foreground">All account transactions and payments</p>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search transactions..."
                        className="pl-10 w-full sm:w-64"
                        value={searchTxn}
                        onChange={(e) => setSearchTxn(e.target.value)}
                      />
                    </div>
                    <Select value={filterTxn} onValueChange={setFilterTxn}>
                      <SelectTrigger className="w-32">
                        <Filter className="h-4 w-4 mr-2" />
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

                <div className="space-y-3">
                  {txnError && (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-3" />
                      <p className="text-sm text-destructive">{txnError}</p>
                    </div>
                  )}
                  {txnLoading && !transactions ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border/20">
                          <div className="flex items-center space-x-4 flex-1">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                          <Skeleton className="h-8 w-24" />
                        </div>
                      ))}
                    </div>
                  ) : !txnLoading && !txnError && filteredTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-6">
                        <Wallet className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">
                        {searchTxn || filterTxn !== "all" ? 'No Matching Transactions' : 'No Transactions Yet'}
                      </h3>
                      <p className="text-muted-foreground text-center mb-6 max-w-md">
                        {searchTxn || filterTxn !== "all" 
                          ? 'Try adjusting your search or filter to find transactions.'
                          : 'Your transaction history will appear here once you make your first purchase or subscription.'}
                      </p>
                      {(searchTxn || filterTxn !== "all") ? (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchTxn("");
                            setFilterTxn("all");
                          }}
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          Clear Filters
                        </Button>
                      ) : (
                        <Button 
                          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          View Plans
                        </Button>
                      )}
                    </div>
                  ) : (
                    filteredTransactions.map((transaction, idx) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-card/50 to-card border border-border/20 hover:border-primary/30 hover:shadow-md transition-all duration-300 animate-in slide-in-from-left-4"
                        style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'backwards' }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`h-10 w-10 rounded-lg ${transaction.type === "subscription" ? "bg-gradient-primary/10" : "bg-gradient-to-br from-secondary/10 to-secondary/5"} flex items-center justify-center`}>
                            {transaction.type === "subscription" && <Calendar className="h-5 w-5 text-primary" />}
                            {transaction.type === "credits" && <Wallet className="h-5 w-5 text-secondary" />}
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
                          <p className={`font-semibold ${transaction.amount > 0 ? "text-trading-profit" : "text-foreground"}`}>
                            {transaction.amount > 0 ? "+" : ""}
                            {Math.abs(transaction.amount).toFixed(2)} {transaction.currency}
                          </p>
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <Card className="trading-card">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Invoices & Receipts</h3>
                    <p className="text-sm text-muted-foreground">Download your billing documents</p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices..."
                      className="pl-10"
                      value={searchInv}
                      onChange={(e) => setSearchInv(e.target.value)}
                    />
                  </div>
                </div>

                {invError && (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-3" />
                    <p className="text-sm text-destructive">{invError}</p>
                  </div>
                )}
                {invLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border/20">
                        <div className="flex items-center space-x-4 flex-1">
                          <Skeleton className="h-10 w-10 rounded-lg" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-8" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredInvoices.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-6">
                          <FileText className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">
                          {searchInv ? 'No Matching Invoices' : 'No Invoices Yet'}
                        </h3>
                        <p className="text-muted-foreground text-center mb-6 max-w-md">
                          {searchInv 
                            ? 'Try a different search term to find your invoices.'
                            : 'Your billing invoices and receipts will appear here after your first payment.'}
                        </p>
                        {searchInv ? (
                          <Button
                            variant="outline"
                            onClick={() => setSearchInv("")}
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Clear Search
                          </Button>
                        ) : (
                          <Button 
                            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          >
                            <Crown className="h-4 w-4 mr-2" />
                            Explore Plans
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent">
                              <TableHead>Invoice ID</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredInvoices.map((inv, idx) => (
                              <TableRow
                                key={inv.invoice_id}
                                className="hover:bg-primary/5 transition-colors animate-in fade-in-50"
                                style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'backwards' }}
                              >
                                <TableCell className="font-medium">{inv.invoice_id}</TableCell>
                                <TableCell>{new Date(inv.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  {typeof inv.totals?.amount === "number"
                                    ? `${(inv.totals.amount || 0).toFixed(2)} ${inv.currency || ""}`
                                    : "—"}
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-trading-profit/10 text-trading-profit border-trading-profit/20">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Paid
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="hover:bg-primary/10 transition-colors"
                                          onClick={() => downloadInvoice(inv.invoice_id)}
                                        >
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Download invoice</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Credits Dialog (existing implementation continues...) */}
        <Dialog open={showAddCredits} onOpenChange={setShowAddCredits}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Purchase Additional Tokens</DialogTitle>
              <DialogDescription>
                {isCashfreeLocked
                  ? "PhonePe is only available for Indian users (+91)."
                  : "Add more tokens to your account for additional AI analyses"}
              </DialogDescription>
            </DialogHeader>
            <div className={`space-y-4 ${isCashfreeLocked ? "opacity-50 pointer-events-none select-none" : ""}`}>
              <div>
                <Label htmlFor="credits">Number of Tokens</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[100000, 500000, 1000000, 5000000].map((amount) => (
                    <Button
                      key={amount}
                      variant={creditAmount === amount ? "default" : "outline"}
                      className={`flex flex-col h-auto py-3 ${creditAmount === amount ? "border-primary ring-2 ring-primary/20" : ""}`}
                      onClick={() => setCreditAmount(amount)}
                    >
                      <span className="text-xs text-muted-foreground">
                        {(amount / 1000).toLocaleString()}k tokens
                      </span>
                      <span className="text-lg font-bold mt-1">
                        {formatPriceUSDToLocal(getCreditCost(amount), userPricing)}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-dark rounded-lg border border-border/20">
                <span>Total Cost:</span>
                <span className="text-2xl font-bold text-foreground">
                  {formatPriceUSDToLocal(getCreditCost(creditAmount), userPricing)}
                </span>
              </div>
              <Button
                className="w-full btn-trading-primary"
                disabled={isCashfreeLocked || buyingTokens}
              >
                {buyingTokens ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Purchase Tokens
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Provider selection modal */}
        <Dialog open={showProvider} onOpenChange={setShowProvider}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Choose payment method</DialogTitle>
              <DialogDescription>
                Select how you want to pay for the {pendingPlan ? pendingPlan.toUpperCase() : ""} plan.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <Button
                className="w-full btn-trading-primary"
                title={
                  !isIndianUser
                    ? "Cashfree is only available for Indian users"
                    : CASHFREE_LOCKED
                    ? "Cashfree is temporarily locked in production"
                    : undefined
                }
                disabled={!isIndianUser || CASHFREE_LOCKED}
                onClick={() => {
                  if (!pendingPlan) return;
                  try {
                    const url = new URL(window.location.href);
                    const currentInterval = new URLSearchParams(window.location.search).get("interval");
                    url.searchParams.set("plan", pendingPlan);
                    if (currentInterval) url.searchParams.set("interval", currentInterval);
                    url.searchParams.set("provider", "cashfree");
                    window.location.href = url.toString();
                  } catch {
                    window.location.href = `/billing?plan=${pendingPlan}&provider=cashfree`;
                  }
                }}
              >
                Pay with Card / UPI (Cashfree)
              </Button>
              <p className="text-[11px] text-muted-foreground text-center -mt-1">
                Fast checkout with UPI, cards, and netbanking.
              </p>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  if (!pendingPlan) return;
                  setShowProvider(false);
                  setShowCryptoSelector(true);
                }}
              >
                Pay with Crypto (CoinPayments)
              </Button>
              <p className="text-[11px] text-muted-foreground text-center -mt-1">
                Supports BTC, ETH, LTC and more.
              </p>
              {isCashfreeLocked && (
                <p className="text-xs text-muted-foreground text-center">
                  {!isIndianUser
                    ? "Cashfree is only available for Indian users. Please use CoinPayments for crypto payments."
                    : "Cashfree checkout is temporarily disabled. CoinPayments remains available."}
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Cryptocurrency selection modal */}
        <CryptoCurrencySelector
          open={showCryptoSelector}
          onOpenChange={setShowCryptoSelector}
          onSelect={(currency) => {
            setSelectedCurrency(currency);
            if (!pendingPlan) return;
            try {
              const currentInterval = new URLSearchParams(window.location.search).get("interval");
              const iv = currentInterval ? `&interval=${encodeURIComponent(currentInterval)}` : "";
              window.location.href = `/billing?plan=${pendingPlan}${iv}&provider=coinpayments&currency=${encodeURIComponent(currency)}`;
            } catch {
              window.location.href = "/billing";
            }
          }}
          plan={pendingPlan || "pro"}
        />
      </div>
    </TradingLayout>
  );
}
