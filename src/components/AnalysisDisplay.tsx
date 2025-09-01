import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, TrendingUp, TrendingDown, Target, Shield, BarChart3, RefreshCw } from 'lucide-react';

interface AnalysisDisplayProps {
  analysis: {
    signal: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    entry: number;
    stop_loss: number;
    take_profit: number;
    risk_reward_ratio: string;
    timeframe: string;
    technical_analysis: Record<string, unknown>; // Flexible type for varying parameter names
    recommendation: string;
  };
  onRefresh?: () => void; // Optional callback for refreshing the analysis
}

export function AnalysisDisplay({ analysis, onRefresh }: AnalysisDisplayProps) {
  const confidencePercentage = analysis.confidence;
  
  const getSignalVariant = () => {
    if (analysis.signal === 'BUY') return 'bg-emerald-500/10 text-emerald-600 border-emerald-200/20';
    if (analysis.signal === 'SELL') return 'bg-red-500/10 text-red-600 border-red-200/20';
    return 'bg-amber-500/10 text-amber-600 border-amber-200/20';
  };

  const getSignalIcon = () => {
    if (analysis.signal === 'BUY') return <TrendingUp className="h-4 w-4" />;
    if (analysis.signal === 'SELL') return <TrendingDown className="h-4 w-4" />;
    return <BarChart3 className="h-4 w-4" />;
  };

  const getConfidenceColor = () => {
    if (confidencePercentage >= 80) return 'text-emerald-600';
    if (confidencePercentage >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null || isNaN(price)) {
      return 'N/A';
    }
    return price.toFixed(5);
  };

  return (
    <div className="space-y-6">
      {/* Main Signal Card */}
      <Card className="p-6 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-border/20 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${getSignalVariant()}`}>
              {getSignalIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className={`${getSignalVariant()} text-sm font-semibold px-3 py-1`}>
                  {analysis.signal}
                </Badge>
                <span className="text-xs text-muted-foreground">{analysis.timeframe}</span>
              </div>
              <p className="text-sm text-muted-foreground">Trading Signal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Confidence</p>
              <p className={`text-2xl font-bold ${getConfidenceColor()}`}>{confidencePercentage}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Risk/Reward</p>
              <p className="text-2xl font-bold text-foreground">{analysis.risk_reward_ratio}</p>
            </div>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="flex items-center gap-2 hover:bg-primary/10 border-primary/20"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Analysis
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Trading Levels */}
      <Card className="p-6 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-border/20 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Trading Levels</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-blue-500/5 border border-blue-200/20 hover:bg-blue-500/10 transition-colors">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <p className="text-sm font-medium text-muted-foreground">Entry Price</p>
            </div>
            <p className="text-xl font-bold text-blue-600">{formatPrice(analysis.entry)}</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-red-500/5 border border-red-200/20 hover:bg-red-500/10 transition-colors">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-3 h-3 text-red-500" />
              <p className="text-sm font-medium text-muted-foreground">Stop Loss</p>
            </div>
            <p className="text-xl font-bold text-red-600">{formatPrice(analysis.stop_loss)}</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-emerald-500/5 border border-emerald-200/20 hover:bg-emerald-500/10 transition-colors">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-3 h-3 text-emerald-500" />
              <p className="text-sm font-medium text-muted-foreground">Take Profit</p>
            </div>
            <p className="text-xl font-bold text-emerald-600">{formatPrice(analysis.take_profit)}</p>
          </div>
        </div>
      </Card>

      {/* Technical Analysis */}
      <Card className="p-6 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-border/20 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Technical Analysis</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(analysis.technical_analysis ?? {}).map(([key, value]) => {
            // Helper function to format parameter names for display
            const formatParameterName = (paramName: string) => {
              return paramName
                .replace(/_/g, ' ')
                .replace(/([A-Z])/g, ' $1')
                .trim()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
            };

            // Generic styling for all parameters
            const getParameterStyling = () => {
              return {
                bgColor: 'bg-muted/20 border-muted/40 hover:bg-muted/30',
                textColor: 'text-foreground',
                dotColor: 'bg-primary',
                icon: null
              };
            };

            const styling = getParameterStyling();
            const displayName = formatParameterName(key);
            
            return (
              <div 
                key={key} 
                className={`p-4 rounded-xl border transition-colors ${styling.bgColor}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {styling.icon || <div className={`w-3 h-3 rounded-full ${styling.dotColor}`}></div>}
                    <span className="text-sm font-medium text-muted-foreground">{displayName}</span>
                  </div>
                  <div className="text-right">
                    {typeof value === 'number' ? (
                      <span className={`text-lg font-bold ${styling.textColor}`}>
                        {formatPrice(value)}
                      </span>
                    ) : (
                      <Badge 
                        variant="secondary"
                        className="font-medium"
                      >
                        {String(value)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* AI Recommendation */}
      <Card className="p-6 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-border/20 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">AI Analysis & Recommendation</h3>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
            {analysis.recommendation}
          </p>
        </div>
      </Card>
    </div>
  );
}
