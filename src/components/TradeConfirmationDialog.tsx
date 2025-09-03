import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useActiveTrades } from '@/context/ActiveTradesContext';

export type TradeDefaults = {
  pair: string;
  timeframe?: string;
  strategy?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaults: TradeDefaults;
};

export const TradeConfirmationDialog: React.FC<Props> = ({ open, onOpenChange, defaults }) => {
  const { addTrade } = useActiveTrades();
  const [direction, setDirection] = useState<'BUY' | 'SELL' | ''>('');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [lotSize, setLotSize] = useState('0.10');
  const [notes, setNotes] = useState('');

  const canConfirm = useMemo(() => direction !== '' && entryPrice.trim().length > 0, [direction, entryPrice]);

  const handleConfirm = () => {
    if (!canConfirm) return;
    const now = new Date().toISOString();
    addTrade({
      pair: defaults.pair,
      direction: direction as 'BUY' | 'SELL',
      entryPrice,
      lotSize,
      openTime: now,
      stopLoss: stopLoss || undefined,
      takeProfit: takeProfit || undefined,
      strategy: defaults.strategy || undefined,
      timeframe: defaults.timeframe || undefined,
      notes: notes || undefined,
    });
    onOpenChange(false);
    // reset form for next time
    setDirection('');
    setEntryPrice('');
    setStopLoss('');
    setTakeProfit('');
    setLotSize('0.10');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Did you take this trade?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Pair</p>
              <Input value={defaults.pair} disabled />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Timeframe</p>
              <Input value={defaults.timeframe || ''} disabled />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Strategy</p>
            <Input value={defaults.strategy || ''} disabled />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Direction</p>
              <Select value={direction} onValueChange={(v) => setDirection(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">BUY</SelectItem>
                  <SelectItem value="SELL">SELL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Lot Size</p>
              <Input value={lotSize} onChange={(e) => setLotSize(e.target.value)} placeholder="0.10" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Entry</p>
              <Input value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} placeholder="e.g. 1.0847" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Stop Loss</p>
              <Input value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} placeholder="optional" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Take Profit</p>
              <Input value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} placeholder="optional" />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Notes</p>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="optional" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={!canConfirm} className="bg-gradient-primary">
              Yes, add to Active Trades
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
