import { useState } from "react";
import { TradingLayout } from "@/components/layout/TradingLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrendingDown, Clock, AlertTriangle, X, Edit3, Copy } from "lucide-react";
import { useActiveTrades } from "@/context/ActiveTradesContext";
import { useToast } from "@/components/ui/use-toast";

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

  // Close all positions with a toast
  const handleCloseAll = () => {
    if (!trades.length) {
      toast({ title: "No positions to close" });
      return;
    }
    trades.forEach(t => removeTrade(t.id));
    toast({ title: "All positions closed" });
  };

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
              {trades.map((trade) => (
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
                              <p className="text-lg font-bold text-foreground">{trade.currentPrice || '-'}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{trade.duration || '-'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Risk Management */}
                        <div className="lg:col-span-2">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Stop Loss</p>
                              <p className="text-sm font-medium text-trading-loss">{trade.stopLoss || '-'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Take Profit</p>
                              <p className="text-sm font-medium text-trading-profit">{trade.takeProfit || '-'}</p>
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
                                <Edit3 className="h-3 w-3 mr-1" />
                                Modify
                              </Button>
                              <Button size="sm" variant="outline" className="w-full">
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
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

                      {/* AI Notes removed per requirement */}
                    </Card>
                  ))}
                </div>
            </div>
          </Card>

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
                onClick={() => {
                  if (closeTargetId) {
                    removeTrade(closeTargetId);
                    toast({ title: "Position closed" });
                  }
                  setShowCloseDialog(false);
                  setCloseTargetId(null);
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

        
      </div>
    </TradingLayout>
  );
}