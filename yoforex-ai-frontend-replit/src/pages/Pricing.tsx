import { useEffect, useMemo, useState } from "react";
import { TradingLayout } from "@/components/layout/TradingLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { motion } from "framer-motion";

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
  DollarSign,
  Lock,
  Award,
  Target,
  Sparkles,
  Rocket,
  ChevronDown,
  Search,
  Calculator,
  BarChart3,
  ArrowRight,
  Globe,
  Headphones,
  RefreshCw,
  CheckCircle2,
  Layers,
  Zap as Lightning,
} from "lucide-react";

const plans = {
  free: {
    name: "Free (Basics)",
    price: 0,
    period: "month",
    tagline: "Perfect for getting started with AI trading analysis",
    popular: false,
    recommendedFor: "Beginners & Learners",
    icon: Zap,
    iconColor: "text-muted-foreground",
    iconBgGradient: "from-slate-500/20 to-slate-600/20",
    credits: {
      daily: 1000000,
      analyses: "Includes 1,000,000 tokens/month",
      resetTimer: true,
    },
    features: [
      "1,000,000 tokens per month",
      "Access to free AI models (Mistral, Claude Sonnet, DeepSeek)",
      "10+ professional strategies (premium strategies locked)",
      "Basic SL/TP recommendations",
      "AI trade explanations for basic strategies only",
      "Access to our public Telegram channel",
      "Basic market alerts",
      "Standard customer support (48-hour response)",
    ],
    limitations: [
      "Premium strategies locked",
      "Basic explanations only",
      "Limited timeframe analysis",
    ],
    buttonText: "Start Free",
    buttonVariant: "outline" as const,
  },
  pro: {
    name: "Pro",
    price: 69,
    period: "month",
    tagline: "Advanced AI trading analysis with generous monthly tokens",
    popular: true,
    recommendedFor: "Active Traders",
    icon: TrendingUp,
    iconColor: "text-primary",
    iconBgGradient: "from-primary/20 to-primary/40",
    credits: {
      daily: 10000000,
      analyses: "Includes 10,000,000 tokens/month",
    },
    features: [
      "10,000,000 tokens per month",
      "All Free plan features unlocked",
      "Premium AI models with frequent updates",
      "Multi-timeframe analysis (H1, H4, D1, W1)",
      "AI explains every trade with full rationale",
      "Personalized training (upload history, journal, PDFs)",
      "Multi-AI consensus engine",
      "Private Telegram channels",
      "Priority customer support (24-hour response)",
      "Advanced market alerts with customization",
    ],
    limitations: [],
    buttonText: "Start Pro Trial",
    buttonVariant: "default" as const,
  },
  max: {
    name: "Max (Premium)",
    price: 139,
    period: "month",
    tagline: "Massive monthly tokens for professional traders",
    popular: false,
    recommendedFor: "Professional Traders",
    icon: Crown,
    iconColor: "text-yellow-500",
    iconBgGradient: "from-yellow-500/20 to-amber-600/40",
    credits: {
      daily: 50000000,
      analyses: "Includes 50,000,000 tokens/month",
    },
    features: [
      "50,000,000 tokens per month",
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
      "Custom strategy development consultation",
    ],
    limitations: [],
    buttonText: "Start Max Trial",
    buttonVariant: "default" as const,
  },
};

const comparisonFeatures = [
  { category: "AI & Analysis", features: [
    { name: "Monthly Token Allowance", free: "1M tokens", pro: "10M tokens", max: "50M tokens" },
    { name: "AI Models Access", free: "Basic models", pro: "Premium models", max: "All models + Custom" },
    { name: "Multi-AI Consensus", free: false, pro: true, max: true },
    { name: "Multi-timeframe Analysis", free: "Limited", pro: "H1, H4, D1, W1", max: "All timeframes" },
    { name: "Correlation Analysis", free: false, pro: false, max: true },
    { name: "Multi-modal Analysis", free: false, pro: "Coming Soon", max: true },
  ]},
  { category: "Strategies & Features", features: [
    { name: "Professional Strategies", free: "10+ basic", pro: "All strategies", max: "All + Custom" },
    { name: "AI Trade Explanations", free: "Basic only", pro: "Full rationale", max: "Advanced insights" },
    { name: "Personalized Training", free: false, pro: true, max: true },
    { name: "Strategy Blending", free: false, pro: "Limited", max: "Unlimited" },
    { name: "Custom Prompts", free: false, pro: false, max: true },
  ]},
  { category: "Support & Community", features: [
    { name: "Customer Support", free: "48-hour", pro: "24-hour", max: "4-hour" },
    { name: "Telegram Access", free: "Public", pro: "Private", max: "Premium + Discord" },
    { name: "Market Alerts", free: "Basic", pro: "Advanced", max: "Custom" },
    { name: "Custom Strategy Consultation", free: false, pro: false, max: true },
  ]},
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Day Trader",
    content: "The AI analysis has completely transformed my trading strategy. I've improved my win rate by 23% in just 2 months!",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Forex Trader",
    content: "Best investment I've made for my trading career. The multi-AI consensus feature is incredibly accurate.",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "David Rodriguez",
    role: "Professional Trader",
    content: "The Max plan's custom strategy development has given me an edge I never thought possible. ROI has been exceptional.",
    rating: 5,
    avatar: "DR",
  },
];

const keyFeatures = [
  {
    icon: Brain,
    title: "Advanced AI Models",
    description: "Access to cutting-edge AI models including Claude, GPT-4, and more",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Layers,
    title: "Multi-Timeframe Analysis",
    description: "Comprehensive analysis across H1, H4, D1, and W1 timeframes",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Target,
    title: "Precision Trading",
    description: "AI-powered SL/TP recommendations with detailed rationale",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your data is protected with enterprise-grade encryption",
    color: "from-orange-500/20 to-red-500/20",
  },
];

const faqs = [
  {
    category: "Billing & Plans",
    question: "How do credits and tokens work?",
    answer: "Tokens are consumed per AI analysis based on the complexity and type of analysis. Single AI analysis uses ~150 tokens, multi-AI consensus uses ~750 tokens, and image analysis uses ~300 tokens. Your monthly allowance resets at the start of each billing cycle."
  },
  {
    category: "Billing & Plans",
    question: "Can I upgrade or downgrade anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll only pay the prorated difference. When downgrading, your unused credits will be adjusted proportionally."
  },
  {
    category: "Billing & Plans",
    question: "Is there a free trial for paid plans?",
    answer: "The Free plan is available forever with no credit card required. Pro and Max plans offer trial periods so you can test premium features before making a commitment."
  },
  {
    category: "Billing & Plans",
    question: "What happens when I run out of tokens?",
    answer: "If you run out of tokens, you can either upgrade to a higher plan or purchase additional token packs. We'll notify you when you reach 80% and 100% of your monthly allowance."
  },
  {
    category: "Payment & Security",
    question: "What payment methods do you accept?",
    answer: "We accept all major payment methods through Cashfree (credit/debit cards, UPI, net banking for Indian users) and cryptocurrency payments through CoinPayments (50+ cryptocurrencies supported)."
  },
  {
    category: "Payment & Security",
    question: "Is my payment information secure?",
    answer: "Absolutely! We use industry-leading payment processors (Cashfree and CoinPayments) with bank-level encryption. We never store your payment information on our servers."
  },
  {
    category: "Features",
    question: "What AI models do you support?",
    answer: "Free plan includes Mistral, Claude Sonnet, and DeepSeek. Pro plan adds premium models with frequent updates. Max plan includes all models plus access to hyper-premium APIs like Grok and OpenAI O3 on a pay-as-you-go basis."
  },
  {
    category: "Features",
    question: "How accurate are the AI trading signals?",
    answer: "Our AI models are trained on vast amounts of historical trading data. While no system can guarantee 100% accuracy, our multi-AI consensus engine significantly improves prediction accuracy by combining insights from multiple models."
  },
  {
    category: "Support",
    question: "What kind of support do you offer?",
    answer: "Free plan includes standard email support (48-hour response). Pro plan gets priority support (24-hour response). Max plan includes white-glove support with 4-hour response time and dedicated account management."
  },
  {
    category: "Support",
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied with our service, contact our support team for a full refund within 14 days of purchase."
  },
];

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showProvider, setShowProvider] = useState<boolean>(false);
  const [pendingPlan, setPendingPlan] = useState<("pro" | "max") | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState<string>("all");
  const [calculatorAnalyses, setCalculatorAnalyses] = useState(50);
  
  const { data: billing } = useBillingSummary();
  const { user } = useAuth();
  
  const isIndianUser = useMemo(() => {
    const phone = (user as any)?.phone as string | undefined;
    return !!phone && phone.startsWith("+91");
  }, [user]);
  
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
    void refreshUsdInrRate().catch(() => {});
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

  const getPrice = (basePrice: number) => {
    if (basePrice === 0) return 0;
    return isAnnual ? Math.floor(basePrice * 10) : basePrice;
  };

  const getSavings = (basePrice: number) => {
    if (basePrice === 0) return 0;
    return basePrice * 2;
  };

  const filteredFaqs = useMemo(() => {
    let filtered = faqs;
    if (faqCategory !== "all") {
      filtered = filtered.filter(faq => faq.category === faqCategory);
    }
    if (faqSearch) {
      const search = faqSearch.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(search) || 
        faq.answer.toLowerCase().includes(search)
      );
    }
    return filtered;
  }, [faqSearch, faqCategory]);

  const faqCategories = useMemo(() => {
    return ["all", ...Array.from(new Set(faqs.map(f => f.category)))];
  }, []);

  const calculateCostPerAnalysis = (planKey: string) => {
    const plan = plans[planKey as keyof typeof plans];
    if (plan.price === 0) return "Free";
    const monthlyPrice = getPrice(plan.price);
    const tokensPerAnalysis = 500;
    const analyses = plan.credits.daily / tokensPerAnalysis;
    const costPerAnalysis = monthlyPrice / analyses;
    return formatPriceUSDToLocal(costPerAnalysis, userPricing);
  };

  return (
    <TradingLayout>
      <div className="space-y-16 pb-16">
        {/* Hero Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl" />
          <div className="relative text-center space-y-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Trusted by 10,000+ Traders Worldwide
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Choose Your Trading Plan
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
                Professional AI-powered forex analysis with flexible credit systems
                and premium features. Start free, upgrade anytime.
              </p>
            </motion.div>

            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center space-x-3 mt-8"
            >
              <span
                className={`text-sm transition-all ${
                  !isAnnual
                    ? "text-foreground font-medium scale-110"
                    : "text-muted-foreground"
                }`}
              >
                Monthly
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-gradient-primary"
              />
              <span
                className={`text-sm transition-all ${
                  isAnnual
                    ? "text-foreground font-medium scale-110"
                    : "text-muted-foreground"
                }`}
              >
                Annual
              </span>
              <Badge className="bg-gradient-profit text-white ml-2 animate-pulse">
                <Zap className="h-3 w-3 mr-1" />
                Save 2 months
              </Badge>
            </motion.div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {Object.entries(plans).map(([key, plan], index) => {
            const Icon = plan.icon;
            const isPro = plan.popular;
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={isPro ? "lg:scale-105 lg:z-10" : ""}
              >
                <Card
                  className={`relative p-8 trading-card transition-all duration-500 ease-out h-full flex flex-col border-border/20 
                    hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02]
                    ${isPro 
                      ? "border-primary shadow-2xl shadow-primary/30 border-2 hover:shadow-primary/50 hover:scale-[1.05] animate-pulse-glow" 
                      : "hover:shadow-primary/20 hover:border-primary/50"
                    }
                    group overflow-hidden`}
                  style={{
                    background: isPro 
                      ? "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--primary) / 0.05) 100%)"
                      : undefined
                  }}
                >
                  {/* Animated gradient border effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${
                    isPro ? "from-primary via-secondary to-primary" : "from-primary/50 via-secondary/50 to-primary/50"
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl`} />
                  
                  {isPro && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.05, 1],
                          rotate: [0, 2, -2, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <Badge className="bg-gradient-to-r from-primary via-secondary to-primary text-white px-5 py-1.5 text-sm shadow-lg">
                          <Star className="h-4 w-4 mr-1 animate-spin-slow" />
                          Most Popular Choice
                        </Badge>
                      </motion.div>
                    </div>
                  )}

                  <div className="space-y-6 flex-1 flex flex-col">
                    {/* Large Icon */}
                    <motion.div 
                      className={`mx-auto rounded-3xl bg-gradient-to-br ${plan.iconBgGradient} p-6 group-hover:scale-110 transition-all duration-500`}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`h-20 w-20 ${plan.iconColor} group-hover:scale-110 transition-transform duration-500`} />
                    </motion.div>

                    {/* Plan Header */}
                    <div className="text-center space-y-3">
                      <h3 className={`text-3xl font-bold ${
                        isPro 
                          ? "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                          : "text-foreground"
                      }`}>
                        {plan.name}
                      </h3>

                      <div className="space-y-2">
                        <div className="flex items-baseline justify-center space-x-2">
                          <span className="text-5xl font-bold text-foreground">
                            {formatPriceUSDToLocal(
                              getPrice(plan.price),
                              userPricing
                            )}
                          </span>
                          <span className="text-muted-foreground text-lg">
                            /{isAnnual ? "year" : plan.period}
                          </span>
                        </div>
                        {isAnnual && plan.price > 0 && (
                          <motion.p 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-sm text-trading-profit font-semibold"
                          >
                            💰 Save{" "}
                            {formatPriceUSDToLocal(
                              getSavings(plan.price),
                              userPricing
                            )}{" "}
                            annually!
                          </motion.p>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground italic">
                        {plan.tagline}
                      </p>

                      {/* Recommended For Badge */}
                      <Badge 
                        variant="outline" 
                        className={`${
                          isPro 
                            ? "border-primary text-primary bg-primary/10" 
                            : "border-muted-foreground/30"
                        } px-4 py-1`}
                      >
                        <Target className="h-3 w-3 mr-1" />
                        {plan.recommendedFor}
                      </Badge>
                    </div>

                    {/* Value Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Value Score</span>
                        <span>{key === "free" ? "60%" : key === "pro" ? "90%" : "100%"}</span>
                      </div>
                      <Progress 
                        value={key === "free" ? 60 : key === "pro" ? 90 : 100} 
                        className={`h-2 ${isPro ? "bg-primary/20" : ""}`}
                      />
                    </div>

                    {/* Token Allowance Section */}
                    <div className={`p-5 rounded-xl bg-gradient-to-br ${
                      isPro 
                        ? "from-primary/10 to-secondary/10 border-2 border-primary/20"
                        : "from-card to-card border border-border/20"
                    } transition-all duration-300 hover:shadow-lg`}>
                      <div className="flex items-center space-x-2 mb-3">
                        <Brain className={`h-5 w-5 ${isPro ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-semibold text-foreground">
                          Monthly Token Allowance
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Tokens:</span>
                          <span className="font-bold text-foreground text-lg">
                            {plan.credits.daily.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/70 leading-relaxed">
                          {plan.credits.analyses}
                        </p>
                        <div className="pt-2 border-t border-border/20">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Cost per analysis:</span>
                            <span className="font-semibold text-primary">
                              {calculateCostPerAnalysis(key)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 flex-1">
                      <h4 className="text-sm font-semibold text-foreground flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-trading-profit" />
                        <span>Everything Included</span>
                      </h4>
                      <ul className="space-y-3">
                        {plan.features.slice(0, 8).map((feature, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start space-x-3 text-sm group/item"
                          >
                            <Check className="h-4 w-4 text-trading-profit mt-0.5 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                            <span className="text-foreground/90 group-hover/item:text-foreground transition-colors">
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                      {plan.features.length > 8 && (
                        <p className="text-xs text-primary font-medium pt-2">
                          + {plan.features.length - 8} more features
                        </p>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Button
                      className={`w-full text-lg py-7 font-semibold transition-all duration-300 group/btn relative overflow-hidden
                        ${plan.buttonVariant === "default"
                          ? "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl hover:shadow-primary/50"
                          : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary/50"
                        }`}
                      variant={plan.buttonVariant}
                      disabled={(() => {
                        const k = key as "free" | "pro" | "max";
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
                          if (rank[k] <= rank[currentPlan]) return;
                          setPendingPlan(k);
                          setShowProvider(true);
                        } catch {
                          window.location.href = "/billing";
                        }
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        <Icon className="h-5 w-5 mr-2 group-hover/btn:rotate-12 transition-transform" />
                        {(() => {
                          const k = key as "free" | "pro" | "max";
                          if (k === currentPlan) return "Current Plan";
                          if (
                            (k === "pro" || k === "max") &&
                            rank[k] > rank[currentPlan]
                          )
                            return `Upgrade to ${k.toUpperCase()}`;
                          return "Not Available";
                        })()}
                        <ArrowRight className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                    </Button>

                    {key === "free" && (
                      <p className="text-xs text-center text-muted-foreground">
                        ✓ No credit card required
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="trading-card p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="inline-flex p-3 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
                <h4 className="font-semibold text-foreground">SSL Encrypted</h4>
                <p className="text-xs text-muted-foreground">Bank-level security</p>
              </div>
              <div className="space-y-2">
                <div className="inline-flex p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                  <RefreshCw className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="font-semibold text-foreground">14-Day Guarantee</h4>
                <p className="text-xs text-muted-foreground">Money-back promise</p>
              </div>
              <div className="space-y-2">
                <div className="inline-flex p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <CreditCard className="h-6 w-6 text-purple-500" />
                </div>
                <h4 className="font-semibold text-foreground">No CC for Free</h4>
                <p className="text-xs text-muted-foreground">Start instantly</p>
              </div>
              <div className="space-y-2">
                <div className="inline-flex p-3 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20">
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
                <h4 className="font-semibold text-foreground">10,000+ Traders</h4>
                <p className="text-xs text-muted-foreground">Trusted worldwide</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Feature Highlights Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-gradient-to-r from-primary to-secondary text-white mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Why Choose Us
            </Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Powerful Features for Serious Traders
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with proven trading strategies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className={`p-6 h-full trading-card border-border/20 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group bg-gradient-to-br ${feature.color}`}>
                    <div className="space-y-4">
                      <div className="inline-flex p-4 rounded-2xl bg-card/50 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Button
              onClick={() => setShowComparison(!showComparison)}
              variant="outline"
              size="lg"
              className="group"
            >
              <BarChart3 className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              {showComparison ? "Hide" : "Show"} Detailed Comparison
              <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${showComparison ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="trading-card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 sticky top-0 z-10">
                      <tr>
                        <th className="text-left p-6 font-semibold text-foreground min-w-[250px]">
                          Features
                        </th>
                        <th className="text-center p-6 font-semibold text-foreground min-w-[150px]">
                          <div className="flex flex-col items-center space-y-2">
                            <Zap className="h-6 w-6 text-muted-foreground" />
                            <span>Free</span>
                          </div>
                        </th>
                        <th className="text-center p-6 font-semibold text-foreground min-w-[150px] bg-primary/5">
                          <div className="flex flex-col items-center space-y-2">
                            <TrendingUp className="h-6 w-6 text-primary" />
                            <span>Pro</span>
                            <Badge className="bg-primary text-white text-xs">Popular</Badge>
                          </div>
                        </th>
                        <th className="text-center p-6 font-semibold text-foreground min-w-[150px]">
                          <div className="flex flex-col items-center space-y-2">
                            <Crown className="h-6 w-6 text-yellow-500" />
                            <span>Max</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonFeatures.map((category, catIndex) => (
                        <>
                          <tr key={`cat-${catIndex}`} className="bg-muted/30">
                            <td colSpan={4} className="p-4 font-semibold text-sm text-foreground">
                              {category.category}
                            </td>
                          </tr>
                          {category.features.map((feature, featIndex) => (
                            <tr 
                              key={`feat-${catIndex}-${featIndex}`}
                              className={`border-b border-border/20 hover:bg-muted/20 transition-colors ${
                                featIndex % 2 === 0 ? "bg-card" : "bg-muted/5"
                              }`}
                            >
                              <td className="p-4 text-sm text-foreground">{feature.name}</td>
                              <td className="p-4 text-center">
                                {typeof feature.free === "boolean" ? (
                                  feature.free ? (
                                    <Check className="h-5 w-5 text-trading-profit mx-auto" />
                                  ) : (
                                    <X className="h-5 w-5 text-trading-loss mx-auto" />
                                  )
                                ) : (
                                  <span className="text-sm text-muted-foreground">{feature.free}</span>
                                )}
                              </td>
                              <td className="p-4 text-center bg-primary/5">
                                {typeof feature.pro === "boolean" ? (
                                  feature.pro ? (
                                    <Check className="h-5 w-5 text-trading-profit mx-auto" />
                                  ) : (
                                    <X className="h-5 w-5 text-trading-loss mx-auto" />
                                  )
                                ) : feature.pro === "Coming Soon" ? (
                                  <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                                ) : (
                                  <span className="text-sm font-medium text-foreground">{feature.pro}</span>
                                )}
                              </td>
                              <td className="p-4 text-center">
                                {typeof feature.max === "boolean" ? (
                                  feature.max ? (
                                    <Check className="h-5 w-5 text-trading-profit mx-auto" />
                                  ) : (
                                    <X className="h-5 w-5 text-trading-loss mx-auto" />
                                  )
                                ) : (
                                  <span className="text-sm font-medium text-foreground">{feature.max}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Interactive Calculator */}
        <div className="max-w-4xl mx-auto">
          <Card className="trading-card p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="text-center mb-6">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 mb-4">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                ROI Calculator
              </h3>
              <p className="text-muted-foreground">
                See how much you'll save per analysis
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Analyses per month: {calculatorAnalyses}
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={calculatorAnalyses}
                  onChange={(e) => setCalculatorAnalyses(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(plans).map(([key, plan]) => {
                  const monthlyPrice = getPrice(plan.price);
                  const costPerAnalysis = monthlyPrice === 0 ? 0 : monthlyPrice / calculatorAnalyses;
                  
                  return (
                    <div key={key} className="p-4 rounded-lg bg-card border border-border/20">
                      <h4 className="font-semibold text-foreground mb-2">{plan.name}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monthly:</span>
                          <span className="font-semibold">
                            {formatPriceUSDToLocal(monthlyPrice, userPricing)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Per analysis:</span>
                          <span className="font-semibold text-primary">
                            {monthlyPrice === 0 ? "Free" : formatPriceUSDToLocal(costPerAnalysis, userPricing)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-gradient-to-r from-primary to-secondary text-white mb-4">
              <Award className="h-3 w-3 mr-1" />
              Customer Success Stories
            </Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Loved by Traders Worldwide
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 h-full trading-card border-border/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center space-x-3 pt-4 border-t border-border/20">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <Card className="trading-card p-8 max-w-5xl mx-auto">
          <div className="text-center space-y-6">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 mb-2">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground">
              Secure Payment Methods
            </h3>
            <p className="text-muted-foreground">
              Multiple payment options for your convenience
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
              <div className="flex flex-col items-center space-y-3 group">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    Cashfree
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cards, UPI, Net Banking
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-3 group">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    CoinPayments
                  </p>
                  <p className="text-xs text-muted-foreground">
                    50+ Cryptocurrencies
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-3 group">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    Bank Transfer
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Direct bank payments
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-3 group">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-8 w-8 text-purple-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    Multi-Currency
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Auto INR conversion
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Instant processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>SSL encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <Headphones className="h-4 w-4" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </Card>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-gradient-to-r from-primary to-secondary text-white mb-4">
              <MessageCircle className="h-3 w-3 mr-1" />
              Got Questions?
            </Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our plans and features
            </p>
          </div>

          <Card className="trading-card p-6">
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {faqCategories.map((category) => (
                  <Button
                    key={category}
                    variant={faqCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFaqCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Accordion */}
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left hover:text-primary">
                      <span className="font-semibold">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No FAQs found matching your search.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary opacity-10" />
          <Card className="relative trading-card p-12 text-center border-primary/20">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-flex p-5 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-4">
                <Rocket className="h-12 w-12 text-primary" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Ready to Transform Your Trading?
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of successful traders using AI-powered analysis to make smarter decisions
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-6">
                <div className="flex items-center space-x-2 text-sm text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-trading-profit" />
                  <span>Start free, no credit card</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-trading-profit" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-trading-profit" />
                  <span>14-day money back</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white text-lg px-8 py-7 shadow-xl hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 group"
                  onClick={() => window.location.href = "/billing"}
                >
                  <Lightning className="h-6 w-6 mr-2 group-hover:rotate-12 transition-transform" />
                  Start Free Now
                  <ArrowRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-7 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                  onClick={() => window.location.href = "/contact"}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Talk to Sales
                </Button>
              </div>

              <p className="text-xs text-muted-foreground pt-4">
                Special offer: Get 2 months free with annual plans!
              </p>
            </div>
          </Card>
        </motion.div>

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
