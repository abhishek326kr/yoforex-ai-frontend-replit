<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
=======
import { useState } from "react";
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
import { TradingLayout } from "@/components/layout/TradingLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
<<<<<<< HEAD
import { useBillingSummary } from "@/hooks/useBillingSummary";
import {
  getUserPricing,
  getUserPricingFromPhone,
  formatPriceUSDToLocal,
  refreshUsdInrRate,
} from "@/lib/pricing";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

=======
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
import {
  Check,
  X,
  Zap,
  Crown,
  Star,
  Shield,
  Clock,
  Users,
  MessageCircle,
  Brain,
  TrendingUp,
  CreditCard,
<<<<<<< HEAD
  DollarSign,
=======
  DollarSign
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
} from "lucide-react";

const plans = {
  free: {
    name: "Free (Basics)",
    price: 0,
    period: "month",
    tagline: "Perfect for getting started with AI trading analysis",
    popular: false,
    credits: {
<<<<<<< HEAD
      daily: 1000000,
      analyses: "Includes 1,000,000 tokens/month",
      resetTimer: true,
    },
    features: [
      "1,000,000 tokens per month",
=======
      daily: 750,
      analyses: "5 AI analyses per day",
      resetTimer: true
    },
    features: [
      "5 AI analyses per day (hard limit with reset timer)",
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
      "Access to free AI models (Mistral, Claude Sonnet, DeepSeek)",
      "10+ professional strategies (premium strategies locked)",
      "Basic SL/TP recommendations",
      "AI trade explanations for basic strategies only",
<<<<<<< HEAD
      "Access to our public Telegram channel",
      "Basic market alerts",
      "Standard customer support (48-hour response)",
=======
      "Access to public Discord & Telegram channels",
      "Basic market alerts",
      "Standard customer support (48-hour response)"
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
    ],
    limitations: [
      "Premium strategies locked",
      "Basic explanations only",
<<<<<<< HEAD
      "Limited timeframe analysis",
    ],
    buttonText: "Start Free",
    buttonVariant: "outline" as const,
=======
      "No multi-AI consensus",
      "Limited timeframe analysis"
    ],
    buttonText: "Start Free",
    buttonVariant: "outline" as const
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
  },
  pro: {
    name: "Pro",
    price: 69,
    period: "month",
<<<<<<< HEAD
    tagline: "Advanced AI trading analysis with generous monthly tokens",
    popular: true,
    credits: {
      daily: 10000000,
      analyses: "Includes 10,000,000 tokens/month",
    },
    features: [
      "10,000,000 tokens per month",
=======
    tagline: "Advanced AI trading analysis for serious traders",
    popular: true,
    credits: {
      daily: 2500,
      analyses: "16 single AI analyses OR 3 multi-AI consensus OR 8 single + 1 multi-AI",
      additional: "$25/1,000 credits"
    },
    features: [
      "2,500 credits per day for Multi AI Consensus Engine",
      "Single AI analysis: 150 credits",
      "Multi-AI analysis (5 AIs): 750 credits",
      "Text analysis: 150 credits, Image: 300 credits",
      "Combined text + image: 450 credits",
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
      "All Free plan features unlocked",
      "Premium AI models with frequent updates",
      "Multi-timeframe analysis (H1, H4, D1, W1)",
      "AI explains every trade with full rationale",
      "Personalized training (upload history, journal, PDFs)",
      "Multi-AI consensus engine",
<<<<<<< HEAD
      "Private Telegram channels",
      "Priority customer support (24-hour response)",
      "Advanced market alerts with customization",
    ],
    limitations: [],
    buttonText: "Start Pro Trial",
    buttonVariant: "default" as const,
=======
      "Private Discord & Telegram channels",
      "Priority customer support (24-hour response)",
      "Advanced market alerts with customization"
    ],
    limitations: [],
    buttonText: "Start Pro Trial",
    buttonVariant: "default" as const
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
  },
  max: {
    name: "Max (Premium)",
    price: 139,
    period: "month",
<<<<<<< HEAD
    tagline: "Massive monthly tokens for professional traders",
    popular: false,
    credits: {
      daily: 50000000,
      analyses: "Includes 50,000,000 tokens/month",
    },
    features: [
      "50,000,000 tokens per month",
=======
    tagline: "Unlimited AI power for professional traders",
    popular: false,
    credits: {
      daily: 10000,
      analyses: "100 single AI analyses OR 20 multi-AI consensus OR 50 single + 10 multi-AI",
      additional: "$20/1,000 credits"
    },
    features: [
      "10,000 credits per day (effectively unlimited)",
      "Reduced credit consumption rates:",
      "Single AI analysis: 100 credits",
      "Multi-AI analysis (5 AIs): 500 credits",
      "Text + Image analysis: 100 credits (combined rate)",
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
      "All Pro plan features included",
      "Multi-timeframe analysis capabilities",
      "Correlation analysis (XAGUSD, XAUUSD, etc.)",
      "Pay-as-you-go for hyper-premium APIs (Grok, OpenAI O3)",
      "Multi-modal analysis (text, images, PDFs)",
      "AI confidence levels & full consensus mechanism",
      "Zero manual effort - hands-free trading AI",
      "Advanced journaling & self-adaptive learning",
      "Unlimited strategy blending & custom prompts",
      "Premium Discord & Telegram communities",
      "White-glove customer support (4-hour response)",
<<<<<<< HEAD
      "Custom strategy development consultation",
    ],
    limitations: [],
    buttonText: "Start Max Trial",
    buttonVariant: "default" as const,
  },
=======
      "Custom strategy development consultation"
    ],
    limitations: [],
    buttonText: "Start Max Trial",
    buttonVariant: "default" as const
  }
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
};

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
<<<<<<< HEAD
  const [showProvider, setShowProvider] = useState<boolean>(false);
  const [pendingPlan, setPendingPlan] = useState<("pro" | "max") | null>(null);
  const { data: billing } = useBillingSummary();
  const { user } = useAuth();
  // Indian user detection via phone prefix +91
  const isIndianUser = useMemo(() => {
    const phone = (user as any)?.phone as string | undefined;
    return !!phone && phone.startsWith("+91");
  }, [user]);
  // Cashfree availability strictly for Indian users
  const isCashfreeLocked = !isIndianUser;
  const currentPlan = (billing?.plan || "free").toLowerCase() as
    | "free"
    | "pro"
    | "max";
  const rank: Record<"free" | "pro" | "max", number> = {
    free: 0,
    pro: 1,
    max: 2,
  };
  const [pricingTick, setPricingTick] = useState(0);
  const userPricing = useMemo(() => {
    const phone = (user as any)?.phone as string | undefined;
    return phone ? getUserPricingFromPhone(phone) : getUserPricing();
  }, [user, pricingTick]);

  useEffect(() => {
    // Prime FX cache (non-blocking)
    void refreshUsdInrRate().catch(() => {
      /* ignore fx refresh errors */
    });
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
=======
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2

  const getPrice = (basePrice: number) => {
    if (basePrice === 0) return 0;
    return isAnnual ? Math.floor(basePrice * 10) : basePrice; // 2 months free annually
  };

  const getSavings = (basePrice: number) => {
    if (basePrice === 0) return 0;
    return basePrice * 2;
  };

  return (
    <TradingLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold heading-trading">
            Choose Your Trading Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
<<<<<<< HEAD
            Professional AI-powered forex analysis with flexible credit systems
            and premium features
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-3 mt-8">
            <span
              className={`text-sm ${
                !isAnnual
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
=======
            Professional AI-powered forex analysis with flexible credit systems and premium features
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-3 mt-8">
            <span className={`text-sm ${!isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-gradient-primary"
            />
<<<<<<< HEAD
            <span
              className={`text-sm ${
                isAnnual
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
=======
            <span className={`text-sm ${isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
              Annual
            </span>
            <Badge className="bg-gradient-profit text-white ml-2">
              Save 2 months
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {Object.entries(plans).map(([key, plan]) => (
<<<<<<< HEAD
            <Card
              key={key}
              className={`relative p-8 trading-card transition-all duration-300 ease-in-out h-full flex flex-col border-border/20 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/70 hover:-translate-y-2 hover:scale-[1.02] ${
                plan.popular
                  ? "border-primary shadow-lg shadow-primary/20 border-2 hover:scale-[1.04]"
                  : ""
=======
            <Card 
              key={key} 
              className={`relative p-8 trading-card transition-all duration-300 ease-in-out h-full flex flex-col border-border/20 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/70 hover:-translate-y-2 hover:scale-[1.02] ${
                plan.popular 
                  ? 'border-primary shadow-lg shadow-primary/20 border-2 hover:scale-[1.04]' 
                  : ''
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-white px-4 py-1 text-sm">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="space-y-6 flex-1 flex flex-col">
                {/* Plan Header */}
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-foreground flex items-center justify-center space-x-2">
<<<<<<< HEAD
                    {key === "free" && (
                      <Zap className="h-6 w-6 text-muted-foreground" />
                    )}
                    {key === "pro" && (
                      <TrendingUp className="h-6 w-6 text-primary" />
                    )}
                    {key === "max" && (
                      <Crown className="h-6 w-6 text-yellow-500" />
                    )}
                    <span>{plan.name}</span>
                  </h3>

                  <div className="space-y-1">
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-4xl font-bold text-foreground">
                        {formatPriceUSDToLocal(
                          getPrice(plan.price),
                          userPricing
                        )}
                      </span>
                      <span className="text-muted-foreground">
                        /{isAnnual ? "year" : plan.period}
=======
                    {key === 'free' && <Zap className="h-6 w-6 text-muted-foreground" />}
                    {key === 'pro' && <TrendingUp className="h-6 w-6 text-primary" />}
                    {key === 'max' && <Crown className="h-6 w-6 text-yellow-500" />}
                    <span>{plan.name}</span>
                  </h3>
                  
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-4xl font-bold text-foreground">
                        ${getPrice(plan.price)}
                      </span>
                      <span className="text-muted-foreground">
                        /{isAnnual ? 'year' : plan.period}
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
                      </span>
                    </div>
                    {isAnnual && plan.price > 0 && (
                      <p className="text-sm text-trading-profit">
<<<<<<< HEAD
                        Save{" "}
                        {formatPriceUSDToLocal(
                          getSavings(plan.price),
                          userPricing
                        )}{" "}
                        annually
                      </p>
                    )}
                  </div>

=======
                        Save ${getSavings(plan.price)} annually
                      </p>
                    )}
                  </div>
                  
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
                  <p className="text-sm text-muted-foreground">
                    {plan.tagline}
                  </p>
                </div>

<<<<<<< HEAD
                {/* Token Allowance Section */}
                <div className="p-4 rounded-lg bg-gradient-dark border border-border/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Monthly Token Allowance
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tokens:</span>
                      <span className="font-medium text-foreground">
                        {plan.credits.daily.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/80">
                      {plan.credits.analyses}
                    </p>
=======
                {/* Credits Section */}
                <div className="p-4 rounded-lg bg-gradient-dark border border-border/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Daily Credit Allowance</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Credits:</span>
                      <span className="font-medium text-foreground">{plan.credits.daily.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-foreground/80">{plan.credits.analyses}</p>
                    {'additional' in plan.credits && plan.credits.additional && (
                      <p className="text-xs text-trading-profit">
                        Additional credits: {plan.credits.additional}
                      </p>
                    )}
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
                    <Check className="h-4 w-4 text-trading-profit" />
                    <span>Features Included</span>
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
<<<<<<< HEAD
                      <li
                        key={index}
                        className="flex items-start space-x-2 text-sm"
                      >
=======
                      <li key={index} className="flex items-start space-x-2 text-sm">
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
                        <Check className="h-3 w-3 text-trading-profit mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                      <X className="h-4 w-4 text-trading-loss" />
                      <span>Limitations</span>
                    </h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
<<<<<<< HEAD
                        <li
                          key={index}
                          className="flex items-start space-x-2 text-sm"
                        >
                          <X className="h-3 w-3 text-trading-loss mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {limitation}
                          </span>
=======
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <X className="h-3 w-3 text-trading-loss mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{limitation}</span>
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Button */}
<<<<<<< HEAD
                <Button
                  className={`w-full ${
                    plan.buttonVariant === "default"
                      ? "btn-trading-primary text-lg py-6"
                      : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg py-6"
                  }`}
                  variant={plan.buttonVariant}
                  disabled={(() => {
                    const k = key as "free" | "pro" | "max";
                    // Only allow selecting higher plans than current
                    return (
                      !(k === "pro" || k === "max") ||
                      rank[k] <= rank[currentPlan]
                    );
                  })()}
                  onClick={() => {
                    try {
                      const k = key as "free" | "pro" | "max";
                      if (!(k === "pro" || k === "max")) {
                        window.location.href = "/billing";
                        return;
                      }
                      if (rank[k] <= rank[currentPlan]) return; // no-op for same/lower plan
                      setPendingPlan(k);
                      setShowProvider(true);
                    } catch {
                      window.location.href = "/billing";
                    }
                  }}
                >
                  {key === "free" && <Zap className="h-5 w-5 mr-2" />}
                  {key === "pro" && <TrendingUp className="h-5 w-5 mr-2" />}
                  {key === "max" && <Crown className="h-5 w-5 mr-2" />}
                  {(() => {
                    const k = key as "free" | "pro" | "max";
                    if (k === currentPlan) return "Current Plan";
                    if (
                      (k === "pro" || k === "max") &&
                      rank[k] > rank[currentPlan]
                    )
                      return `Upgrade to ${k.toUpperCase()}`;
                    // lower plan
                    return "Not Available";
                  })()}
=======
                <Button 
                  className={`w-full ${
                    plan.buttonVariant === 'default' 
                      ? 'btn-trading-primary text-lg py-6' 
                      : 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg py-6'
                  }`}
                  variant={plan.buttonVariant}
                >
                  {key === 'free' && <Zap className="h-5 w-5 mr-2" />}
                  {key === 'pro' && <TrendingUp className="h-5 w-5 mr-2" />}
                  {key === 'max' && <Crown className="h-5 w-5 mr-2" />}
                  {plan.buttonText}
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Payment Methods */}
        <Card className="trading-card p-8 max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="h-6 w-6 text-primary" />
<<<<<<< HEAD
              <h3 className="text-xl font-semibold text-foreground">
                Secure Payment Methods
              </h3>
            </div>

=======
              <h3 className="text-xl font-semibold text-foreground">Secure Payment Methods</h3>
            </div>
            
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center space-y-2">
                <div className="h-12 w-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
<<<<<<< HEAD
                  <p className="text-sm font-medium text-foreground">
                    Cashfree
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cards, UPI, Net Banking
                  </p>
                </div>
              </div>

=======
                  <p className="text-sm font-medium text-foreground">Cashfree</p>
                  <p className="text-xs text-muted-foreground">Cards, UPI, Net Banking</p>
                </div>
              </div>
              
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
              <div className="flex flex-col items-center space-y-2">
                <div className="h-12 w-12 rounded-lg bg-gradient-secondary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-secondary" />
                </div>
                <div className="text-center">
<<<<<<< HEAD
                  <p className="text-sm font-medium text-foreground">
                    CoinPayments
                  </p>
                  <p className="text-xs text-muted-foreground">
                    50+ Cryptocurrencies
                  </p>
                </div>
              </div>

=======
                  <p className="text-sm font-medium text-foreground">Coingate</p>
                  <p className="text-xs text-muted-foreground">50+ Cryptocurrencies</p>
                </div>
              </div>
              
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
              <div className="flex flex-col items-center space-y-2">
                <div className="h-12 w-12 rounded-lg bg-gradient-profit/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <div className="text-center">
<<<<<<< HEAD
                  <p className="text-sm font-medium text-foreground">
                    Bank Transfer
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Direct bank payments
                  </p>
                </div>
              </div>

=======
                  <p className="text-sm font-medium text-foreground">Bank Transfer</p>
                  <p className="text-xs text-muted-foreground">Direct bank payments</p>
                </div>
              </div>
              
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
              <div className="flex flex-col items-center space-y-2">
                <div className="h-12 w-12 rounded-lg bg-gradient-dark flex items-center justify-center">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center">
<<<<<<< HEAD
                  <p className="text-sm font-medium text-foreground">
                    Multi-Currency
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Auto INR conversion
                  </p>
                </div>
              </div>
            </div>

=======
                  <p className="text-sm font-medium text-foreground">Multi-Currency</p>
                  <p className="text-xs text-muted-foreground">Auto INR conversion</p>
                </div>
              </div>
            </div>
            
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Instant processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </Card>

        {/* FAQ Section */}
        <Card className="trading-card p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
            Frequently Asked Questions
          </h3>
<<<<<<< HEAD

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  How do credits work?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Credits are consumed per AI analysis. Different analyses
                  consume different amounts - single AI (150 credits), multi-AI
                  consensus (750 credits), image analysis (300 credits).
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Can I upgrade anytime?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan anytime with
                  prorated billing and credit adjustments.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  What payment methods do you accept?
                </h4>
                <p className="text-sm text-muted-foreground">
                  We accept all major payment methods through Cashfree (cards,
                  UPI, net banking) and cryptocurrency payments through
                  CoinPayments.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Is there a free trial?
                </h4>
                <p className="text-sm text-muted-foreground">
                  The Free plan is available forever. Pro and Max plans offer
                  trial periods to test premium features before commitment.
=======
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">How do credits work?</h4>
                <p className="text-sm text-muted-foreground">
                  Credits are consumed per AI analysis. Different analyses consume different amounts - single AI (150 credits), multi-AI consensus (750 credits), image analysis (300 credits).
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Can I upgrade anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan anytime with prorated billing and credit adjustments.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">What payment methods do you accept?</h4>
                <p className="text-sm text-muted-foreground">
                  We accept all major payment methods through Cashfree (cards, UPI, net banking) and cryptocurrency payments through Coingate.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Is there a free trial?</h4>
                <p className="text-sm text-muted-foreground">
                  The Free plan is available forever. Pro and Max plans offer trial periods to test premium features before commitment.
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
                </p>
              </div>
            </div>
          </div>
        </Card>
<<<<<<< HEAD
        {/* Provider selection modal */}
        <Dialog open={showProvider} onOpenChange={setShowProvider}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Choose payment method</DialogTitle>
              <DialogDescription>
                Select how you want to pay for the{" "}
                {(pendingPlan ?? "").toUpperCase()} plan.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <Button
                className="w-full btn-trading-primary"
                disabled={isCashfreeLocked}
                title={
                  isCashfreeLocked
                    ? "Cashfree is only available for Indian users (+91)."
                    : undefined
                }
                onClick={() => {
                  if (!pendingPlan || isCashfreeLocked) return;
                  try {
                    const iv = isAnnual ? "&interval=yearly" : "";
                    // preserve the provider query param and include interval when annual
                    window.location.href = `/billing?plan=${pendingPlan}${iv}&provider=cashfree`;
                  } catch {
                    window.location.href = "/billing";
                  }
                }}
              >
                Pay with Card / UPI (Cashfree)
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  if (!pendingPlan) return;
                  try {
                    const iv = isAnnual ? "&interval=yearly" : "";
                    window.location.href = `/billing?plan=${pendingPlan}${iv}&provider=coinpayments`;
                  } catch {
                    window.location.href = "/billing";
                  }
                }}
              >
                Pay with Crypto (CoinPayments)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TradingLayout>
  );
}
=======
      </div>
    </TradingLayout>
  );
}
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
