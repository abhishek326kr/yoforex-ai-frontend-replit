import { useEffect, useRef, useState } from 'react';
// import { useToast } from '@/hooks/use-toast';
import {
  Activity,
  Target,
  Upload,
  Zap,
  Mic,
  Loader2,
  AlertCircle,
  Lock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calculator,
  Clock,
  DollarSign,
  Star,
  ChevronRight,
  X,
  Image as ImageIcon,
  FileText,
  History,
  Sparkles,
  TrendingUpIcon,
  Coins,
  Download,
  Share2,
  Grid3x3,
  Layout,
  LineChart,
  Move,
  Pen,
  Type,
  Circle,
  Square,
  Triangle,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Eye,
  Layers,
  Settings,
  Info,
  Check,
  Gauge,
  Award,
  Brain,
  Bookmark,
  BookmarkPlus,
  RefreshCcw
} from 'lucide-react';
import formattedTimeframe, { fetchTradingAnalysis, type Timeframe, type TradingStrategy } from '@/lib/api/analysis';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TradingTips from '@/components/TradingTips';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import MarketSelection from '@/components/MarketSelection';
import TradingViewWidget from '@/components/charts/TradingViewWidget';
import { TradingLayout } from '@/components/layout/TradingLayout';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LiveSignals from '@/components/LiveSignals';
import AiModelsSelection from '@/components/AiModelsSelection';
import TimeframeSelection from '@/components/TimeframeSelection';
import { TradingChart } from '@/components/TradingChart';
import StrategySelection from '@/components/StrategySelection';
import ActivePositions from '@/components/ActivePositions';
import AIMultiPanel from '@/components/AIMultiPanel';
import AIMultiResults from '@/components/AIMultiResults';
import type { MultiAnalysisResponse } from '@/lib/api/aiMulti';
import { TradeConfirmationDialog } from '@/components/TradeConfirmationDialog';
import { useActiveTrades } from '@/context/ActiveTradesContext';
import { useBillingSummary } from '@/hooks/useBillingSummary';
import { emitBillingUpdated } from '@/lib/billingEvents';
import { createTrade } from '@/lib/api/trades';
import { mapToOandaInstrument } from '@/utils/trading';

// Type definitions for Technical Analysis Card props
interface TechnicalAnalysisCardProps {
  analysis: {
    loading: boolean;
    error: string | null;
    data: any | null;
    hasRun: boolean;
  };
  onRunAnalysis: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  showRunNew?: boolean;
}

// Import the AnalysisDisplay component
import { AnalysisDisplay } from '@/components/AnalysisDisplay';

// Technical Analysis Card Component
const TechnicalAnalysisCard = ({ analysis, onRunAnalysis, disabled = false, children, showRunNew = false }: TechnicalAnalysisCardProps) => (
  <Card className="p-6 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/20">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Market Analysis</h3>
      </div>
      <div className="flex items-center gap-2">
        {analysis.hasRun && !analysis.loading && (
          <Button size="sm" variant="outline" onClick={onRunAnalysis} disabled={disabled} className="font-medium">
            Retry Analysis
          </Button>
        )}
        {showRunNew && !analysis.loading && (
          <Button size="lg" onClick={onRunAnalysis} disabled={disabled} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md font-semibold">
            <Zap className="h-4 w-4 mr-2" />
            Run New Analysis
          </Button>
        )}
      </div>
    </div>
    {analysis.loading ? (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mr-3 text-primary" />
        <span className="text-lg">Analyzing market data...</span>
      </div>
    ) : !analysis.hasRun ? (
      <div className="flex flex-col items-center p-10 text-center">
        <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-6 rounded-2xl mb-6">
          <Zap className="h-12 w-12 text-primary" />
        </div>
        <h4 className="text-2xl font-semibold mb-3 text-foreground">Run Market Analysis</h4>
        <p className="text-muted-foreground text-base mb-8 max-w-md leading-relaxed">
          Get detailed technical analysis, trade signals, and risk assessment for the selected currency pair.
        </p>
        <Button 
          onClick={onRunAnalysis}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          disabled={disabled}
        >
          <Zap className="h-6 w-6 mr-2" />
          Run AI Analysis
        </Button>
      </div>
    ) : analysis.error ? (
      <div className="flex flex-col items-center p-6 text-center">
        <div className="bg-muted/20 p-4 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-yellow-500" />
        </div>
        <h4 className="text-lg font-medium mb-2">Analysis Failed</h4>
        <p className="text-muted-foreground text-sm mb-6">
          {analysis.error || 'We couldn\'t retrieve the analysis data. Please try running the analysis again.'}
        </p>
        <Button 
          onClick={onRunAnalysis}
          className="mt-2 bg-gradient-primary hover:bg-primary-hover"
          disabled={disabled}
        >
          <Zap className="h-4 w-4 mr-2" />
          Retry Analysis
        </Button>
      </div>
    ) : analysis.data?.analysis ? (
      // If the payload looks like MultiAnalysisResponse (has nested 'analysis'),
      // render children (AIMultiResults) only; otherwise render the single AnalysisDisplay
      ((analysis.data as any)?.analysis?.analysis ? (
        <>{children}</>
      ) : (
        <>
          <AnalysisDisplay analysis={analysis.data.analysis} onRefresh={onRunAnalysis} />
          {children}
        </>
      ))
    ) : (
      <div className="flex flex-col items-center p-6 text-center">
        <div className="bg-muted/20 p-4 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-yellow-500" />
        </div>
        <h4 className="text-lg font-medium mb-2">No Analysis Data</h4>
        <p className="text-muted-foreground text-sm mb-6">
          We couldn't retrieve the analysis data. Please try running the analysis again.
        </p>
        <Button 
          onClick={onRunAnalysis}
          className="mt-2 bg-gradient-primary hover:bg-primary-hover"
          disabled={disabled}
        >
          <Zap className="h-4 w-4 mr-2" />
          Retry Analysis
        </Button>
      </div>
    )}
  </Card>
);
 

export function LiveTrading() {
  const { addTrade } = useActiveTrades();
  const { data: billing, refresh: refreshBilling } = useBillingSummary();
  const [selectedPair, setSelectedPair] = useState("EUR/USD");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1H");
  const [selectedStrategy, setSelectedStrategy] = useState<string>("");
  const [candleData, setCandleData] = useState<any[]>([]);
  const [analysisText, setAnalysisText] = useState("");
  // const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<{
    loading: boolean;
    error: string | null;
    data: any | null;
    hasRun: boolean; // Track if analysis has been run
  }>({ loading: false, error: null, data: null, hasRun: false });
  const [multiResult, setMultiResult] = useState<MultiAnalysisResponse | null>(null);
  // Keep latest AIMultiPanel config so Market Analysis can reuse it
  const [aiConfig, setAiConfig] = useState<{ provider: string; models: Record<string, string> } | null>(null);
  // Track last successful run signature to detect parameter changes
  const [lastRunSig, setLastRunSig] = useState<string | null>(null);
  // Show confirmation to add trade after successful analysis
  const [showTradeConfirm, setShowTradeConfirm] = useState(false);
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDailyLocked = !!(billing && typeof billing.daily_cap === 'number' && typeof billing.daily_credits_spent === 'number' && billing.daily_credits_spent >= billing.daily_cap);
  const STORAGE_KEY = 'live_trading_last_analysis_v1';
  // const ANALYSIS_TTL_MS = 5 * 60 * 1000; // 5 minutes

  // Trading Tools Calculator State
  const [accountSize, setAccountSize] = useState("10000");
  const [riskPercent, setRiskPercent] = useState("2");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");

  // Manual AI Confirmation State
  const [uploadedChartImage, setUploadedChartImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedDrawingTool, setSelectedDrawingTool] = useState<string | null>(null);
  const [chartLayout, setChartLayout] = useState<'single' | 'split' | 'quad'>('single');
  const [manualAnalysisLoading, setManualAnalysisLoading] = useState(false);
  const [manualAnalysisError, setManualAnalysisError] = useState<string | null>(null);
  const [manualAnalysisResult, setManualAnalysisResult] = useState<any | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([]);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [estimatedTokens, setEstimatedTokens] = useState(0);
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);

  // Save last successful analysis to localStorage
  // Find this function:
const saveLastAnalysis = (params: {
  analysisData: any;
  multi?: MultiAnalysisResponse | null;
  pair: string;
  timeframe: string;
  strategy: string;
  ai?: { provider: string; models: Record<string, string> } | null;
  sig?: string | null;
}) => {
  try {
    const payload = {
      analysisData: params.analysisData,
      multiResult: params.multi ?? null,
      selectedPair: params.pair,
      selectedTimeframe: params.timeframe,
      selectedStrategy: params.strategy,
      aiConfig: params.ai ?? null,
      lastRunSig: params.sig ?? null,
      ts: Date.now(),  // You can keep this for reference but it won't be used for expiration
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage errors
  }
};
  // Clear analysis results and persisted cache
  

  // Timer to auto-expire analysis after TTL
  // const expiryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // const startExpiryTimer = (ms: number) => {
  //   if (expiryTimerRef.current) {
  //     clearTimeout(expiryTimerRef.current);
  //   }
  //   expiryTimerRef.current = setTimeout(() => {
  //     clearAnalysisResults();
  //     expiryTimerRef.current = null;
  //   }, ms);
  // };

  // Helper to clear any pending 30-second popup timer
  const clearPopupTimer = () => {
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
      popupTimerRef.current = null;
    }
  };

  // Restore last analysis on mount (only if within TTL) and start expiry countdown
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const cached = JSON.parse(raw);
      if (!cached?.analysisData) return;

      setSelectedPair(cached.selectedPair || selectedPair);
      setSelectedTimeframe(cached.selectedTimeframe || selectedTimeframe);
      setSelectedStrategy(cached.selectedStrategy || '');
      setAiConfig(cached.aiConfig || null);
      setLastRunSig(cached.lastRunSig || null);
      setMultiResult(cached.multiResult || null);
      setAnalysis({ loading: false, error: null, data: cached.analysisData, hasRun: true });

      // Start expiry timer with remaining time
    } catch {
      // ignore parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup any running timer on unmount
  useEffect(() => {
    return () => {
      clearPopupTimer();
    };
  }, []);
  
  // Handle strategy selection from StrategySelection component
  const handleStrategySelect = (strategy: string) => {
    setSelectedStrategy(strategy);
  };
  
  // Handle candle data updates from TradingChart
  const handleCandleDataUpdate = (data: any[]) => {
    setCandleData(data);
  };

  // Handle AI Analysis button click
  const handleAnalysis = async () => {
    if (isDailyLocked) {
      setAnalysis({ loading: false, error: 'Daily analysis limit reached. Please try again in 24 hours.', data: null, hasRun: true });
      return;
    }

    if (!selectedPair || !selectedTimeframe || !selectedStrategy) {
      setAnalysis({
        loading: false,
        error: 'Please select a pair, timeframe, and strategy first',
        data: null,
        hasRun: true
      });
      return;
    }
    
    try {
      // Cancel any existing expiry timer before starting a fresh run
      
      setAnalysis({ loading: true, error: null, data: null, hasRun: true });
      
      const result = await fetchTradingAnalysis({
        pair: selectedPair,
        timeframe: selectedTimeframe as Timeframe,
        strategy: selectedStrategy as TradingStrategy,
        count: 100
      });
      
      setAnalysis({ loading: false, error: null, data: result, hasRun: true });
      // Persist last successful single-provider analysis
      saveLastAnalysis({
        analysisData: result,
        multi: null,
        pair: selectedPair,
        timeframe: selectedTimeframe,
        strategy: selectedStrategy,
        ai: aiConfig,
        sig: JSON.stringify({ pair: selectedPair, tf: selectedTimeframe, strategy: selectedStrategy, ai: aiConfig })
      });
      // Broadcast billing update instantly (optimistic), and also trigger a refresh for authoritative sync
      try {
        const b = (result as any)?.billing;
        if (b && (typeof b.monthly_credits_remaining === 'number' || typeof b.daily_credits_spent === 'number')) {
          emitBillingUpdated({
            monthly_credits_remaining: b.monthly_credits_remaining,
            daily_credits_spent: b.daily_credits_spent,
            charged_credits: b.charged_credits,
          });
        }
      } catch {}
      try { refreshBilling?.(); } catch {}
      // Prompt user to add as Active Trade after 30 seconds delay
      clearPopupTimer();
      popupTimerRef.current = setTimeout(() => {
        setShowTradeConfirm(true);
      }, 30 * 1000);
      // Start 5-minute expiry countdown
      
    } catch (error: any) {
      console.error('Error fetching analysis:', error);
      const status = error?.response?.status;
      const detail = error?.response?.data?.detail || error?.response?.data;
      let msg = 'Failed to fetch analysis. Please try again.';
      if (status === 402) {
        msg = typeof detail === 'object' && detail?.code === 'insufficient_credits'
          ? 'Insufficient credits. Please top up to continue.'
          : 'Payment required or insufficient credits.';
      } else if (status === 429) {
        msg = typeof detail === 'object' && detail?.code === 'daily_cap_reached'
          ? 'Daily credit cap reached. Try again tomorrow.'
          : 'Too many requests. Please wait and try again.';
        // Ensure UI reflects the cap state immediately
        refreshBilling?.();
      }
      setAnalysis({ loading: false, error: msg, data: null, hasRun: true });
    }
  };

  // Run the multi-provider AI analysis from the Market Analysis run button
  const runMultiFromConfig = async () => {
    if (isDailyLocked) {
      setAnalysis({ loading: false, error: 'Daily analysis limit reached. Please try again in 24 hours.', data: null, hasRun: true });
      return;
    }

    // Validate inputs; surface a helpful error instead of silently returning
    if (!selectedPair || !selectedTimeframe || !selectedStrategy) {
      setAnalysis({ loading: false, error: 'Please select a pair, timeframe, and strategy first', data: null, hasRun: true });
      return;
    }
    if (!aiConfig) {
      setAnalysis({ loading: false, error: 'Please configure an AI provider/model in the left panel', data: null, hasRun: true });
      return;
    }

    try {
      // show loading in the analysis card area
      // Cancel any existing expiry timer before starting a fresh run
      
      setAnalysis({ loading: true, error: null, data: null, hasRun: true });
      const { runMultiAnalysis } = await import('@/lib/api/aiMulti');
      const data = await runMultiAnalysis({
        providers: [aiConfig.provider as any],
        pair: selectedPair,
        timeframe: selectedTimeframe,
        strategy: selectedStrategy,
        models: aiConfig.models
      });
      setMultiResult(data as MultiAnalysisResponse);
      // Wrap under data.analysis to reuse the existing rendering path
      setAnalysis({ loading: false, error: null, data: { analysis: data }, hasRun: true });
      // Persist last successful multi-provider analysis
      saveLastAnalysis({
        analysisData: { analysis: data },
        multi: data as MultiAnalysisResponse,
        pair: selectedPair,
        timeframe: selectedTimeframe,
        strategy: selectedStrategy,
        ai: aiConfig,
        sig: JSON.stringify({ pair: selectedPair, tf: selectedTimeframe, strategy: selectedStrategy, ai: aiConfig })
      });
      // Broadcast billing update instantly (optimistic), and also trigger a refresh for authoritative sync
      try {
        const b = (data as any)?.billing;
        if (b && (typeof b.monthly_credits_remaining === 'number' || typeof b.daily_credits_spent === 'number')) {
          emitBillingUpdated({
            monthly_credits_remaining: b.monthly_credits_remaining,
            daily_credits_spent: b.daily_credits_spent,
            charged_credits: b.charged_credits,
          });
        }
      } catch {}
      try { refreshBilling?.(); } catch {}

      // Update last run signature
      const sig = JSON.stringify({ pair: selectedPair, tf: selectedTimeframe, strategy: selectedStrategy, ai: aiConfig });
      setLastRunSig(sig);
      // Prompt user to add as Active Trade after 30 seconds delay
      clearPopupTimer();
      popupTimerRef.current = setTimeout(() => {
        setShowTradeConfirm(true);
      }, 30 * 1000);
      // Start 5-minute expiry countdown
      
    } catch (e: any) {
      console.error('Error running multi analysis from Market Analysis:', e);
      const status = e?.response?.status;
      const detail = e?.response?.data?.detail || e?.response?.data;
      let msg = e?.message || 'Failed to run AI analysis';
      if (status === 402) {
        msg = typeof detail === 'object' && detail?.code === 'insufficient_credits'
          ? 'Insufficient credits. Please top up to continue.'
          : 'Payment required or insufficient credits.';
      } else if (status === 429) {
        msg = typeof detail === 'object' && detail?.code === 'daily_cap_reached'
          ? 'Daily credit cap reached. Try again tomorrow.'
          : 'Too many requests. Please wait and try again.';
      }
      setAnalysis({ loading: false, error: msg, data: null, hasRun: true });
    }
  };

  // Build and add a trade from current analysis
  const confirmShareToActiveTrades = async () => {
    try {
      const now = new Date().toISOString();
      const pair = selectedPair;
      const timeframe = selectedTimeframe;
      const strategy = selectedStrategy;
      let direction: 'BUY' | 'SELL' = 'BUY';
      let entryPrice = '-';
      let stopLoss: string | undefined = undefined;
      let takeProfit: string | undefined = undefined;
      let confidence: number | undefined = undefined;

      const payload = analysis.data;
      // Single provider payload shape: { analysis: { signal, entry, stop_loss, take_profit, confidence, timeframe, ... } }
      const single = payload?.analysis && (payload.analysis.signal || payload.analysis.entry !== undefined);
      if (single) {
        const a = payload.analysis as any;
        const sig = String(a.signal || '').toUpperCase();
        if (sig.includes('SELL')) direction = 'SELL';
        else direction = 'BUY';
        if (typeof a.entry === 'number') entryPrice = a.entry.toFixed(5);
        else if (typeof a.entry === 'string') entryPrice = a.entry;
        if (a.stop_loss !== undefined) stopLoss = String(a.stop_loss);
        if (a.take_profit !== undefined) takeProfit = String(a.take_profit);
        if (typeof a.confidence === 'number') confidence = a.confidence;
      } else {
        // Multi-provider payload path: payload.analysis is MultiAnalysisResponse
        // Prefer the currently selected provider from aiConfig; otherwise pick the first available
        const multi = multiResult || (payload?.analysis as any);
        const providerKey: string | undefined = aiConfig?.provider || (multi && multi.analysis && Object.keys(multi.analysis)[0]);
        const providerAnalysis = providerKey ? multi?.analysis?.[providerKey] : undefined;
        if (providerAnalysis) {
          const sig = String(providerAnalysis.signal || '').toUpperCase();
          if (sig.includes('SELL')) direction = 'SELL';
          else direction = 'BUY';
          if (typeof providerAnalysis.entry === 'number') entryPrice = providerAnalysis.entry.toFixed(5);
          else if (typeof providerAnalysis.entry === 'string') entryPrice = providerAnalysis.entry;
          if (providerAnalysis.stop_loss !== undefined) stopLoss = String(providerAnalysis.stop_loss);
          if (providerAnalysis.take_profit !== undefined) takeProfit = String(providerAnalysis.take_profit);
          if (typeof providerAnalysis.confidence === 'number') confidence = providerAnalysis.confidence;
        }
      }

      // Create on backend first to get serverTradeId
      try {
        const side = direction === 'BUY' ? 'buy' : 'sell';
        const ep = parseFloat(entryPrice);
        const tp = takeProfit !== undefined ? parseFloat(takeProfit) : undefined;
        const sl = stopLoss !== undefined ? parseFloat(stopLoss) : undefined;
        const oandaPair = mapToOandaInstrument(pair);
        const gran = formattedTimeframe(timeframe);
        const created = await createTrade({
          pair: oandaPair,
          granularity: gran,
          side,
          entry_price: isNaN(ep) ? undefined : ep,
          tp_price: tp && !isNaN(tp) ? tp : undefined,
          sl_price: sl && !isNaN(sl) ? sl : undefined,
          // size: could be added if available in UI
        });
        addTrade({
          pair,
          direction,
          entryPrice,
          openTime: now,
          stopLoss,
          takeProfit,
          aiModel: aiConfig?.provider,
          confidence,
          strategy,
          timeframe,
          serverTradeId: typeof created?.id === 'number' ? created.id : undefined,
          id: typeof created?.id === 'number' ? String(created.id) : undefined,
        });
      } catch (e) {
        // Fallback to local-only add if backend create fails
        addTrade({
          pair,
          direction,
          entryPrice,
          openTime: now,
          stopLoss,
          takeProfit,
          aiModel: aiConfig?.provider,
          confidence,
          strategy,
          timeframe,
        });
      }
    } finally {
      setShowTradeConfirm(false);
    }
  };

  // Calculate position size for Trading Tools
  const calculatePositionSize = () => {
    const account = parseFloat(accountSize);
    const risk = parseFloat(riskPercent);
    const entry = parseFloat(entryPrice);
    const stopLoss = parseFloat(stopLossPrice);

    if (isNaN(account) || isNaN(risk) || isNaN(entry) || isNaN(stopLoss) || entry === 0 || stopLoss === 0) {
      return { units: 0, riskAmount: 0, pipRisk: 0, riskReward: 0 };
    }

    const riskAmount = (account * risk) / 100;
    const pipRisk = Math.abs(entry - stopLoss);
    const units = pipRisk > 0 ? Math.floor(riskAmount / pipRisk) : 0;

    return {
      units,
      riskAmount,
      pipRisk,
      riskReward: 0
    };
  };

  const positionCalc = calculatePositionSize();

  // Quick Pairs Data
  const quickPairs = [
    { symbol: "EUR/USD", icon: DollarSign, color: "text-blue-500" },
    { symbol: "GBP/USD", icon: DollarSign, color: "text-green-500" },
    { symbol: "USD/JPY", icon: DollarSign, color: "text-red-500" },
    { symbol: "BTC/USD", icon: TrendingUp, color: "text-yellow-500" },
    { symbol: "ETH/USD", icon: TrendingUp, color: "text-purple-500" },
  ];

  // Check if market is open (simplified - forex is open weekdays)
  const isMarketOpen = () => {
    const now = new Date();
    const day = now.getUTCDay();
    const hour = now.getUTCHours();
    // Forex market is open from Sunday 22:00 UTC to Friday 22:00 UTC
    if (day === 0 && hour < 22) return false; // Sunday before 22:00
    if (day === 6) return false; // Saturday
    if (day === 5 && hour >= 22) return false; // Friday after 22:00
    return true;
  };

  const marketOpen = isMarketOpen();

  // Manual AI Confirmation Helper Functions
  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedChartImage(reader.result as string);
        setUploadedFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeUploadedImage = () => {
    setUploadedChartImage(null);
    setUploadedFileName("");
  };

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would start/stop voice recording
  };

  const applyTemplate = (templateType: string) => {
    const templates = {
      technical: "Analyze the current technical setup for this chart. Identify key support and resistance levels, trend direction, and potential entry/exit points based on price action and indicators.",
      sentiment: "What is the current market sentiment for this pair? Analyze recent price movements, volume patterns, and potential market-moving factors that could impact the trade.",
      risk: "Evaluate the risk/reward ratio for entering a position here. What stop loss and take profit levels would you recommend? Calculate optimal position sizing for 2% account risk.",
      multi: "Provide a comprehensive multi-timeframe analysis. Check the higher timeframe trend, current timeframe setup, and lower timeframe entry confirmation. Include key levels and trade plan."
    };
    setAnalysisText(templates[templateType as keyof typeof templates] || "");
    setSelectedTemplate(templateType);
  };

  const toggleFavoriteTemplate = (templateName: string) => {
    if (favoriteTemplates.includes(templateName)) {
      setFavoriteTemplates(favoriteTemplates.filter(t => t !== templateName));
    } else {
      setFavoriteTemplates([...favoriteTemplates, templateName]);
    }
  };

  const runManualAnalysis = async () => {
    if (!analysisText.trim() && !uploadedChartImage) {
      setManualAnalysisError("Please provide either text analysis or upload a chart image.");
      return;
    }

    setManualAnalysisLoading(true);
    setManualAnalysisError(null);

    try {
      // TODO: Backend Integration Required
      // Replace this mock implementation with actual API call to backend
      // API should accept: { text: analysisText, image: uploadedChartImage, pair: selectedPair }
      // Expected response format matches manualAnalysisResult structure below
      
      // Simulated API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result - REPLACE WITH REAL API RESPONSE
      setManualAnalysisResult({
        consensus: "BUY",
        confidence: 89,
        entryPrice: "1.0847",
        stopLoss: "1.0820",
        takeProfit: "1.0875",
        riskReward: "1:1.04",
        positionSize: "2%",
        models: [
          {
            name: "GPT-4 Omni",
            confidence: 87,
            signal: "BUY",
            analysis: "Strong bullish momentum identified with breakout above key resistance. RSI divergence suggests continuation."
          },
          {
            name: "Claude 3.5 Sonnet",
            confidence: 91,
            signal: "BUY",
            analysis: "Market structure supports bullish bias. Clean break of previous high with strong volume confirmation."
          }
        ]
      });

      // Add to history
      setAnalysisHistory(prev => [{
        timestamp: new Date().toISOString(),
        pair: selectedPair,
        text: analysisText,
        hasImage: !!uploadedChartImage,
        result: "BUY"
      }, ...prev.slice(0, 4)]);

    } catch (error) {
      setManualAnalysisError("Failed to analyze. Please try again.");
    } finally {
      setManualAnalysisLoading(false);
    }
  };

  const exportAnalysis = () => {
    // Export analysis as PDF/image - would be implemented with a library
    console.log("Exporting analysis...");
  };

  const shareAnalysis = () => {
    // Share analysis link - would generate a shareable link
    console.log("Sharing analysis...");
  };

  // Estimate tokens based on text length
  useEffect(() => {
    const textTokens = Math.ceil(analysisText.length / 4);
    const imageTokens = uploadedChartImage ? 1000 : 0; // Rough estimate
    setEstimatedTokens(textTokens + imageTokens);
  }, [analysisText, uploadedChartImage]);

  return (
    <TradingLayout>
      {/* Confirmation dialog to add an Active Trade */}
      <TradeConfirmationDialog
        open={showTradeConfirm}
        onOpenChange={(open) => {
          if (!open) {
            setShowTradeConfirm(false);
            clearPopupTimer();
          } else {
            setShowTradeConfirm(true);
          }
        }}
        onConfirm={confirmShareToActiveTrades}
        title="Have you taken the trade?"
        description=""
      />
      <div className="flex flex-col min-h-[calc(100vh-4rem)] overflow-y-auto">
        {/* Header */}
        <div className="relative z-10 my-6 flex-shrink-0">
          {/* First line: title + powered by (stack on mobile, inline on >=sm) */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-3">
            <h1 className="text-5xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Live Trading
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1 sm:mt-0">
              <span className="text-sm opacity-75">powered by</span>
              <img src="/yoforexai.png" alt="YoforexAI.com" className='h-7 sm:h-8 w-auto align-baseline inline-block relative z-10'/>
            </div>
          </div>
          {/* Second line: tagline */}
          <p className="text-muted-foreground text-base">Professional AI-powered trading platform</p>
        </div>

        {/* Quick Pairs Bar & Market Status - Compact Design */}
        <div className="flex flex-col lg:flex-row gap-3 mb-4">
          {/* Quick Pairs Favorites Bar */}
          <Card className="flex-1 p-2.5 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <h3 className="text-sm font-semibold text-foreground">Quick Access</h3>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-primary">
              {quickPairs.map((pair) => {
                const Icon = pair.icon;
                const isSelected = selectedPair === pair.symbol;
                return (
                  <button
                    key={pair.symbol}
                    onClick={() => setSelectedPair(pair.symbol)}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap text-xs
                      transition-all duration-200 border
                      ${isSelected 
                        ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                        : 'bg-card/50 text-foreground border-border/40 hover:border-primary/50 hover:bg-card/80'
                      }
                    `}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-primary-foreground' : pair.color}`} />
                    <span className="font-semibold">{pair.symbol}</span>
                    {isSelected && <ChevronRight className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Market Status */}
          <Card className="p-2.5 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/30 lg:w-40">
            <div className="flex items-center gap-2 mb-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Market</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full animate-pulse ${marketOpen ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-xs font-semibold ${marketOpen ? 'text-green-500' : 'text-red-500'}`}>
                {marketOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </Card>
        </div>

        {/* Quick Stats Cards - Compact Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <Card className="p-3 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-green-500/20">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground">Daily P&L</h3>
                  <p className="text-lg font-bold text-green-500">+$427.50</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">+4.28%</p>
            </div>
          </Card>

          <Card className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-blue-500/20">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground">Win Rate</h3>
                  <p className="text-lg font-bold text-blue-500">68.4%</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">30 trades</p>
            </div>
          </Card>

          <Card className="p-3 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-purple-500/20">
                  <Activity className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground">Total Trades</h3>
                  <p className="text-lg font-bold text-purple-500">47</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Month</p>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="automated" className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-4 flex-shrink-0">
            <TabsTrigger value="automated">Automated AI Trading</TabsTrigger>
            <TabsTrigger value="manual">Manual AI Confirmation</TabsTrigger>
          </TabsList>

          {/* Automated Trading Tab */}
          <TabsContent value="automated" className="flex-1 min-h-0 overflow-y-auto">
            <div className="grid grid-cols-12 gap-6 p-1">
              {/* Left Panel - Market Selection & AI Config */}
              <div className="col-span-12 lg:col-span-3 flex flex-col space-y-5">
                
                {/* Trading Tools Calculator - NEW */}
                <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg">
                  <Accordion type="single" collapsible defaultValue="trading-tools">
                    <AccordionItem value="trading-tools" className="border-0">
                      <div className="bg-gradient-to-r from-primary/10 to-transparent px-5 py-4">
                        <AccordionTrigger className="hover:no-underline p-0">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/20">
                              <Calculator className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">Trading Tools</h3>
                          </div>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent className="px-5 pb-5 pt-2">
                        <div className="space-y-4">
                          {/* Position Size Calculator */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                              <Calculator className="h-4 w-4" />
                              Position Size Calculator
                            </h4>
                            
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Account Size ($)</label>
                                <input
                                  type="number"
                                  value={accountSize}
                                  onChange={(e) => setAccountSize(e.target.value)}
                                  className="w-full px-3 py-2 rounded-md border border-border/40 bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  placeholder="10000"
                                />
                              </div>
                              
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Risk (%)</label>
                                <input
                                  type="number"
                                  value={riskPercent}
                                  onChange={(e) => setRiskPercent(e.target.value)}
                                  className="w-full px-3 py-2 rounded-md border border-border/40 bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  placeholder="2"
                                  step="0.1"
                                />
                              </div>
                              
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Entry Price</label>
                                <input
                                  type="number"
                                  value={entryPrice}
                                  onChange={(e) => setEntryPrice(e.target.value)}
                                  className="w-full px-3 py-2 rounded-md border border-border/40 bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  placeholder="1.0850"
                                  step="0.0001"
                                />
                              </div>
                              
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Stop Loss</label>
                                <input
                                  type="number"
                                  value={stopLossPrice}
                                  onChange={(e) => setStopLossPrice(e.target.value)}
                                  className="w-full px-3 py-2 rounded-md border border-border/40 bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  placeholder="1.0820"
                                  step="0.0001"
                                />
                              </div>
                            </div>

                            {/* Results */}
                            <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Position Size:</span>
                                <span className="font-semibold text-foreground">{positionCalc.units.toLocaleString()} units</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Risk Amount:</span>
                                <span className="font-semibold text-red-500">${positionCalc.riskAmount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Pip Risk:</span>
                                <span className="font-semibold text-foreground">{positionCalc.pipRisk.toFixed(5)}</span>
                              </div>
                            </div>

                            {/* Quick Risk/Reward Display */}
                            <div className="mt-4 pt-4 border-t border-border/20">
                              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Risk/Reward Ratio
                              </h4>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 rounded-full bg-red-500/20">
                                  <div className="h-full w-1/3 rounded-full bg-red-500" />
                                </div>
                                <span className="text-sm font-semibold text-foreground">1:2</span>
                                <div className="flex-1 h-2 rounded-full bg-green-500/20">
                                  <div className="h-full w-2/3 rounded-full bg-green-500" />
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2 text-center">
                                Risk $100 to make $200
                              </p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>

                {/* Market Selection */}
                <MarketSelection 
                  selectedPair={selectedPair}
                  onPairSelect={setSelectedPair}
                />
                
                {/* Timeframe Selection */}
                <TimeframeSelection 
                  selectedTimeframe={selectedTimeframe}
                  onTimeframeSelect={setSelectedTimeframe}
                />

                {/* Strategy Selection Accordion */}
                <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="strategy" className="border-0">
                      <div className="bg-gradient-to-r from-primary/10 to-transparent px-5 py-4">
                        <AccordionTrigger className="hover:no-underline p-0">
                          <h3 className="text-lg font-semibold text-foreground">Strategy Selection</h3>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent className="px-5 pb-5">
                        <StrategySelection 
                          selectedStrategy={selectedStrategy}
                          onStrategySelect={handleStrategySelect}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>

                {/* Multi-Provider AI Analysis */}
                <AIMultiPanel
                  pair={selectedPair}
                  timeframe={selectedTimeframe}
                  strategy={selectedStrategy}
                  onResult={setMultiResult}
                  onConfigChange={(cfg) => setAiConfig({ provider: cfg.provider, models: cfg.models as Record<string,string> })}
                />
              </div>

              {/* Center Panel - Trading Chart and Analysis */}
              <div className="col-span-12 lg:col-span-6 flex flex-col space-y-6">
                <Card className="h-[600px] p-6 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{selectedPair}</h3>
                        <p className="text-xs text-muted-foreground">{selectedTimeframe} Chart</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-[calc(100%-4rem)]">
                    <TradingChart 
                      selectedPair={selectedPair}
                      selectedTimeframe={selectedTimeframe}
                      onCandleDataUpdate={handleCandleDataUpdate}
                    />
                  </div>
                </Card>
                
                {/* Market Analysis Card - Expanded to fill space */}
                <div className="flex-1 min-h-[400px]">
                  {isDailyLocked && (
                    <div className="mb-4 p-4 rounded-lg border border-border/30 bg-muted/20 flex items-center gap-3 text-sm shadow-sm">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">
                        Daily analysis limit reached. Please try again in 24 hours.
                      </span>
                    </div>
                  )}
                  <TechnicalAnalysisCard 
                    analysis={analysis}
                    onRunAnalysis={runMultiFromConfig}
                    disabled={isDailyLocked || !selectedPair || !selectedTimeframe || !selectedStrategy}
                    showRunNew={
                      Boolean(
                        analysis.hasRun &&
                        lastRunSig !== JSON.stringify({ pair: selectedPair, tf: selectedTimeframe, strategy: selectedStrategy, ai: aiConfig })
                      )
                    }
                  />
                  {/* AI Providers Results moved under Market Analysis */}
                  <div className="mt-6">
                    <AIMultiResults result={multiResult} />
                  </div>
                </div>
              </div>

              {/* Right Panel - Live Signals & Positions */}
              <div className="col-span-12 lg:col-span-3 flex flex-col space-y-5">
                <LiveSignals />
                <TradingTips/>
              </div>
            </div>
          </TabsContent>

          {/* Manual AI Confirmation Tab - REDESIGNED */}
          <TabsContent value="manual" className='flex-1 min-h-0 flex flex-col overflow-hidden'>
            {/* Top Action Bar */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Estimated Cost: <span className="text-primary">{estimatedTokens} tokens</span>
                    </p>
                    <p className="text-xs text-muted-foreground">≈ ${(estimatedTokens * 0.00002).toFixed(4)}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                  className="gap-2"
                >
                  <Info className="h-4 w-4" />
                  Shortcuts
                </Button>
                <Button
                  size="lg"
                  onClick={runManualAnalysis}
                  disabled={manualAnalysisLoading || (!analysisText.trim() && !uploadedChartImage)}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 gap-2"
                >
                  {manualAnalysisLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4" />
                      Run Analysis
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
              {/* Left Panel - Enhanced Analysis Input */}
              <div className="col-span-12 lg:col-span-3 space-y-4 overflow-y-auto">
                {/* Chart Upload */}
                <Card className="p-5 bg-gradient-to-br from-card to-card/50 border-border/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10">
                        <ImageIcon className="h-4 w-4 text-blue-500" />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">Chart Upload</h4>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Vision AI
                    </Badge>
                  </div>
                  
                  {!uploadedChartImage ? (
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                        isDragging 
                          ? 'border-primary bg-primary/10 scale-105' 
                          : 'border-border/40 bg-muted/20 hover:border-primary/50 hover:bg-muted/30'
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="p-8 text-center">
                        <Upload className="h-10 w-10 text-primary mx-auto mb-3" />
                        <p className="text-sm font-medium text-foreground mb-1">
                          {isDragging ? 'Drop here' : 'Drop chart screenshot'}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          or click to browse
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          PNG, JPG, WebP • Max 10MB
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                      <img 
                        src={uploadedChartImage} 
                        alt="Uploaded chart" 
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <p className="text-xs font-medium text-white truncate">
                          {uploadedFileName}
                        </p>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={removeUploadedImage}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Text Analysis */}
                <Card className="p-5 bg-gradient-to-br from-card to-card/50 border-border/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/10">
                        <FileText className="h-4 w-4 text-purple-500" />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">Text Analysis</h4>
                    </div>
                    <Button
                      size="sm"
                      variant={isRecording ? "default" : "outline"}
                      onClick={toggleVoiceRecording}
                      className={`h-8 w-8 p-0 ${isRecording ? 'animate-pulse bg-red-500' : ''}`}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>

                  <Textarea
                    placeholder="Describe the market, ask questions, or paste your analysis..."
                    className="min-h-[140px] resize-none rounded-xl border-border/30 bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 mb-3"
                    value={analysisText}
                    onChange={(e) => setAnalysisText(e.target.value)}
                    maxLength={2000}
                  />

                  <div className="flex justify-between items-center text-xs mb-3">
                    <span className={`font-medium ${analysisText.length > 1800 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                      {analysisText.length}/2000 characters
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {Math.ceil(analysisText.length / 4)} tokens
                    </Badge>
                  </div>

                  {/* Quick Templates */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground">Quick Templates</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs"
                        onClick={() => setAnalysisText('')}
                      >
                        Clear
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'technical', name: 'Technical', icon: LineChart },
                        { id: 'sentiment', name: 'Sentiment', icon: TrendingUpIcon },
                        { id: 'risk', name: 'Risk', icon: Target },
                        { id: 'multi', name: 'Multi-TF', icon: Layers }
                      ].map((template) => (
                        <Button
                          key={template.id}
                          size="sm"
                          variant={selectedTemplate === template.id ? "default" : "outline"}
                          onClick={() => applyTemplate(template.id)}
                          className="h-9 text-xs gap-1.5 relative group"
                        >
                          <template.icon className="h-3.5 w-3.5" />
                          {template.name}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavoriteTemplate(template.id);
                            }}
                            className={`absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                              favoriteTemplates.includes(template.id) ? 'bg-yellow-500' : 'bg-muted'
                            }`}
                          >
                            <Star className={`h-2.5 w-2.5 ${favoriteTemplates.includes(template.id) ? 'fill-white text-white' : 'text-muted-foreground'}`} />
                          </button>
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Analysis History */}
                {analysisHistory.length > 0 && (
                  <Card className="p-5 bg-gradient-to-br from-card to-card/50 border-border/30">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/10">
                        <History className="h-4 w-4 text-green-500" />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">Recent Analyses</h4>
                    </div>
                    <div className="space-y-2">
                      {analysisHistory.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer border border-border/20"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-foreground">{item.pair}</span>
                            <Badge variant={item.result === 'BUY' ? 'default' : 'destructive'} className="text-xs h-5">
                              {item.result}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{item.text.substring(0, 50)}...</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                            {item.hasImage && (
                              <ImageIcon className="h-3 w-3 text-primary ml-auto" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* Center Panel - Advanced Interactive Chart */}
              <div className="col-span-12 lg:col-span-6 flex flex-col overflow-hidden">
                <Card className="flex-1 p-5 bg-gradient-to-br from-card to-card/50 border-border/30 overflow-hidden flex flex-col">
                  {/* Chart Header */}
                  <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                        <LineChart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Interactive Chart</h3>
                        <p className="text-xs text-muted-foreground">Professional analysis tools</p>
                      </div>
                    </div>

                    {/* Chart Layout Switcher */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
                        {[
                          { id: 'single' as const, icon: Square },
                          { id: 'split' as const, icon: Layout },
                          { id: 'quad' as const, icon: Grid3x3 }
                        ].map((layout) => (
                          <Button
                            key={layout.id}
                            size="sm"
                            variant={chartLayout === layout.id ? "default" : "ghost"}
                            onClick={() => setChartLayout(layout.id)}
                            className="h-7 w-7 p-0"
                          >
                            <layout.icon className="h-3.5 w-3.5" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Drawing Tools Toolbar */}
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/20 flex-shrink-0 overflow-x-auto">
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/30">
                      {[
                        { id: 'move', icon: Move, label: 'Move' },
                        { id: 'line', icon: Minus, label: 'Trend Line' },
                        { id: 'horizontal', icon: Minus, label: 'Horizontal' },
                        { id: 'rectangle', icon: Square, label: 'Rectangle' },
                        { id: 'circle', icon: Circle, label: 'Circle' },
                        { id: 'text', icon: Type, label: 'Text' },
                        { id: 'pen', icon: Pen, label: 'Draw' }
                      ].map((tool) => (
                        <Button
                          key={tool.id}
                          size="sm"
                          variant={selectedDrawingTool === tool.id ? "default" : "ghost"}
                          onClick={() => setSelectedDrawingTool(tool.id)}
                          className="h-8 w-8 p-0"
                          title={tool.label}
                        >
                          <tool.icon className="h-3.5 w-3.5" />
                        </Button>
                      ))}
                    </div>

                    <div className="h-6 w-px bg-border" />

                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs">
                        <Download className="h-3.5 w-3.5" />
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs">
                        <RotateCcw className="h-3.5 w-3.5" />
                        Undo
                      </Button>
                    </div>

                    <div className="h-6 w-px bg-border" />

                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs gap-1">
                        <Settings className="h-3 w-3" />
                        Indicators
                      </Badge>
                    </div>
                  </div>

                  {/* Chart Container */}
                  <div className="flex-1 rounded-lg overflow-hidden border border-border/20 bg-black/20">
                    <TradingViewWidget
                      symbol={selectedPair}
                      interval={selectedTimeframe.replace('M', '')}
                      theme="dark"
                      autosize={true}
                      hideSideToolbar={false}
                    />
                  </div>

                  {/* Quick Timeframe Switcher */}
                  <div className="flex items-center gap-2 mt-3 flex-shrink-0">
                    <p className="text-xs font-medium text-muted-foreground">Timeframe:</p>
                    <div className="flex items-center gap-1">
                      {['1m', '5m', '15m', '1H', '4H', '1D', '1W'].map((tf) => (
                        <Button
                          key={tf}
                          size="sm"
                          variant={selectedTimeframe === tf ? "default" : "outline"}
                          onClick={() => setSelectedTimeframe(tf)}
                          className="h-7 px-2 text-xs"
                        >
                          {tf}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Panel - Enhanced AI Results & Trading News */}
              <div className="col-span-12 lg:col-span-3 space-y-4 overflow-y-auto">
                {/* AI Analysis Results */}
                <Card className="p-5 bg-gradient-to-br from-card to-card/50 border-border/30">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/10">
                      <Brain className="h-4 w-4 text-green-500" />
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">AI Analysis</h4>
                  </div>

                  {manualAnalysisLoading ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">Analyzing market...</p>
                          <p className="text-xs text-muted-foreground">Processing with AI models</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {['GPT-4', 'Claude', 'Gemini'].map((model) => (
                          <div key={model} className="h-12 rounded-lg bg-muted/20 animate-pulse" />
                        ))}
                      </div>
                    </div>
                  ) : manualAnalysisError ? (
                    <div className="text-center py-6">
                      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground mb-1">Analysis Failed</p>
                      <p className="text-xs text-muted-foreground mb-4">{manualAnalysisError}</p>
                      <Button size="sm" onClick={runManualAnalysis} variant="outline">
                        <RefreshCcw className="h-3 w-3 mr-2" />
                        Retry
                      </Button>
                    </div>
                  ) : manualAnalysisResult ? (
                    <div className="space-y-4">
                      {/* Model Responses */}
                      <div className="space-y-3">
                        {manualAnalysisResult.models.map((model: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:border-primary/30 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Award className="h-3.5 w-3.5 text-primary" />
                                <span className="text-sm font-semibold text-foreground">{model.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Gauge className="h-3 w-3 text-primary" />
                                <span className="text-xs font-medium text-foreground">{model.confidence}%</span>
                              </div>
                            </div>
                            <p className="text-xs text-foreground/80 mb-2 line-clamp-3">{model.analysis}</p>
                            <Badge 
                              variant={model.signal === 'BUY' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {model.signal} Signal
                            </Badge>
                          </div>
                        ))}
                      </div>

                      {/* Consensus Card */}
                      <div className={`p-4 rounded-xl bg-gradient-to-br border-2 ${
                        manualAnalysisResult.consensus === 'BUY' 
                          ? 'from-green-500/10 to-green-500/5 border-green-500/30' 
                          : 'from-red-500/10 to-red-500/5 border-red-500/30'
                      }`}>
                        <div className="text-center mb-4">
                          <Badge 
                            className={`text-lg px-4 py-2 mb-2 ${
                              manualAnalysisResult.consensus === 'BUY' 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-red-500 hover:bg-red-600'
                            } text-white`}
                          >
                            {manualAnalysisResult.consensus}
                          </Badge>
                          <div className="flex items-center justify-center gap-2">
                            <Gauge className="h-4 w-4 text-foreground" />
                            <span className="text-sm font-semibold text-foreground">
                              {manualAnalysisResult.confidence}% Consensus
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-foreground/70">Entry Price:</span>
                            <span className="font-semibold text-foreground">{manualAnalysisResult.entryPrice}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-foreground/70">Stop Loss:</span>
                            <span className="font-semibold text-red-500">{manualAnalysisResult.stopLoss}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-foreground/70">Take Profit:</span>
                            <span className="font-semibold text-green-500">{manualAnalysisResult.takeProfit}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-foreground/70">R:R Ratio:</span>
                            <span className="font-semibold text-foreground">{manualAnalysisResult.riskReward}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-foreground/70">Position Size:</span>
                            <span className="font-semibold text-foreground">{manualAnalysisResult.positionSize}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <Button
                            size="sm"
                            onClick={exportAnalysis}
                            variant="outline"
                            className="gap-1.5"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Export
                          </Button>
                          <Button
                            size="sm"
                            onClick={shareAnalysis}
                            variant="outline"
                            className="gap-1.5"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                            Share
                          </Button>
                        </div>

                        <Button className={`w-full mt-3 ${
                          manualAnalysisResult.consensus === 'BUY' 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-red-500 hover:bg-red-600'
                        } text-white gap-2`}>
                          <Target className="h-4 w-4" />
                          Execute Trade
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-4 rounded-2xl w-fit mx-auto mb-3">
                        <Brain className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-2">Ready to Analyze</p>
                      <p className="text-xs text-muted-foreground">
                        Add text or upload a chart to get started
                      </p>
                    </div>
                  )}
                </Card>

                {/* Market News */}
                <Card className="overflow-hidden bg-gradient-to-br from-card to-card/50 border-border/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10">
                        <Activity className="h-4 w-4 text-blue-500" />
                      </div>
                      <CardTitle className="text-sm font-semibold text-foreground">Trading News</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <TradingTips horizontalLayout={false} showPagination={true} />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Keyboard Shortcuts Modal */}
            {showKeyboardShortcuts && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="w-full max-w-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Keyboard Shortcuts</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowKeyboardShortcuts(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: 'Ctrl + Enter', action: 'Run Analysis' },
                      { key: 'Ctrl + U', action: 'Upload Chart' },
                      { key: 'Ctrl + M', action: 'Toggle Mic' },
                      { key: 'Ctrl + K', action: 'Clear Text' },
                      { key: 'Ctrl + S', action: 'Save Template' }
                    ].map((shortcut) => (
                      <div
                        key={shortcut.key}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/20"
                      >
                        <span className="text-sm text-foreground">{shortcut.action}</span>
                        <Badge variant="outline" className="text-xs font-mono">{shortcut.key}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

        </Tabs>

        {/* Execution Results Component */}
      </div>
    </TradingLayout>
  );
}