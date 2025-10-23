import { QueryClient } from "@tanstack/react-query";

// Mock API request function for frontend-only version
export async function apiRequest(url: string, _options?: RequestInit) {
  // For frontend-only version, return mock data based on the URL
  // In a real application, this would make actual API calls to your backend
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Mock responses based on URL patterns
  if (url.includes('/api/trades')) {
    return {
      trades: [
        { id: 1, pair: 'EUR/USD', type: 'BUY', amount: 10000, entry: 1.0847, current: 1.0852, pnl: 50 },
        { id: 2, pair: 'GBP/JPY', type: 'SELL', amount: 5000, entry: 189.45, current: 189.30, pnl: 75 }
      ]
    };
  }
  
  if (url.includes('/api/signals')) {
    return {
      signals: [
        { pair: 'EUR/USD', direction: 'BUY', confidence: 89, entry: '1.0847', target: '1.0875' },
        { pair: 'GBP/JPY', direction: 'SELL', confidence: 82, entry: '189.45', target: '188.20' }
      ]
    };
  }
  
  // Default mock response
  return { data: 'mock data' };
}

// Default query client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});