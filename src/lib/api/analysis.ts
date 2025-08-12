import axios from 'axios';
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

export default function formattedTimeframe (timeframe: string) {
  switch (timeframe) {
    case '1M': return 'M1';
    case '5M': return 'M5';
    case '15M': return 'M15';
    case '30M': return 'M30';
    case '1H': return 'H1';
    case '4H': return 'H4';
    case '8H': return 'H8';
    case '1D': return 'D1';
    case '1W': return 'W1';
    case '1MO': return 'M';
    default: return 'H1'; // Default to 1 hour if unknown
  }
}

export const fetchTradingAnalysis = async (params: AnalysisParams, retries = 3): Promise<AnalysisResponse> => {
  const { pair, timeframe, strategy, count = 100 } = params;
  const newTimeFrame = formattedTimeframe(timeframe)

  // In production, we use relative URLs that will be proxied by Vite
  // In development, Vite will proxy the requests to the backend
  const baseUrl = import.meta.env.PROD ? '' : '/api';
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Format parameters for API
      const formattedPair = mapToOandaInstrument(pair);
      const formattedStrategy = formatStrategyForApi(strategy);
      
      // Build URL with proper encoding for query parameters
      const url = new URL(`${baseUrl}/analysis/strategy`, window.location.origin);
      url.searchParams.append('strategy', formattedStrategy);
      url.searchParams.append('pair', formattedPair);
      url.searchParams.append('granularity', newTimeFrame);
      url.searchParams.append('count', count.toString());
      
      console.log('API Request URL:', url.toString());

      const response = await axios.post<AnalysisResponse>(
        url.toString(),
        {},
        {
          timeout: 400000, // 60 seconds timeout
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'YoForex-Frontend/1.0'
          },
          validateStatus: (status) => status < 500 // Don't retry on client errors
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

      // If it's the last attempt, throw the error
      if (attempt === retries) {
        throw new Error(`Failed to fetch analysis after ${retries} attempts: ${error.message}`);
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