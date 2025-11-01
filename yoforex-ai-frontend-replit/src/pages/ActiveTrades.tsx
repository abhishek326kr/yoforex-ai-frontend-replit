import { useState, useMemo, useCallback, useEffect } from "react";
import { TradingLayout } from "@/components/layout/TradingLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCardSkeleton, TradeCardSkeleton } from "@/components/ui/loading-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  X, 
  Edit3, 
  Copy, 
  Filter, 
  Search,
  DollarSign,
  Activity,
  Target,
  ShieldAlert
} from "lucide-react";
import { useActiveTrades } from "@/context/ActiveTradesContext";
import { useToast } from "@/components/ui/use-toast";
import { showApiError } from '@/lib/ui/errorToast';
import { closeTrade as closeTradeApi } from "@/lib/api/trades";
import { navigate } from "wouter/use-browser-location";

type FilterState = {
  search: string;
  direction: 'all' | 'BUY' | 'SELL';
  profitable: 'all' | 'profit' | 'loss';
  strategy: string;
  sort: 'newest' | 'oldest' | 'highest_pl' | 'lowest_pl';
};

export function ActiveTrades() {
  const { trades, updateTrade, removeTrade } = useActiveTrades();
  const { toast } = useToast();
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [closeTargetId, setCloseTargetId] = useState<string | null>(null);
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [modifyId, setModifyId] = useState<string | null>(null);
  const [formDirection, setFormDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [formLot, setFormLot] = useState('0.10');
  const [formEntry, setFormEntry] = useState('');
  const [formSL, setFormSL] = useState('');
  const [formTP, setFormTP] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formRisk, setFormRisk] = useState<'Low' | 'Medium' | 'High'>('Medium');

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    direction: 'all',
    profitable: 'all',
    strategy: 'all',
    sort: 'newest'
  });

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const selectedTradeData = trades.find(trade => trade.id === selectedTrade) as any;
  const closeTargetTrade = trades.find(t => t.id === closeTargetId) as any;

  const parsePL = useCallback((plString: string | undefined): number => {
    if (!plString) return 0;
    const cleaned = plString.replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
  }, []);

  const quickStats = useMemo(() => {
    const totalTrades = trades.length;
    const totalPL = trades.reduce((sum, trade) => sum + parsePL((trade as any).unrealizedPL), 0);
    const winCount = trades.filter(trade => (trade as any).profitable).length;
    const lossCount = totalTrades - winCount;
    const totalRisk = trades.length;

    return { totalTrades, totalPL, winCount, lossCount, totalRisk };
  }, [trades, parsePL]);

  const uniqueStrategies = useMemo(() => {
    const strategies = new Set(trades.map(t => (t as any).strategy).filter(Boolean));
    return Array.from(strategies);
  }, [trades]);

  const filteredAndSortedTrades = useMemo(() => {
    let filtered = trades.filter(trade => {
      const t = trade as any;
      if (filters.search && !t.pair?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.direction !== 'all' && t.direction !== filters.direction) {
        return false;
      }
      if (filters.profitable === 'profit' && !t.profitable) {
        return false;
      }
      if (filters.profitable === 'loss' && t.profitable) {
        return false;
      }
      if (filters.strategy !== 'all' && t.strategy !== filters.strategy) {
        return false;
      }
      return true;
    });

    filtered = [...filtered].sort((a, b) => {
      const aData = a as any;
      const bData = b as any;
      switch (filters.sort) {
        case 'newest':
          return 0;
        case 'oldest':
          return 0;
        case 'highest_pl':
          return parsePL(bData.unrealizedPL) - parsePL(aData.unrealizedPL);
        case 'lowest_pl':
          return parsePL(aData.unrealizedPL) - parsePL(bData.unrealizedPL);
        default:
          return 0;
      }
    });

    return filtered;
  }, [trades, filters, parsePL]);

  const handleCloseAll = async () => {
    if (!trades.length) {
      toast({ title: "No positions to close" });
      return;
    }
    try {
      const numericIds = trades
        .map(t => (t as any).serverTradeId != null ? Number((t as any).serverTradeId) : Number(t.id))
        .filter((n: number) => !Number.isNaN(n) && Number.isFinite(n));

      if (numericIds.length) {
        const results = await Promise.allSettled(
          numericIds.map(id => closeTradeApi(id, { result: 'manual_close', hit_reason: 'manual' }))
        );
        const failed = results.filter(r => r.status === 'rejected').length;
        const succeeded = results.length - failed;
        trades.forEach(t => removeTrade(t.id));
        toast({ title: `Closed ${succeeded}/${results.length} server trades`, description: failed ? `${failed} failed on server; removed locally.` : undefined });
      } else {
        trades.forEach(t => removeTrade(t.id));
        toast({ title: "All positions closed locally" });
      }
    } catch (e: any) {
      trades.forEach(t => removeTrade(t.id));
      showApiError(e, { title: 'Closed positions (local)', defaultMessage: 'Some errors occurred while closing on server.' });
    }
  };

  if (initialLoading) {
    return (
      <TradingLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Active Positions</h1>
              <p className="text-muted-foreground mt-1">Manage your open trades in real-time</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>

          <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30">
            <CardHeader>
              <CardTitle>Loading positions...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <TradeCardSkeleton key={i} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TradingLayout>
    );
  }

  return (
    <TradingLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Active Positions</h1>
            <p className="text-muted-foreground mt-1">Manage your open trades in real-time</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 mt-4 sm:mt-0" 
            onClick={handleCloseAll}
            disabled={trades.length === 0}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Close All Positions
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Active Trades</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quickStats.totalTrades}</div>
              <p className="text-xs text-muted-foreground mt-1">Open positions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total P&L</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${quickStats.totalPL >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
                {quickStats.totalPL >= 0 ? '+' : ''}${quickStats.totalPL.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Unrealized profit/loss</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Win/Loss Ratio</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className="text-trading-profit">{quickStats.winCount}</span>
                <span className="text-muted-foreground mx-1">/</span>
                <span className="text-trading-loss">{quickStats.lossCount}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Profitable vs losing</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Risk Exposure</CardTitle>
              <ShieldAlert className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quickStats.totalRisk}</div>
              <p className="text-xs text-muted-foreground mt-1">Active positions</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by pair..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-9"
                />
              </div>

              <Select value={filters.direction} onValueChange={(val) => setFilters(prev => ({ ...prev, direction: val as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Directions</SelectItem>
                  <SelectItem value="BUY">BUY</SelectItem>
                  <SelectItem value="SELL">SELL</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.profitable} onValueChange={(val) => setFilters(prev => ({ ...prev, profitable: val as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Profitability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trades</SelectItem>
                  <SelectItem value="profit">Profitable</SelectItem>
                  <SelectItem value="loss">Loss</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.strategy} onValueChange={(val) => setFilters(prev => ({ ...prev, strategy: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Strategies</SelectItem>
                  {uniqueStrategies.map(strategy => (
                    <SelectItem key={strategy} value={strategy}>{strategy}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.sort} onValueChange={(val) => setFilters(prev => ({ ...prev, sort: val as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest_pl">Highest P&L</SelectItem>
                  <SelectItem value="lowest_pl">Lowest P&L</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30">
          <CardHeader>
            <CardTitle>All Positions ({filteredAndSortedTrades.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAndSortedTrades.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-6">
                    <TrendingUp className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">
                    {trades.length === 0 ? 'No Active Positions' : 'No Matching Positions'}
                  </h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">
                    {trades.length === 0 
                      ? 'Start trading to see your positions here. Use AI-powered analysis to make informed trading decisions.'
                      : 'Try adjusting your filters to see more positions.'}
                  </p>
                  {trades.length === 0 ? (
                    <Button 
                      className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                      onClick={() => navigate('/trading')}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Start Trading
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={() => setFilters({ search: '', direction: 'all', profitable: 'all', strategy: 'all', sort: 'newest' })}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                filteredAndSortedTrades.map((trade) => {
                  const t = trade as any;
                  const isProfitable = t.profitable;
                  return (
                    <Card 
                      key={trade.id} 
                      className="p-6 bg-gradient-to-br from-card to-card/50 border border-border/30 hover:border-border/50 transition-all cursor-pointer hover:shadow-lg"
                      onClick={() => setSelectedTrade(trade.id)}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-3">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Badge 
                                variant={trade.direction === 'BUY' ? 'default' : 'destructive'}
                                className={trade.direction === 'BUY' ? 'signal-buy' : 'signal-sell'}
                              >
                                {trade.direction}
                              </Badge>
                              <span className="text-lg font-bold text-foreground">{trade.pair}</span>
                              {isProfitable ? (
                                <TrendingUp className="h-4 w-4 text-trading-profit" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-trading-loss" />
                              )}
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Lot Size:</span>
                              <span className="font-medium text-foreground">{t.lotSize || '0.10'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Strategy:</span>
                              <span className="font-medium text-foreground">{t.strategy || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">AI Model:</span>
                              <span className="font-medium text-foreground">{t.aiModel || '-'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-3">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Entry Price</p>
                              <p className="text-lg font-bold text-foreground">{t.entryPrice}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                              <p className="text-lg font-bold text-foreground">{t.currentPrice || '-'}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{t.duration || '-'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-2">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Stop Loss</p>
                              <p className="text-sm font-medium text-trading-loss">{t.stopLoss || '-'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Take Profit</p>
                              <p className="text-sm font-medium text-trading-profit">{t.takeProfit || '-'}</p>
                            </div>
                            <Badge 
                              variant={t.risk === 'Low' ? 'secondary' : t.risk === 'Medium' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {t.risk} Risk
                            </Badge>
                          </div>
                        </div>

                        <div className="lg:col-span-4">
                          <div className="flex items-center justify-between h-full">
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground mb-1">Unrealized P&L</p>
                              <p className={`text-2xl font-bold ${
                                isProfitable ? 'text-trading-profit' : 'text-trading-loss'
                              }`}>
                                {t.unrealizedPL || '-'}
                              </p>
                              <div className="flex items-center justify-center space-x-1 mt-1">
                                <div className={`h-2 w-2 rounded-full ${isProfitable ? 'bg-trading-profit' : 'bg-trading-loss'}`} />
                                <span className="text-xs text-muted-foreground">{(t.confidence ?? 0)}% confidence</span>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full hover:bg-primary/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModifyId(trade.id);
                                  setFormDirection(t.direction);
                                  setFormLot(t.lotSize || '0.10');
                                  setFormEntry(t.entryPrice || '');
                                  setFormSL(t.stopLoss || '');
                                  setFormTP(t.takeProfit || '');
                                  setFormNotes(t.notes || '');
                                  setFormRisk((t.risk as any) || 'Medium');
                                  setShowModifyDialog(true);
                                }}
                              >
                                <Edit3 className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="w-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCloseTargetId(trade.id);
                                  setShowCloseDialog(true);
                                }}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Close
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={!!selectedTrade} onOpenChange={(open) => !open && setSelectedTrade(null)}>
          <DialogContent className="sm:max-w-2xl">
            {selectedTradeData && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle>Trade Details - {selectedTradeData.pair}</DialogTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSelectedTrade(null)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <DialogDescription>
                    {selectedTradeData.strategy} • {selectedTradeData.id}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Direction</p>
                      <p className="font-medium">{selectedTradeData.direction}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Entry Price</p>
                      <p className="font-medium">{selectedTradeData.entryPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Price</p>
                      <p className="font-medium">{selectedTradeData.currentPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unrealized P&L</p>
                      <p className={`font-medium ${selectedTradeData.profitable ? 'text-green-500' : 'text-destructive'}`}>
                        {selectedTradeData.unrealizedPL}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stop Loss</p>
                      <p className="font-medium">{selectedTradeData.stopLoss}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Take Profit</p>
                      <p className="font-medium">{selectedTradeData.takeProfit}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="text-sm">{selectedTradeData.notes}</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSelectedTrade(null)}>
                    Close
                  </Button>
                  <Button variant="destructive" onClick={() => {
                    if (selectedTradeData?.id) setCloseTargetId(selectedTradeData.id);
                    setShowCloseDialog(true);
                    setSelectedTrade(null);
                  }}>
                    Close Position
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showCloseDialog} onOpenChange={(open) => {
          setShowCloseDialog(open);
          if (!open) setCloseTargetId(null);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Close Position</DialogTitle>
              <DialogDescription>
                {closeTargetTrade
                  ? `Are you sure you want to close this ${closeTargetTrade.pair} position? Current unrealized P&L: ${closeTargetTrade.unrealizedPL || '-'}`
                  : 'Are you sure you want to close this position?'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={async () => {
                  try {
                    if (closeTargetId) {
                      const target = trades.find(t => t.id === closeTargetId) as any;
                      const candidateId: number | undefined = (target?.serverTradeId != null)
                        ? Number(target.serverTradeId)
                        : Number(closeTargetId);
                      if (candidateId && !Number.isNaN(candidateId) && Number.isFinite(candidateId)) {
                        await closeTradeApi(candidateId, { result: 'manual_close', hit_reason: 'manual' });
                      }
                      removeTrade(closeTargetId);
                      toast({ title: "Position closed" });
                    }
                  } catch (err: any) {
                    showApiError(err, { title: 'Failed to close position', defaultMessage: 'Failed to close position. Please try again.' });
                  } finally {
                    setShowCloseDialog(false);
                    setCloseTargetId(null);
                  }
                }}
              >
                Yes, close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
                
        <Dialog open={showModifyDialog} onOpenChange={(open) => {
          setShowModifyDialog(open);
          if (!open) setModifyId(null);
        }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Modify Position</DialogTitle>
              <DialogDescription>Update the key fields of this trade.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Direction</p>
                <Select value={formDirection} onValueChange={(v) => setFormDirection(v as 'BUY' | 'SELL')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUY">BUY</SelectItem>
                    <SelectItem value="SELL">SELL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Lot Size</p>
                <Input value={formLot} onChange={(e) => setFormLot(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Entry</p>
                <Input value={formEntry} onChange={(e) => setFormEntry(e.target.value)} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Stop Loss</p>
                <Input value={formSL} onChange={(e) => setFormSL(e.target.value)} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Take Profit</p>
                <Input value={formTP} onChange={(e) => setFormTP(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Risk</p>
                <Select value={formRisk} onValueChange={(v) => setFormRisk(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <Input value={formNotes} onChange={(e) => setFormNotes(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowModifyDialog(false)}>Cancel</Button>
              <Button onClick={() => {
                if (!modifyId) return;
                updateTrade(modifyId, {
                  direction: formDirection,
                  lotSize: formLot,
                  entryPrice: formEntry,
                  stopLoss: formSL || undefined,
                  takeProfit: formTP || undefined,
                  risk: formRisk,
                  notes: formNotes || undefined,
                });
                setShowModifyDialog(false);
                setModifyId(null);
              }}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TradingLayout>
  );
}
