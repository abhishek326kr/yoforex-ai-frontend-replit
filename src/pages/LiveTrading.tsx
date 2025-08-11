import { useState } from 'react';
import {
  Activity,
  Target,
  Upload,
  Zap,
  Mic,
  Loader2,
  AlertCircle
} from 'lucide-react';

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
}

// Import the AnalysisDisplay component
import { AnalysisDisplay } from '@/components/AnalysisDisplay';

// Technical Analysis Card Component
const TechnicalAnalysisCard = ({ analysis, onRunAnalysis, disabled = false }: TechnicalAnalysisCardProps) => (
  <Card className="p-4 bg-gradient-glass backdrop-blur-sm border-border/20 mt-4">
    <h3 className="text-lg font-semibold text-foreground mb-3">Market Analysis</h3>
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
        <p className="text-muted-foreground text-sm mb-6 max-w-md">
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
      <AnalysisDisplay analysis={analysis.data.analysis} onRefresh={onRunAnalysis} />
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

export function LiveTrading() {
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
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setAnalysis({ 
        loading: false, 
        error: 'Failed to fetch analysis. Please try again.', 
        data: null,
        hasRun: true
      });
    }
  };

  return (
    <TradingLayout>
      <div className="flex flex-col min-h-[calc(100vh-4rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-4 flex-shrink-0">
          <div>
            <div className="flex items-baseline mb-2">
              <h1 className="text-4xl font-bold text-foreground mr-3">Live Trading</h1>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="text-sm opacity-75">powered by</span>
                <img src="/yoforexai.png" alt="YoforexAI.com" className='h-7 w-auto'/>
              </div>
            </div>
            <p className="text-muted-foreground">AI-powered forex analysis and automated trading</p>
          </div>
          <div className="flex items-center space-x-3 mt-2 sm:mt-0">
            <Badge variant="secondary" className="bg-gradient-profit text-white">
              <Activity className="h-3 w-3 mr-1" />
              Live Markets
            </Badge>
            <Button className="bg-gradient-primary hover:bg-primary-hover whitespace-nowrap">
              <Zap className="h-4 w-4 mr-2" />
              Emergency Stop
            </Button>
          </div>
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
                  <TechnicalAnalysisCard 
                    analysis={analysis}
                    onRunAnalysis={handleAnalysis}
                    disabled={!selectedPair || !selectedTimeframe || !selectedStrategy}
                  />
                </div>
              </div>

              {/* Right Panel - Live Signals & Positions */}
              <div className="col-span-12 lg:col-span-3 flex flex-col space-y-4">
                <LiveSignals />
                <ActivePositions/>
                <TradingTips/>
              </div>
            </div>
          </TabsContent>

          {/* Manual AI Confirmation Tab */}
          <TabsContent value="manual" className='flex-1 min-h-0 flex flex-col'>
            <div className="grid grid-cols-12 gap-4 min-h-[800px]">
              {/* Left Panel - Analysis Input */}
              <div className="col-span-12 lg:col-span-3 space-y-6">
                <Card className="p-4 bg-gradient-glass backdrop-blur-sm border-border/20">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Analysis Input</h3>
                  {/* Upload Section */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-foreground mb-2">Upload Chart</h4>
                    <div className="border-2 border-dashed border-border/40 rounded-lg p-6 text-center hover:border-border/60 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-foreground">Drop chart screenshot here</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP up to 10MB</p>
                    </div>
                  </div>
                  {/* Technical Analysis */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-foreground mb-3">Technical Analysis</h4>
                    {analysis.loading ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        <span>Analyzing market data...</span>
                      </div>
                    ) : analysis.error ? (
                      <div className="flex items-center gap-2 text-destructive p-3 rounded-md bg-destructive/10 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {analysis.error}
                      </div>
                    ) : !analysis.hasRun ? (
                      <div className="text-sm text-muted-foreground p-3 text-center">
                        <p>Click "Run AI Analysis" to analyze the market</p>
                        <Button 
                          onClick={handleAnalysis}
                          className="mt-2 bg-gradient-primary hover:bg-primary-hover"
                          disabled={!selectedPair || !selectedTimeframe || !selectedStrategy}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Run AI Analysis
                        </Button>
                      </div>
                    ) : analysis.data?.analysis?.technical_analysis ? (
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-muted/20 rounded">
                            <p className="text-muted-foreground text-xs">Support</p>
                            <p className="font-medium">{analysis.data.analysis.technical_analysis.Support_Level?.toFixed(5) || 'N/A'}</p>
                          </div>
                          <div className="p-2 bg-muted/20 rounded">
                            <p className="text-muted-foreground text-xs">Resistance</p>
                            <p className="font-medium">{analysis.data.analysis.technical_analysis.Resistance_Level?.toFixed(5) || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="p-2 bg-muted/10 rounded">
                          <p className="text-muted-foreground text-xs">Volume Confirmation</p>
                          <p className="font-medium">{analysis.data.analysis.technical_analysis.Volume_Confirmation || 'N/A'}</p>
                        </div>
                        <div className="p-2 bg-muted/10 rounded">
                          <p className="text-muted-foreground text-xs">Breakout Direction</p>
                          <p className="font-medium">{analysis.data.analysis.technical_analysis.Breakout_Direction || 'N/A'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground p-3 text-center">
                        <p>No analysis data available. Try running the analysis again.</p>
                        <Button 
                          onClick={handleAnalysis}
                          className="mt-2 bg-gradient-primary hover:bg-primary-hover"
                          disabled={!selectedPair || !selectedTimeframe || !selectedStrategy}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Retry Analysis
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Text Analysis */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground">Text Analysis</h4>
                      <Button size="sm" variant="outline">
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Describe the market situation, ask specific questions, or paste trading analysis..."
                      className="min-h-[120px] resize-none"
                      value={analysisText}
                      onChange={(e) => setAnalysisText(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-2">
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
                  {/* Input Type Selection */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-foreground mb-2">Analysis Type</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <Button variant="outline" className="justify-start h-auto p-3">
                        <div className="text-left">
                          <p className="text-sm font-medium">Text Only</p>
                          <p className="text-xs text-muted-foreground">Standard text analysis</p>
                        </div>
                      </Button>
                      <Button variant="outline" className="justify-start h-auto p-3">
                        <div className="text-left">
                          <p className="text-sm font-medium">Image Only</p>
                          <p className="text-xs text-muted-foreground">Chart screenshot analysis</p>
                        </div>
                      </Button>
                      <Button className="justify-start h-auto p-3 bg-gradient-primary">
                        <div className="text-left">
                          <p className="text-sm font-medium">Text + Image</p>
                          <p className="text-xs opacity-90">Combined analysis</p>
                        </div>
                      </Button>
                    </div>
                  </div>
                  {/* AI Model Selection */}
                  <AiModelsSelection />
                </Card>
              </div>

              {/* Center Panel - Interactive Chart */}
              <div className="col-span-12 lg:col-span-6">
                <Card className="p-4 bg-gradient-glass backdrop-blur-sm border-border/20 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Interactive Chart</h3>
                      <p className="text-sm text-muted-foreground">Annotate and analyze with drawing tools</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">Screenshot</Button>
                      <Button size="sm" variant="outline">Annotate</Button>
                    </div>
                  </div>
                  {/* Chart Placeholder */}
                  <div className="h-[600px] bg-gradient-dark rounded-lg border border-border/20 overflow-hidden">
                    <div className="h-full w-full">
                      <TradingViewWidget
                        symbol={selectedPair}
                        interval={selectedTimeframe.replace('M', '')}
                        theme="dark"
                        autosize={true}
                        hideSideToolbar={false}
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Panel - AI Analysis Results and News */}
              <div className="col-span-12 lg:col-span-3 space-y-6">
                {/* Market News */}
                <Card className="bg-gradient-glass backdrop-blur-sm border-border/20 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Market News</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <TradingTips horizontalLayout={false} showPagination={true} />
                  </CardContent>
                </Card>
                <Card className="overflow-hidden bg-gradient-glass backdrop-blur-sm border-border/20">
                  <Accordion type="single" collapsible defaultValue="ai-analysis" className="w-full">
                    <AccordionItem value="ai-analysis" className="border-0">
                      <div className="bg-gradient-to-r from-primary/5 to-transparent px-4 py-3">
                        <AccordionTrigger className="hover:no-underline p-0">
                          <h3 className="text-lg font-semibold text-foreground">AI Analysis Results</h3>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        {/* Individual Model Responses */}
                        <div className="space-y-4 mb-6">
                          <div className="p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
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
                            <Badge className="bg-gradient-profit text-xs">BUY Signal</Badge>
                          </div>
                          <div className="p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
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
                            <Badge className="bg-gradient-profit text-xs">BUY Signal</Badge>
                          </div>
                        </div>
                        {/* Consensus Recommendation */}
                        <div className="p-4 rounded-lg bg-gradient-profit/20 border border-accent/30">
                          <div className="text-center mb-4">
                            <Badge className="bg-gradient-profit text-lg px-4 py-2 mb-2">BUY</Badge>
                            <div className="flex items-center justify-center space-x-1">
                              <div className="h-3 w-3 rounded-full bg-accent" />
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
                              <span className="font-medium text-trading-loss">1.0820</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground/80">Take Profit:</span>
                              <span className="font-medium text-trading-profit">1.0875</span>
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
                          <Button className="w-full mt-4 bg-gradient-profit hover:bg-accent/90">
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