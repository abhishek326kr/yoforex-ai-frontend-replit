import apiClient from './client';

export type TradeClosePayload = {
  closed_price?: number;
  result?: 'win' | 'loss' | 'manual_close';
  hit_reason?: 'tp' | 'sl' | 'manual';
};

/**
 * Close an active trade by ID
 * Endpoint: POST /analysis/trade/{trade_id}/close
 */
export const closeTrade = async (tradeId: number, payload?: TradeClosePayload) => {
  const url = `/analysis/trade/${tradeId}/close`;
  const res = await apiClient.post(url, payload ?? {});
  return res.data;
};

export type CreateTradePayload = {
  pair: string; // e.g., 'EUR_USD'
  granularity: string; // e.g., 'H1'
  side?: string; // 'buy' | 'sell'
  entry_price?: number;
  size?: number;
  tp_price?: number;
  sl_price?: number;
};

/**
 * Create an active trade without analysis_id
 * Endpoint: POST /analysis/trade/create
 */
export const createTrade = async (payload: CreateTradePayload) => {
  const res = await apiClient.post('/analysis/trade/create', payload);
  return res.data;
};
