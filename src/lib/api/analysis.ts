import apiClient from './client';
import { mapToOandaInstrument } from '@/utils/trading';
// Supported timeframes in the format expected by the API
export type Timeframe = 'M1' | 'M5' | 'M15' | 'M30' | 'H1' | 'H4' | 'H8' | 'D1' | 'W1' | 'M';

// Supported trading strategies
export type TradingStrategy = 'breakout' | 'ict' | 'advanced_smc' | 'smc' | 'fibonacci' | 'trend_following' | 'momentum' | 'volatility_breakout' | 'carry_trade' | 'options_straddle';

// Candle data structure
export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Analysis response structure
export interface AnalysisResponse {
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
    technical_analysis: {
      Support_Level: number;
      Resistance_Level: number;
      Volume_Confirmation: string;
      Breakout_Direction: string;
    };
    recommendation: string;
  };
  billing?: {
    charged_credits: number;
    monthly_credits_remaining: number;
    daily_credits_spent: number;
  };
}

interface AnalysisParams {
  pair: string;          // e.g., 'EUR_USD', 'XAU_USD'
  timeframe: string;   // e.g., 'M15', 'H1', 'H4'
  strategy: TradingStrategy;
  count?: number;         // Default: 100
}

/**
 * Fetches trading analysis for the given parameters
 * @param params Analysis parameters
 * @returns Promise with analysis data
 */
// Helper function to convert UI strategy name to API-expected format
const formatStrategyForApi = (strategy: string): string => {
  switch (strategy) {
    case 'Breakout Strategy':
      return 'breakout';
    case 'ICT Concept':
      return 'ict';
    case 'Advanced SMC':
      return 'advanced_smc';
    case 'SMC Strategy':
      return 'smc';
    case 'Fibonacci Retracement':
      return 'fibonacci';
    case 'Trend Following':
      return 'trend_following';
    case 'Momentum':
      return 'momentum';
    case 'Volatility Breakout':
      return 'volatility_breakout';
    case 'Carry Trade':
      return 'carry_trade';
    case 'Options Straddle':
      return 'options_straddle';
    default:
      return 'breakout';
  }
};

export default function formattedTimeframe(timeframe: string) {
  // If already in API format, return as-is
  const apiFormats = new Set(['M1','M5','M15','M30','H1','H4','H8','D1','W1','M']);
  if (apiFormats.has(timeframe)) return timeframe as any;

  // Map from UI formats to API formats
  switch (timeframe) {
    case '1M': return 'M1';
    case '5M': return 'M5';
    case '15M': return 'M15';
    case '30M': return 'M30';
    case '1H': return 'H1';
    case '4H': return 'H4';
    case '8H': return 'H8';
    case '1D': return 'D';
    case '1W': return 'W';
    case '1MO': return 'M';
  }

  // Map from TradingView interval to API format
  switch (timeframe) {
    case '1': return 'M1';
    case '5': return 'M5';
    case '15': return 'M15';
    case '30': return 'M30';
    case '60': return 'H1';
    case '240': return 'H4';
    case 'D': return 'D';
    case 'W': return 'W';
    case 'M': return 'M';
    default: return 'H1'; // Fallback
  }
}

export const fetchTradingAnalysis = async (params: AnalysisParams, retries = 3): Promise<AnalysisResponse> => {
  const { pair, timeframe, strategy, count = 100 } = params;
  const newTimeFrame = formattedTimeframe(timeframe)

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Format parameters for API
      const formattedPair = mapToOandaInstrument(pair);
      const formattedStrategy = formatStrategyForApi(strategy);

      // Use relative path, let apiClient handle baseURL
      const endpoint = '/analysis/strategy';
      const queryParams = new URLSearchParams({
        strategy: formattedStrategy,
        pair: formattedPair,
        granularity: newTimeFrame,
        count: count.toString(),
      });

      const url = `${endpoint}?${queryParams.toString()}`;

      console.log('API Request URL:', url);

      const response = await apiClient.post<AnalysisResponse>(
        url,
        {},
        {
          timeout: 400000, // 400 seconds timeout for long-running analysis
          headers: {
            'Accept': 'application/json',
          },
          // Only treat 2xx as success; 4xx should throw and be handled by callers
          validateStatus: (status) => status >= 200 && status < 300
        }
      );

      console.log('Analysis response received:', response.data);
      return response.data;

    } catch (error: any) {
      lastError = error;
      console.error(`API request failed (attempt ${attempt}/${retries}):`, error);

      // Check if it's a timeout or network error
      const isTimeoutError = error.code === 'ECONNABORTED' ||
        error.message?.includes('timeout') ||
        error.message?.includes('ERR_CONNECTION_TIMED_OUT');

      const isNetworkError = !error.response && error.request;

      // If it's the last attempt, rethrow original error to preserve response details
      if (attempt === retries) {
        throw error;
      }

      // If not a retryable error, throw the error
      if (!isTimeoutError && !isNetworkError) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('All retry attempts failed');
};