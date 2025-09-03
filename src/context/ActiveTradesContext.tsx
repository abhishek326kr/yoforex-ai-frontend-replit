import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type ActiveTrade = {
  id: string;
  pair: string;
  direction: 'BUY' | 'SELL';
  entryPrice: string;
  currentPrice?: string;
  lotSize?: string;
  unrealizedPL?: string;
  profitable?: boolean;
  openTime: string; // ISO
  duration?: string;
  stopLoss?: string;
  takeProfit?: string;
  aiModel?: string;
  confidence?: number;
  strategy?: string;
  risk?: 'Low' | 'Medium' | 'High';
  notes?: string;
  timeframe?: string;
};

const STORAGE_KEY = 'active_trades_v1';

type Ctx = {
  trades: ActiveTrade[];
  addTrade: (t: Omit<ActiveTrade, 'id' | 'unrealizedPL' | 'profitable' | 'duration' | 'currentPrice'> & { id?: string }) => void;
  updateTrade: (id: string, patch: Partial<ActiveTrade>) => void;
  removeTrade: (id: string) => void;
  clear: () => void;
};

const ActiveTradesContext = createContext<Ctx | null>(null);

export const ActiveTradesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trades, setTrades] = useState<ActiveTrade[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTrades(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
    } catch {}
  }, [trades]);

  const addTrade = useCallback<Ctx['addTrade']>((t) => {
    const id = t.id || `POS-${Date.now()}`;
    setTrades((prev) => [
      {
        id,
        pair: t.pair,
        direction: t.direction,
        entryPrice: t.entryPrice,
        lotSize: t.lotSize ?? '0.10',
        openTime: t.openTime,
        stopLoss: t.stopLoss,
        takeProfit: t.takeProfit,
        aiModel: t.aiModel,
        confidence: t.confidence,
        strategy: t.strategy,
        risk: t.risk ?? 'Medium',
        notes: t.notes,
        timeframe: t.timeframe,
      },
      ...prev,
    ]);
  }, []);

  const removeTrade = useCallback<Ctx['removeTrade']>((id) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTrade = useCallback<Ctx['updateTrade']>((id, patch) => {
    setTrades((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const clear = useCallback(() => setTrades([]), []);

  const value = useMemo(() => ({ trades, addTrade, updateTrade, removeTrade, clear }), [trades, addTrade, updateTrade, removeTrade, clear]);

  return <ActiveTradesContext.Provider value={value}>{children}</ActiveTradesContext.Provider>;
};

export const useActiveTrades = () => {
  const ctx = useContext(ActiveTradesContext);
  if (!ctx) throw new Error('useActiveTrades must be used within ActiveTradesProvider');
  return ctx;
};
