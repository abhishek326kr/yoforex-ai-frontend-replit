import { FC, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { fetchTradingAnalysis, CandleData } from "@/lib/api/analysis";
import formattedTimeframe from "@/lib/api/analysis";
import { mapToOandaInstrument } from "@/utils/trading";

interface TechnicalAnalysis {
  Support_Level: number;
  Resistance_Level: number;
  Volume_Confirmation: string;
  Breakout_Direction: string;
}

interface AnalysisResponse {
  pair: string;
  granularity: string;
  candles: CandleData[];
  analysis: {
    signal: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    entry: number;
    stop_loss: number;
    take_profit: number;
    risk_reward_ratio: string;
    timeframe: string;
    technical_analysis: TechnicalAnalysis;
    recommendation: string;
  };
}
interface TradeExecutionProps {
  candleData: CandleData[];
  selectedTimeframe: string;
  selectedStrategy: string;
  selectedPair: string;
}

const TradeExecution: FC<TradeExecutionProps> = ({selectedTimeframe, selectedStrategy, selectedPair }) => {
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candleData] = useState<any[]>([]);

  const analyzeMarket = async () => {

    setIsLoading(true);
    setError(null);

    try {
      // Calculate count based on the selected timeframe
      const count = calculateCandleCount(selectedTimeframe);
      
      const analysisData = await fetchTradingAnalysis({
        pair: mapToOandaInstrument(selectedPair),
        timeframe: formattedTimeframe(selectedTimeframe),
        strategy: selectedStrategy as any, // We know this is a valid strategy
        count,
        
      });

      setAnalysis(analysisData);
      toast({
        title: "Analysis Complete",
        description: "Market analysis has been successfully generated.",
      });
    } catch (err) {
      console.error("Error analyzing market:", err);
      setError("Failed to analyze market. Please try again.");
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the market. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCandleCount = (timeframe: string): number => {
    // Default to 100 candles for unknown timeframes
    const defaultCount = 100;
    
    const counts: Record<string, number> = {
      'M1': 240,    // 4 hours
      'M5': 288,    // 24 hours
      'M15': 192,   // 2 days
      'M30': 336,   // 1 week
      'H1': 168,    // 1 week
      'H4': 168,    // 4 weeks
      'D': 90,      // 3 months
      'W': 52,      // 1 year
      'M': 60       // 5 years
    };

    return counts[timeframe] || defaultCount;
  };

  const formatPrice = (price: number): string => {
    return price.toFixed(5);
  };

  const getSignalVariant = (signal: 'BUY' | 'SELL' | 'HOLD') => {
    switch (signal) {
      case 'BUY': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'SELL': return 'bg-red-500/10 text-red-500 border-red-500/30';
      default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
    }
  };

  const getSignalIcon = (signal: 'BUY' | 'SELL' | 'HOLD') => {
    switch (signal) {
      case 'BUY': return <ArrowUpRight className="h-4 w-4" />;
      case 'SELL': return <ArrowDownRight className="h-4 w-4" />;
      default: return null;
    }
  };

  if (!analysis) {
    return (
      <Card className="h-full flex flex-col bg-gradient-glass backdrop-blur-sm border-border/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Trade Analysis</CardTitle>
          <CardDescription>
            {error ? (
              <Alert variant="destructive" className="text-left">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              "Run analysis to get trade recommendations"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center">
          <Button 
            onClick={analyzeMarket} 
            disabled={isLoading || !candleData.length || !selectedTimeframe || !selectedStrategy}
            className="w-full max-w-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Market'
            )}
          </Button>
          {(!candleData.length || !selectedTimeframe || !selectedStrategy) && (
            <p className="mt-2 text-sm text-muted-foreground text-center">
              {!candleData.length && "• No chart data available"}
              {!selectedTimeframe && "• No timeframe selected"}
              {!selectedStrategy && "• No strategy selected"}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col bg-gradient-glass backdrop-blur-sm border-border/20">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {analysis.pair.replace('_', '/')}
              <Badge variant="outline" className={getSignalVariant(analysis.analysis.signal)}>
                {getSignalIcon(analysis.analysis.signal)}
                <span className="ml-1">{analysis.analysis.signal}</span>
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              {analysis.analysis.timeframe} • {new Date().toLocaleString()}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={analyzeMarket}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Signal Confidence */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-medium">{analysis.analysis.confidence}%</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div 
              className={`h-full ${analysis.analysis.signal === 'BUY' ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${analysis.analysis.confidence}%` }}
            />
          </div>
        </div>

        {/* Key Levels */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Entry</p>
            <p className="font-mono">{formatPrice(analysis.analysis.entry)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Stop Loss</p>
            <p className="font-mono text-red-500">{formatPrice(analysis.analysis.stop_loss)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Take Profit</p>
            <p className="font-mono text-green-500">{formatPrice(analysis.analysis.take_profit)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Risk/Reward</p>
            <p className="font-mono">{analysis.analysis.risk_reward_ratio}</p>
          </div>
        </div>

        {/* Technical Analysis */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Technical Indicators</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="border rounded-lg p-3 space-y-1">
              <p className="text-muted-foreground text-xs">Support</p>
              <p className="font-mono">{formatPrice(analysis.analysis.technical_analysis.Support_Level)}</p>
            </div>
            <div className="border rounded-lg p-3 space-y-1">
              <p className="text-muted-foreground text-xs">Resistance</p>
              <p className="font-mono">{formatPrice(analysis.analysis.technical_analysis.Resistance_Level)}</p>
            </div>
            <div className="border rounded-lg p-3 space-y-1">
              <p className="text-muted-foreground text-xs">Volume</p>
              <p>{analysis.analysis.technical_analysis.Volume_Confirmation}</p>
            </div>
            <div className="border rounded-lg p-3 space-y-1">
              <p className="text-muted-foreground text-xs">Breakout</p>
              <p>{analysis.analysis.technical_analysis.Breakout_Direction}</p>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recommendation</h4>
          <p className="text-sm text-muted-foreground">{analysis.analysis.recommendation}</p>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 pt-4 border-t">
        <Button className="flex-1" size="lg">
          Place {analysis.analysis.signal} Order
        </Button>
        <Button variant="outline" className="flex-1" size="lg">
          Copy Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TradeExecution;
