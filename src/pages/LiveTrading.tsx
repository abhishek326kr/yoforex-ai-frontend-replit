import { useEffect, useState } from 'react';
// import { useToast } from '@/hooks/use-toast';
import {
  Activity,
  Target,
  Upload,
  Zap,
  Mic,
  Loader2,
  AlertCircle,
  Lock
} from 'lucide-react';
import { fetchTradingAnalysis, type Timeframe, type TradingStrategy } from '@/lib/api/analysis';
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
import { emitBillingUpdated } from '@/lib/billingEvents';
import { useBillingSummary } from '@/hooks/useBillingSummary';

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
  <Card className="p-4 bg-gradient-glass backdrop-blur-sm border-border/20 mt-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold text-foreground">Market Analysis</h3>
      <div className="flex items-center gap-2">
        {analysis.hasRun && !analysis.loading && (
          <Button size="sm" variant="outline" onClick={onRunAnalysis} disabled={disabled}>
            Retry Analysis
          </Button>
        )}
        {showRunNew && !analysis.loading && (
          <Button size="sm" onClick={onRunAnalysis} disabled={disabled} className="bg-primary/80 hover:bg-primary">
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
      <div className="flex flex-col items-center p-6 text-center">
        <div className="bg-muted/20 p-4 rounded-full mb-4">
          <Zap className="h-8 w-8 text-primary" />
        </div>
        <h4 className="text-lg font-medium mb-2">Run Market Analysis</h4>
        <p className="text-muted-foreground text-sm mb-6">
          Get detailed technical analysis, trade signals, and risk assessment for the selected currency pair.
        </p>
        <Button 
          onClick={onRunAnalysis}
          className="bg-gradient-primary hover:bg-primary-hover px-6 py-5 text-base"
          disabled={disabled}
        >
          <Zap className="h-5 w-5 mr-2" />
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
  const isDailyLocked = !!(billing && typeof billing.daily_cap === 'number' && typeof billing.daily_credits_spent === 'number' && billing.daily_credits_spent >= billing.daily_cap);
  const STORAGE_KEY = 'live_trading_last_analysis_v1';

  // Save last successful analysis to localStorage
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
        ts: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  };

  // Restore last analysis on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const cached = JSON.parse(raw);
      if (cached?.analysisData) {
        setSelectedPair(cached.selectedPair || selectedPair);
        setSelectedTimeframe(cached.selectedTimeframe || selectedTimeframe);
        setSelectedStrategy(cached.selectedStrategy || '');
        setAiConfig(cached.aiConfig || null);
        setLastRunSig(cached.lastRunSig || null);
        setMultiResult(cached.multiResult || null);
        setAnalysis({ loading: false, error: null, data: cached.analysisData, hasRun: true });
      }
    } catch {
      // ignore parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // Notify global listeners (e.g., header) to refresh billing if backend returned billing info
      if ((result as any)?.billing) {
        emitBillingUpdated((result as any).billing);
      }
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
      // Emit billing updated if present
      if ((data as any)?.billing) {
        emitBillingUpdated((data as any).billing);
      }

      // Update last run signature
      const sig = JSON.stringify({ pair: selectedPair, tf: selectedTimeframe, strategy: selectedStrategy, ai: aiConfig });
      setLastRunSig(sig);
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

  return (
    <TradingLayout>
      <div className="flex flex-col min-h-[calc(100vh-4rem)] overflow-y-auto">
        {/* Header */}
        <div className="relative z-10 my-4 sm:my-5 flex-shrink-0">
          {/* First line: title + powered by (stack on mobile, inline on >=sm) */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 mb-2 sm:mb-3">
            <h1 className="text-4xl font-bold text-foreground">Live Trading</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1 sm:mt-0">
              <span className="text-sm opacity-75">powered by</span>
              <img src="/yoforexai.png" alt="YoforexAI.com" className='h-6 sm:h-7 w-auto align-baseline inline-block relative z-10'/>
            </div>
          </div>
          {/* Second line: tagline */}
          <p className="text-muted-foreground text-sm sm:text-base">AI-powered forex analysis and automated trading</p>
        </div>

        <Tabs defaultValue="automated" className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-4 flex-shrink-0">
            <TabsTrigger value="automated">Automated AI Trading</TabsTrigger>
            <TabsTrigger value="manual">Manual AI Confirmation</TabsTrigger>
          </TabsList>

          {/* Automated Trading Tab */}
          <TabsContent value="automated" className="flex-1 min-h-0 overflow-y-auto">
            <div className="grid grid-cols-12 gap-4 p-1">
              {/* Left Panel - Market Selection & AI Config */}
              <div className="col-span-12 lg:col-span-3 flex flex-col space-y-4">
                
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
                <Accordion type="single" collapsible className="border rounded-lg overflow-hidden">
                  <AccordionItem value="strategy" className="border-b">
                    <AccordionTrigger className="px-4 py-3 text-left font-medium flex justify-between items-center w-full hover:bg-secondary/30 transition-colors">
                      <span>Strategy Selection</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <StrategySelection 
                        selectedStrategy={selectedStrategy}
                        onStrategySelect={handleStrategySelect}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

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
              <div className="col-span-12 lg:col-span-6 flex flex-col space-y-4">
                <div className="h-[600px]">
                  <TradingChart 
                    selectedPair={selectedPair}
                    selectedTimeframe={selectedTimeframe}
                    onCandleDataUpdate={handleCandleDataUpdate}
                  />
                </div>
                
                {/* Market Analysis Card - Expanded to fill space */}
                <div className="flex-1 min-h-[400px]">
                  {isDailyLocked && (
                    <div className="mb-3 p-3 rounded-md border border-border/30 bg-muted/20 flex items-center gap-2 text-sm">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span>
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
                  <div className="mt-4">
                    <AIMultiResults result={multiResult} />
                  </div>
                </div>
              </div>

              {/* Right Panel - Live Signals & Positions */}
              <div className="col-span-12 lg:col-span-3 flex flex-col space-y-4">
                <LiveSignals />
                {/* <ActivePositions/> */}
                <TradingTips/>
              </div>
            </div>
          </TabsContent>

          {/* Manual AI Confirmation Tab */}
          <TabsContent value="manual" className='flex-1 min-h-0 flex flex-col'>
            <div className="grid grid-cols-12 gap-6 min-h-[800px]">
              {/* Left Panel - Analysis Input */}
              <div className="col-span-12 lg:col-span-3 space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Analysis Input</h3>
                  </div>
                  
                  {/* Upload Chart Section */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <h4 className="text-sm font-medium text-foreground">Upload Chart</h4>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10">
                        <Lock className="h-3 w-3 text-primary" />
                        <span className="text-xs text-primary font-medium">Pro</span>
                      </div>
                    </div>
                    <div className="rounded-lg border-2 border-dashed border-border/40 bg-muted/20 p-6 text-center opacity-60">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Drop chart screenshot here</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WebP up to 10MB</p>
                    </div>
                  </div>

                  {/* Text Analysis Section */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-foreground" />
                        <h4 className="text-sm font-medium text-foreground">Text Analysis</h4>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Describe the market situation, ask specific questions, or paste trading analysis..."
                          className="min-h-[120px] resize-none rounded-xl border-border/30 bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                        value={analysisText}
                        onChange={(e) => setAnalysisText(e.target.value)}
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{analysisText.length}/2000</span>
                        <Select>
                          <SelectTrigger className="w-[140px] h-8">
                            <SelectValue placeholder="Template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical Analysis</SelectItem>
                            <SelectItem value="sentiment">Market Sentiment</SelectItem>
                            <SelectItem value="risk">Risk Management</SelectItem>
                            <SelectItem value="multi">Multi-timeframe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Type Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-foreground" />
                        <h4 className="text-sm font-medium text-foreground">Analysis Type</h4>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10">
                        <Lock className="h-3 w-3 text-primary" />
                        <span className="text-xs text-primary font-medium">Pro</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 opacity-60">
                      <Button variant="outline" className="justify-start h-auto p-3 pointer-events-none">
                        <div className="text-left">
                          <p className="text-sm font-medium">Text Only</p>
                          <p className="text-xs text-muted-foreground">Standard text analysis</p>
                        </div>
                      </Button>
                      <Button variant="outline" className="justify-start h-auto p-3 pointer-events-none">
                        <div className="text-left">
                          <p className="text-sm font-medium">Image Only</p>
                          <p className="text-xs text-muted-foreground">Chart screenshot analysis</p>
                        </div>
                      </Button>
                      <Button className="justify-start h-auto p-3 bg-primary pointer-events-none">
                        <div className="text-left">
                          <p className="text-sm font-medium text-white">Text + Image</p>
                          <p className="text-xs text-white/90">Combined analysis</p>
                        </div>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Center Panel - Interactive Chart */}
              <div className="col-span-12 lg:col-span-6">
                <Card className="h-full p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Interactive Chart</h3>
                        <p className="text-sm text-muted-foreground">Annotate and analyze with drawing tools</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">Screenshot</Button>
                      <Button size="sm" variant="outline">Annotate</Button>
                    </div>
                  </div>
                  
                  {/* Chart Container */}
                  <div className="h-[600px] rounded-lg overflow-hidden border border-border/20">
                    <TradingViewWidget
                      symbol={selectedPair}
                      interval={selectedTimeframe.replace('M', '')}
                      theme="dark"
                      autosize={true}
                      hideSideToolbar={false}
                    />
                  </div>
                </Card>
              </div>

              {/* Right Panel - AI Analysis Results and News */}
              <div className="col-span-12 lg:col-span-3 space-y-6">
                {/* Market News */}
                <Card className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <Activity className="h-4 w-4 text-accent" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-foreground">Market News</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <TradingTips horizontalLayout={false} showPagination={true} />
                  </CardContent>
                </Card>
                
                {/* AI Analysis Results */}
                <Card className="overflow-hidden">
                  <Accordion type="single" collapsible defaultValue="ai-analysis" className="w-full">
                    <AccordionItem value="ai-analysis" className="border-0">
                      <div className="px-6 py-4">
                        <AccordionTrigger className="hover:no-underline p-0">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Zap className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">AI Analysis Results</h3>
                          </div>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent className="px-6 pb-6 pt-2">
                        {/* Individual Model Responses */}
                        <div className="space-y-4 mb-6">
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-foreground">GPT-4 Omni</span>
                              <div className="flex items-center space-x-1">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-xs text-foreground">87%</span>
                              </div>
                            </div>
                            <p className="text-xs text-foreground/80 mb-2">
                              Strong bullish momentum identified with breakout above key resistance. RSI divergence suggests continuation.
                            </p>
                            <Badge className="bg-green-500 text-white text-xs">BUY Signal</Badge>
                          </div>
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-foreground">Claude 3.5 Sonnet</span>
                              <div className="flex items-center space-x-1">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-xs text-foreground">91%</span>
                              </div>
                            </div>
                            <p className="text-xs text-foreground/80 mb-2">
                              Market structure supports bullish bias. Clean break of previous high with strong volume confirmation.
                            </p>
                            <Badge className="bg-green-500 text-white text-xs">BUY Signal</Badge>
                          </div>
                        </div>
                        
                        {/* Consensus Recommendation */}
                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                          <div className="text-center mb-4">
                            <Badge className="bg-green-500 text-white text-lg px-4 py-2 mb-2">BUY</Badge>
                            <div className="flex items-center justify-center space-x-1">
                              <div className="h-3 w-3 rounded-full bg-green-500" />
                              <span className="text-sm font-medium text-foreground">89% Confidence</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground/80">Entry Price:</span>
                              <span className="font-medium text-foreground">1.0847</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground/80">Stop Loss:</span>
                              <span className="font-medium text-red-500">1.0820</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground/80">Take Profit:</span>
                              <span className="font-medium text-green-500">1.0875</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground/80">Risk/Reward:</span>
                              <span className="font-medium text-foreground">1:1.04</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground/80">Position Size:</span>
                              <span className="font-medium text-foreground">2% of account</span>
                            </div>
                          </div>
                          <Button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white">
                            <Target className="h-4 w-4 mr-2" />
                            Execute Trade
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              </div>
            </div>
          </TabsContent>

        </Tabs>

        {/* Execution Results Component */}
      </div>
    </TradingLayout>
  );
}