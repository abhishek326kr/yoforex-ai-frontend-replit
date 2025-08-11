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

  const backendUrls = [import.meta.env.VITE_PUBLIC_API_BASE_URL]

  for (const baseUrl of backendUrls) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Format parameters for API
        const formattedPair = mapToOandaInstrument(pair);

        const formattedStrategy = formatStrategyForApi(strategy);

        // Format timeframe to match backend expected format (e.g., '1H', '4H', '1D')




        const url = `${baseUrl}/analysis/strategy?strategy=${formattedStrategy}&pair=${formattedPair}&granularity=${newTimeFrame}&count=${count}`;



        const response = await axios.post<AnalysisResponse>(url, {}, {
          timeout: 400000, // Increased to 60 seconds
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'YoForex-Frontend/1.0'
          },
          // Add retry configuration
          validateStatus: (status) => status < 500, // Don't retry on client errors
        });

        console.log('Analysis response received:', response.data);
        return response.data;

      } catch (error: any) {
        console.error(`API request to ${baseUrl} failed (attempt ${attempt}/${retries}):`, error);

        // Check if it's a timeout or network error
        const isTimeoutError = error.code === 'ECONNABORTED' ||
          error.message?.includes('timeout') ||
          error.message?.includes('ERR_CONNECTION_TIMED_OUT');

        const isNetworkError = error.code === 'ENOTFOUND' ||
          error.code === 'ECONNREFUSED' ||
          error.message?.includes('Network Error');

        // If it's the last attempt for this URL, continue to next URL
        if (attempt === retries) {
          if (baseUrl === backendUrls[backendUrls.length - 1]) {
            // This is the last URL and last attempt
            if (isTimeoutError) {
              throw new Error(`Backend server is taking too long to respond. The analysis request timed out after 60 seconds. Please try again later or contact support.`);
            } else if (isNetworkError) {
              throw new Error('Unable to connect to the backend server. Please check your internet connection and try again.');
            } else {
              throw error;
            }
          }
          // Try next URL
          break;
        }

        // If not a retryable error, try next URL
        if (!isTimeoutError && !isNetworkError) {
          break;
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error('All backend URLs and retry attempts failed');
};





