import { useState } from "react";
import { TradingLayout } from "@/components/layout/TradingLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
<<<<<<< HEAD
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
=======
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
<<<<<<< HEAD
} from "@/components/ui/dialog";
import { TrendingDown, Clock, AlertTriangle, X, Edit3, Copy } from "lucide-react";
import { useActiveTrades } from "@/context/ActiveTradesContext";
import { useToast } from "@/components/ui/use-toast";
import { showApiError } from '@/lib/ui/errorToast';
import { closeTrade as closeTradeApi } from "@/lib/api/trades";

export function ActiveTrades() {
  const { trades, updateTrade, removeTrade } = useActiveTrades();
  const { toast } = useToast();
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [closeTargetId, setCloseTargetId] = useState<string | null>(null);
  // Modify dialog state
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [modifyId, setModifyId] = useState<string | null>(null);
  const [formDirection, setFormDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [formLot, setFormLot] = useState('0.10');
  const [formEntry, setFormEntry] = useState('');
  const [formSL, setFormSL] = useState('');
  const [formTP, setFormTP] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formRisk, setFormRisk] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Find the selected trade data
  const selectedTradeData = trades.find(trade => trade.id === selectedTrade) as any;
  const closeTargetTrade = trades.find(t => t.id === closeTargetId) as any;

  // Close all positions: attempt backend close for numeric IDs, then clear locally
  const handleCloseAll = async () => {
    if (!trades.length) {
      toast({ title: "No positions to close" });
      return;
    }
    try {
      // Prefer serverTradeId when present; otherwise, try numeric parse of local id
      const numericIds = trades
        .map(t => (t as any).serverTradeId != null ? Number((t as any).serverTradeId) : Number(t.id))
        .filter((n: number) => !Number.isNaN(n) && Number.isFinite(n));

      if (numericIds.length) {
        const results = await Promise.allSettled(
          numericIds.map(id => closeTradeApi(id, { result: 'manual_close', hit_reason: 'manual' }))
        );
        const failed = results.filter(r => r.status === 'rejected').length;
        const succeeded = results.length - failed;
        // Remove all locally regardless of backend outcome to reflect closure in UI
        trades.forEach(t => removeTrade(t.id));
        toast({ title: `Closed ${succeeded}/${results.length} server trades`, description: failed ? `${failed} failed on server; removed locally.` : undefined });
      } else {
        // No numeric IDs; just clear locally
        trades.forEach(t => removeTrade(t.id));
        toast({ title: "All positions closed locally" });
      }
    } catch (e: any) {
      // Even if something unexpected happened, clear locally so the user isn't blocked
      trades.forEach(t => removeTrade(t.id));
      showApiError(e, { title: 'Closed positions (local)', defaultMessage: 'Some errors occurred while closing on server.' });
    }
  };
=======
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Target,
  Shield,
  AlertTriangle,
  Settings,
  X,
  Edit3,
  Copy,
  BarChart3
} from "lucide-react";

const activeTrades = [
  {
    id: "POS-001",
    pair: "EUR/USD",
    direction: "BUY",
    entryPrice: "1.0820",
    currentPrice: "1.0847",
    lotSize: "0.1",
    unrealizedPL: "+$27.00",
    profitable: true,
    openTime: "2024-01-15 09:30:00",
    duration: "4h 23m",
    stopLoss: "1.0800",
    takeProfit: "1.0870",
    aiModel: "GPT-4.1",
    confidence: 89,
    strategy: "Breakout Strategy",
    risk: "Low",
    notes: "Strong bullish momentum with RSI divergence"
  },
  {
    id: "POS-002",
    pair: "GBP/JPY",
    direction: "SELL",
    entryPrice: "189.45",
    currentPrice: "188.95",
    lotSize: "0.05",
    unrealizedPL: "+$25.00",
    profitable: true,
    openTime: "2024-01-15 11:20:00",
    duration: "2h 33m",
    stopLoss: "190.20",
    takeProfit: "188.20",
    aiModel: "Claude 4 Sonnet",
    confidence: 82,
    strategy: "SMC Strategy",
    risk: "Medium",
    notes: "Bearish engulfing pattern at key resistance"
  },
  {
    id: "POS-003",
    pair: "USD/JPY",
    direction: "BUY",
    entryPrice: "149.82",
    currentPrice: "149.65",
    lotSize: "0.1",
    unrealizedPL: "-$17.00",
    profitable: false,
    openTime: "2024-01-15 12:15:00",
    duration: "1h 38m",
    stopLoss: "149.30",
    takeProfit: "150.20",
    aiModel: "Gemini 2.5 Pro",
    confidence: 76,
    strategy: "Trend Following",
    risk: "Medium",
    notes: "Waiting for breakout confirmation"
  }
];

const portfolioSummary = [
  { title: "Open Positions", value: "7", icon: Activity },
  { title: "Unrealized P&L", value: "+$147.50", icon: TrendingUp },
  { title: "Used Margin", value: "$2,840", icon: Shield },
  { title: "Free Margin", value: "$7,160", icon: DollarSign }
];

export function ActiveTrades() {
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  // Find the selected trade data
  const selectedTradeData = activeTrades.find(trade => trade.id === selectedTrade);
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2

  return (
    <TradingLayout>
      <div className="space-y-6">
        {/* Trade Details Dialog */}
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
<<<<<<< HEAD
                    if (selectedTradeData?.id) setCloseTargetId(selectedTradeData.id);
=======
                    // Handle close position
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
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

<<<<<<< HEAD
        {/* Header - only Close All Positions */}
        <div className="flex justify-end">
          <Button className="btn-trading-primary" onClick={handleCloseAll}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Close All Positions
          </Button>
        </div>

        {/* All Positions */}
        <Card className="trading-card">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">All Positions</h2>
            <div className="space-y-4">
              {trades.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No active positions
                </div>
              ) : (
              trades.map((trade) => (
                <Card 
                  key={trade.id} 
                  className="p-6 bg-gradient-dark border border-border/20 hover:border-border/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedTrade(trade.id)}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Position Info */}
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
                          {!trade.profitable && (
                            <TrendingDown className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {trade.id}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lot Size:</span>
                          <span className="font-medium text-foreground">{trade.lotSize || '0.10'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Strategy:</span>
                          <span className="font-medium text-foreground">{trade.strategy || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">AI Model:</span>
                          <span className="font-medium text-foreground">{trade.aiModel || '-'}</span>
=======
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold heading-trading">Active Trades</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage your live trading positions
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Badge variant="secondary" className="bg-gradient-profit text-white">
              <div className="h-2 w-2 rounded-full bg-white mr-2 animate-pulse" />
              7 Active Positions
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Portfolio Settings
            </Button>
            <Button className="btn-trading-primary">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Close All Positions
            </Button>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioSummary.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className={`trading-card-hover p-6 fade-in-up`} style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Active Trades Table */}
        <Card className="trading-card">
          <div className="p-6">
            <Tabs defaultValue="all" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Positions</TabsTrigger>
                  <TabsTrigger value="profitable">Profitable</TabsTrigger>
                  <TabsTrigger value="losing">Losing</TabsTrigger>
                  <TabsTrigger value="automated">AI Automated</TabsTrigger>
                </TabsList>
                <div className="flex items-center space-x-2">
                  <Input placeholder="Search positions..." className="w-64" />
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Risk Analysis
                  </Button>
                </div>
              </div>

              <TabsContent value="all">
                <div className="space-y-4">
                  {activeTrades.map((trade) => (
                    <Card 
                      key={trade.id} 
                      className="p-6 bg-gradient-dark border border-border/20 hover:border-border/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedTrade(trade.id)}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Position Info */}
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
                              {!trade.profitable && (
                                <TrendingDown className="h-4 w-4 text-destructive" />
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {trade.id}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Lot Size:</span>
                              <span className="font-medium text-foreground">{trade.lotSize}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Strategy:</span>
                              <span className="font-medium text-foreground">{trade.strategy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">AI Model:</span>
                              <span className="font-medium text-foreground">{trade.aiModel}</span>
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
                            </div>
                          </div>
                        </div>

                        {/* Price Info */}
                        <div className="lg:col-span-3">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Entry Price</p>
                              <p className="text-lg font-bold text-foreground">{trade.entryPrice}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Current Price</p>
<<<<<<< HEAD
                              <p className="text-lg font-bold text-foreground">{trade.currentPrice || '-'}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{trade.duration || '-'}</span>
=======
                              <p className="text-lg font-bold text-foreground">{trade.currentPrice}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{trade.duration}</span>
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
                            </div>
                          </div>
                        </div>

                        {/* Risk Management */}
                        <div className="lg:col-span-2">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Stop Loss</p>
<<<<<<< HEAD
                              <p className="text-sm font-medium text-trading-loss">{trade.stopLoss || '-'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Take Profit</p>
                              <p className="text-sm font-medium text-trading-profit">{trade.takeProfit || '-'}</p>
=======
                              <p className="text-sm font-medium text-trading-loss">{trade.stopLoss}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Take Profit</p>
                              <p className="text-sm font-medium text-trading-profit">{trade.takeProfit}</p>
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
                            </div>
                            <Badge 
                              variant={trade.risk === 'Low' ? 'secondary' : trade.risk === 'Medium' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {trade.risk} Risk
                            </Badge>
                          </div>
                        </div>

                        {/* P&L and Actions */}
                        <div className="lg:col-span-4">
                          <div className="flex items-center justify-between h-full">
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground mb-1">Unrealized P&L</p>
                              <p className={`text-2xl font-bold ${
                                trade.profitable ? 'text-profit' : 'text-loss'
                              }`}>
<<<<<<< HEAD
                                {trade.unrealizedPL || '-'}
                              </p>
                              <div className="flex items-center justify-center space-x-1 mt-1">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-xs text-muted-foreground">{(trade.confidence ?? 0)}% confidence</span>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // open modify with this trade
                                  setModifyId(trade.id);
                                  setFormDirection(trade.direction);
                                  setFormLot(trade.lotSize || '0.10');
                                  setFormEntry(trade.entryPrice || '');
                                  setFormSL(trade.stopLoss || '');
                                  setFormTP(trade.takeProfit || '');
                                  setFormNotes(trade.notes || '');
                                  setFormRisk((trade.risk as any) || 'Medium');
                                  setShowModifyDialog(true);
                                }}
                              >
=======
                                {trade.unrealizedPL}
                              </p>
                              <div className="flex items-center justify-center space-x-1 mt-1">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-xs text-muted-foreground">{trade.confidence}% confidence</span>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Button size="sm" variant="outline" className="w-full">
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
                                <Edit3 className="h-3 w-3 mr-1" />
                                Modify
                              </Button>
                              <Button size="sm" variant="outline" className="w-full">
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
<<<<<<< HEAD
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
=======
                              <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="destructive" 
                                    className="w-full"
                                    onClick={() => setSelectedTrade(trade.id)}
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Close
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Close Position</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to close this {trade.pair} position? 
                                      Current unrealized P&L: {trade.unrealizedPL}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="flex justify-end space-x-2 mt-4">
                                    <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
                                      Cancel
                                    </Button>
                                    <Button 
                                      variant="destructive"
                                      onClick={() => {
                                        // Handle close position
                                        setShowCloseDialog(false);
                                        setSelectedTrade(null);
                                      }}
                                    >
                                      Close Position
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
                            </div>
                          </div>
                        </div>
                      </div>

<<<<<<< HEAD
                      {/* AI Notes removed per requirement */}
                    </Card>
                  ))
              )}
=======
                      {/* AI Notes */}
                      {trade.notes && (
                        <div className="mt-4 pt-4 border-t border-border/20">
                          <p className="text-xs text-muted-foreground mb-1">AI Analysis:</p>
                          <p className="text-sm text-foreground/80">{trade.notes}</p>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>

        {/* Risk Management Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="trading-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Portfolio Risk</h3>
                <p className="text-sm text-muted-foreground">Overall exposure and risk metrics</p>
              </div>
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <Badge className="bg-gradient-secondary">Moderate</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Max Drawdown</span>
                <span className="text-sm font-medium text-foreground">-2.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Margin Usage</span>
                <span className="text-sm font-medium text-foreground">28.4%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '28.4%' }} />
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
              </div>
            </div>
          </Card>

<<<<<<< HEAD
        {/* Close Position Confirm Dialog - Top Level */}
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
                      // Prefer serverTradeId when available, else try to parse numeric id
                      const target = trades.find(t => t.id === closeTargetId) as any;
                      const candidateId: number | undefined = (target?.serverTradeId != null)
                        ? Number(target.serverTradeId)
                        : Number(closeTargetId);
                      if (candidateId && !Number.isNaN(candidateId) && Number.isFinite(candidateId)) {
                        await closeTradeApi(candidateId, { result: 'manual_close', hit_reason: 'manual' });
                      }
                      // Remove from local state regardless (to reflect closure)
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
                
        {/* Modify Position Dialog */}
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

        
=======
          <Card className="trading-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Position Distribution</h3>
                <p className="text-sm text-muted-foreground">Currency pair allocation</p>
              </div>
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-3">
              {[
                { pair: "EUR/USD", percentage: 35, amount: "$1,250" },
                { pair: "GBP/JPY", percentage: 25, amount: "$900" },
                { pair: "USD/JPY", percentage: 20, amount: "$720" },
                { pair: "Others", percentage: 20, amount: "$630" }
              ].map((item) => (
                <div key={item.pair} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-foreground w-16">{item.pair}</span>
                    <div className="flex-1 bg-muted/30 rounded-full h-2 w-24">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-foreground">{item.percentage}%</span>
                    <p className="text-xs text-muted-foreground">{item.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
      </div>
    </TradingLayout>
  );
}