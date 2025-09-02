import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, TrendingUp, TrendingDown, Target, Shield, BarChart3, RefreshCw } from 'lucide-react';

interface TechnicalAnalysis {
  trend_strength?: string;
  rsi?: number;
  macd?: number;
  moving_averages?: string;
  volume?: string;
  [key: string]: unknown; // Allow for additional dynamic properties
}

interface AnalysisDisplayProps {
  analysis: {
    signal: 'BUY' | 'SELL' | 'HOLD' | 'STRADDLE_BUY' | 'STRADDLE_SELL';
    confidence: number;
    entry: number;
    stop_loss: number;
    take_profit: number;
    call_entry?: number;
    put_entry?: number;
    breakeven_upper?: number;
    breakeven_lower?: number;
    risk_reward_ratio: string;
    timeframe: string;
    technical_analysis?: TechnicalAnalysis;
    recommendation: string;
  };
  onRefresh?: () => void; // Optional callback for refreshing the analysis
}

export function AnalysisDisplay({ analysis, onRefresh }: AnalysisDisplayProps) {
  const confidencePercentage = analysis.confidence;
  
  const getSignalVariant = () => {
    if (analysis.signal === 'BUY' || analysis.signal === 'STRADDLE_BUY') return 'bg-emerald-500/10 text-emerald-600 border-emerald-200/20';
    if (analysis.signal === 'SELL' || analysis.signal === 'STRADDLE_SELL') return 'bg-red-500/10 text-red-600 border-red-200/20';
    return 'bg-amber-500/10 text-amber-600 border-amber-200/20';
  };

  const getSignalIcon = () => {
    if (analysis.signal === 'BUY' || analysis.signal === 'STRADDLE_BUY') return <TrendingUp className="h-4 w-4" />;
    if (analysis.signal === 'SELL' || analysis.signal === 'STRADDLE_SELL') return <TrendingDown className="h-4 w-4" />;
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

  // Render helper for technical analysis values (numbers, strings, arrays, objects)
  const renderTechValue = (value: unknown) => {
    if (typeof value === 'number') {
      return (
        <span className="text-lg font-bold text-foreground">{formatPrice(value)}</span>
      );
    }
    if (typeof value === 'string') {
      return (
        <Badge variant="secondary" className="font-medium">{value}</Badge>
      );
    }
    if (Array.isArray(value)) {
      // Handle arrays of primitives or objects
      if (value.length === 0) {
        return <span className="text-xs text-muted-foreground">No data</span>;
      }
      return (
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5 text-left">
          {value.map((v, i) => {
            if (typeof v === 'number') {
              return (
                <li key={i} className="break-words">{formatPrice(v)}</li>
              );
            }
            if (typeof v === 'string') {
              return (
                <li key={i} className="break-words">{v}</li>
              );
            }
            if (v && typeof v === 'object') {
              const o = v as Record<string, unknown>;
              // Common shape: { type: 'support'|'resistance', value/price/level: number }
              const type = (o.type as string) || (o.kind as string) || '';
              const num = (o.value as number) ?? (o.price as number) ?? (o.level as number);
              if (type && typeof num === 'number') {
                return (
                  <li key={i} className="break-words">
                    <span className="capitalize text-foreground/80 font-medium">{type}:</span> {formatPrice(num)}
                  </li>
                );
              }
              // Fallback: key=value pairs
              return (
                <li key={i} className="break-words">
                  {Object.entries(o).map(([k, val], idx) => (
                    <span key={k}>
                      {idx > 0 ? ', ' : ''}
                      <span className="text-foreground/80 font-medium">{k}:</span> {typeof val === 'number' ? formatPrice(val) : String(val)}
                    </span>
                  ))}
                </li>
              );
            }
            return (
              <li key={i} className="break-words">{String(v)}</li>
            );
          })}
        </ul>
      );
    }
    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      // Special-case: common shape for key levels
      const hasSupportResistance = 'support' in obj || 'resistance' in obj;
      if (hasSupportResistance) {
        return (
          <div className="text-left space-y-2">
            {/* Render Support(s) */}
            {(() => {
              const supportVal = (obj.support ?? obj.supports ?? (obj.levels as any)?.support) as unknown;
              if (Array.isArray(supportVal) && supportVal.length > 0) {
                return (
                  <div>
                    <p className="text-xs font-medium text-foreground">Support</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {supportVal.map((s: unknown, i: number) => (
                        <li key={`sup-${i}`}>{typeof s === 'number' ? formatPrice(s as number) : String(s)}</li>
                      ))}
                    </ul>
                  </div>
                );
              }
              if (supportVal && typeof supportVal === 'object') {
                const entries = Object.entries(supportVal as Record<string, unknown>);
                if (entries.length > 0) {
                  return (
                    <div>
                      <p className="text-xs font-medium text-foreground">Support</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {entries.map(([k, v]) => (
                          <li key={`sup-${k}`}>
                            <span className="text-foreground/80 font-medium">{k}:</span> {typeof v === 'number' ? formatPrice(v) : String(v)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
              }
              return null;
            })()}
            {/* Render Resistance(s) */}
            {(() => {
              const resistanceVal = (obj.resistance ?? obj.resistances ?? (obj.levels as any)?.resistance) as unknown;
              if (Array.isArray(resistanceVal) && resistanceVal.length > 0) {
                return (
                  <div>
                    <p className="text-xs font-medium text-foreground">Resistance</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {resistanceVal.map((r: unknown, i: number) => (
                        <li key={`res-${i}`}>{typeof r === 'number' ? formatPrice(r as number) : String(r)}</li>
                      ))}
                    </ul>
                  </div>
                );
              }
              if (resistanceVal && typeof resistanceVal === 'object') {
                const entries = Object.entries(resistanceVal as Record<string, unknown>);
                if (entries.length > 0) {
                  return (
                    <div>
                      <p className="text-xs font-medium text-foreground">Resistance</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {entries.map(([k, v]) => (
                          <li key={`res-${k}`}>
                            <span className="text-foreground/80 font-medium">{k}:</span> {typeof v === 'number' ? formatPrice(v) : String(v)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
              }
              return null;
            })()}
            {/* If neither side produced output, show a small hint */}
            {(() => {
              const supportVal = (obj.support ?? obj.supports ?? (obj.levels as any)?.support) as unknown;
              const resistanceVal = (obj.resistance ?? obj.resistances ?? (obj.levels as any)?.resistance) as unknown;
              const emptySupport = !supportVal || (Array.isArray(supportVal) && supportVal.length === 0) || (typeof supportVal === 'object' && Object.keys(supportVal as any).length === 0);
              const emptyResistance = !resistanceVal || (Array.isArray(resistanceVal) && resistanceVal.length === 0) || (typeof resistanceVal === 'object' && Object.keys(resistanceVal as any).length === 0);
              if (emptySupport && emptyResistance) {
                return <span className="text-xs text-muted-foreground">No levels</span>;
              }
              return null;
            })()}
          </div>
        );
      }
      // Generic object rendering as key: value list
      return (
        <div className="text-left">
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
            {Object.entries(obj).map(([k, v]) => (
              <li key={k} className="break-words">
                <span className="text-foreground/80 font-medium">{k}:</span>{' '}
                {Array.isArray(v)
                  ? (v as unknown[]).map((x) => (typeof x === 'number' ? formatPrice(x as number) : String(x))).join(', ')
                  : typeof v === 'number'
                  ? formatPrice(v)
                  : String(v)}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return <Badge variant="secondary" className="font-medium">N/A</Badge>;
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
          <h3 className="text-lg font-semibold text-foreground">
            {analysis.call_entry && analysis.put_entry ? 'Options Straddle Levels' : 'Trading Levels'}
          </h3>
        </div>
        
        {/* Options Straddle specific layout */}
        {analysis.call_entry && analysis.put_entry ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-blue-500/5 border border-blue-200/20 hover:bg-blue-500/10 transition-colors">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <p className="text-sm font-medium text-muted-foreground">Call Premium</p>
                </div>
                <p className="text-xl font-bold text-blue-600">{formatPrice(analysis.call_entry)}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-purple-500/5 border border-purple-200/20 hover:bg-purple-500/10 transition-colors">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <p className="text-sm font-medium text-muted-foreground">Put Premium</p>
                </div>
                <p className="text-xl font-bold text-purple-600">{formatPrice(analysis.put_entry)}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-red-500/5 border border-red-200/20 hover:bg-red-500/10 transition-colors">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-3 h-3 text-red-500" />
                  <p className="text-sm font-medium text-muted-foreground">Lower Breakeven</p>
                </div>
                <p className="text-xl font-bold text-red-600">{formatPrice(analysis.breakeven_lower || analysis.stop_loss)}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-emerald-500/5 border border-emerald-200/20 hover:bg-emerald-500/10 transition-colors">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-3 h-3 text-emerald-500" />
                  <p className="text-sm font-medium text-muted-foreground">Upper Breakeven</p>
                </div>
                <p className="text-xl font-bold text-emerald-600">{formatPrice(analysis.breakeven_upper || analysis.take_profit)}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Standard trading levels layout */
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
        )}
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
                  <div className="text-right max-w-[420px]">
                    {renderTechValue(value)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* AI Analysis & Recommendation */}
      <Card className="p-6 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-border/20 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">AI Analysis & Recommendation</h3>
        </div>
        
        <div className="space-y-6">
          {/* Market Context */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Market Context
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The current market shows {analysis.signal === 'BUY' ? 'bullish' : analysis.signal === 'SELL' ? 'bearish' : 'neutral'} tendencies with {confidencePercentage >= 70 ? 'strong' : confidencePercentage >= 40 ? 'moderate' : 'weak'} confirmation across multiple timeframes. 
              {analysis.technical_analysis?.trend_strength && `The trend strength is currently ${String(analysis.technical_analysis.trend_strength)}.`}
            </p>
          </div>

          {/* Key Technical Factors */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Key Technical Factors
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {typeof analysis.technical_analysis?.rsi === 'number' && (
                <li>RSI at {analysis.technical_analysis.rsi} - {analysis.technical_analysis.rsi > 70 ? 'Overbought' : analysis.technical_analysis.rsi < 30 ? 'Oversold' : 'Neutral'} conditions</li>
              )}
              {typeof analysis.technical_analysis?.macd === 'number' && (
                <li>MACD shows {analysis.technical_analysis.macd > 0 ? 'bullish' : 'bearish'} momentum</li>
              )}
              {analysis.technical_analysis?.moving_averages && (
                <li>Moving Averages: {String(analysis.technical_analysis.moving_averages)}</li>
              )}
              <li>Risk/Reward Ratio: {analysis.risk_reward_ratio} (favorable above 1.5)</li>
              {analysis.technical_analysis?.volume && (
                <li>Volume analysis: {String(analysis.technical_analysis.volume)}</li>
              )}
            </ul>
          </div>

          {/* Trading Plan */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Trading Plan
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-muted/20 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Entry Strategy</p>
                <p className="text-sm text-muted-foreground">
                  {analysis.call_entry && analysis.put_entry ? (
                    `Execute straddle by buying both call (${formatPrice(analysis.call_entry)}) and put (${formatPrice(analysis.put_entry)}) options simultaneously. Profit from significant price movement in either direction.`
                  ) : analysis.signal === 'BUY' || analysis.signal === 'STRADDLE_BUY' ? 
                    'Consider entering long positions near support at ' + formatPrice(analysis.entry) + ' with confirmation from candlestick patterns.'
                    : analysis.signal === 'SELL' || analysis.signal === 'STRADDLE_SELL'
                    ? 'Consider entering short positions near resistance at ' + formatPrice(analysis.entry) + ' with confirmation from bearish reversal patterns.'
                    : 'Wait for clearer market direction. Consider range-bound strategies between ' + formatPrice(analysis.stop_loss) + ' and ' + formatPrice(analysis.take_profit) + '.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <p className="text-sm font-medium text-red-500 mb-1">
                    {analysis.call_entry && analysis.put_entry ? 'Lower Breakeven' : 'Stop Loss'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {analysis.call_entry && analysis.put_entry ? 
                      `Price must fall below ${formatPrice(analysis.breakeven_lower || analysis.stop_loss)} for the straddle to be profitable on the downside.` :
                      `Set stop loss at ${formatPrice(analysis.stop_loss)} to limit potential losses if the market moves against the position.`}
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                  <p className="text-sm font-medium text-emerald-500 mb-1">
                    {analysis.call_entry && analysis.put_entry ? 'Upper Breakeven' : 'Take Profit'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {analysis.call_entry && analysis.put_entry ? 
                      `Price must rise above ${formatPrice(analysis.breakeven_upper || analysis.take_profit)} for the straddle to be profitable on the upside.` :
                      `Target ${formatPrice(analysis.take_profit)} for a ${analysis.risk_reward_ratio} risk/reward ratio. Consider taking partial profits at key levels.`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Management */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Risk Management
            </h4>
            <div className="text-sm text-muted-foreground space-y-2">
              {analysis.call_entry && analysis.put_entry ? (
                <>
                  <p>• Maximum loss is limited to total premium paid: {formatPrice((analysis.call_entry || 0) + (analysis.put_entry || 0))}</p>
                  <p>• Monitor time decay (theta) - position loses value daily as expiration approaches</p>
                  <p>• Consider closing position if volatility decreases significantly</p>
                  <p>• Watch for upcoming events that could trigger large price movements</p>
                </>
              ) : (
                <>
                  <p>• Risk only 1-2% of your trading capital on this trade</p>
                  <p>• Position size: Calculate based on your stop loss distance and risk tolerance</p>
                  <p>• Consider scaling in/out of positions to manage risk</p>
                  <p>• Be aware of upcoming economic events that may impact the market</p>
                </>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          {analysis.recommendation && (
            <div className="p-4 bg-muted/10 border border-muted/30 rounded-lg">
              <h4 className="font-medium text-foreground text-sm mb-2">Additional Notes</h4>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                {analysis.recommendation}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
