import apiClient from './client';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface AccountSummary {
  account_balance: number;
  available_credits: number;
  subscription_plan: 'free' | 'pro' | 'max';
  monthly_pnl_percentage: number;
  account_currency: string;
}

export interface PerformanceDataPoint {
  date: string; // ISO date string or label like "Mon", "Tue"
  profit: number;
  timestamp?: number;
}

export interface PerformanceData {
  data_points: PerformanceDataPoint[];
  period: 'weekly' | 'monthly' | 'yearly';
  total_pnl: number;
  percentage_change: number;
}

export interface TopPerformingPair {
  pair: string;
  win_rate: number;
  total_trades: number;
  avg_profit?: number;
  total_profit?: number;
}

export interface MarketMover {
  pair: string;
  price_change_percentage: number;
  direction: 'up' | 'down';
  current_price?: number;
  volume_24h?: number;
}

export interface ActivityItem {
  id: string;
  type: 'trade' | 'analysis' | 'deposit' | 'withdrawal' | 'upgrade' | 'other';
  description: string;
  timestamp: string; // ISO date string
  metadata?: Record<string, any>;
}

export interface RiskMetrics {
  max_drawdown_percentage: number;
  risk_reward_ratio: number;
  open_positions_risk_amount: number;
  portfolio_var?: number; // Value at Risk
  sharpe_ratio?: number;
  total_exposure?: number;
}

export interface DashboardOverview {
  account_summary: AccountSummary;
  performance_data: PerformanceData;
  top_pairs: TopPerformingPair[];
  market_movers: MarketMover[];
  recent_activity: ActivityItem[];
  risk_metrics: RiskMetrics;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get account summary including balance, credits, plan, and monthly P&L
 */
export const getAccountSummary = async (): Promise<AccountSummary> => {
  const response = await apiClient.get<AccountSummary>('/dashboard/account-summary');
  return response.data;
};

/**
 * Get performance chart data (weekly, monthly, or yearly P&L)
 * @param period - Time period for the chart data
 */
export const getPerformanceData = async (
  period: 'weekly' | 'monthly' | 'yearly' = 'weekly'
): Promise<PerformanceData> => {
  const response = await apiClient.get<PerformanceData>('/dashboard/performance', {
    params: { period }
  });
  return response.data;
};

/**
 * Get top performing currency pairs based on win rate
 * @param limit - Number of top pairs to return (default: 5)
 */
export const getTopPerformingPairs = async (limit: number = 5): Promise<TopPerformingPair[]> => {
  const response = await apiClient.get<TopPerformingPair[]>('/dashboard/top-pairs', {
    params: { limit }
  });
  return response.data;
};

/**
 * Get biggest market movers in the last 24 hours
 * @param limit - Number of movers to return (default: 5)
 */
export const getMarketMovers = async (limit: number = 5): Promise<MarketMover[]> => {
  const response = await apiClient.get<MarketMover[]>('/dashboard/market-movers', {
    params: { limit }
  });
  return response.data;
};

/**
 * Get recent user activity (trades, analyses, transactions)
 * @param limit - Number of recent activities to return (default: 5)
 */
export const getRecentActivity = async (limit: number = 5): Promise<ActivityItem[]> => {
  const response = await apiClient.get<ActivityItem[]>('/dashboard/recent-activity', {
    params: { limit }
  });
  return response.data;
};

/**
 * Get risk metrics for the user's portfolio
 */
export const getRiskMetrics = async (): Promise<RiskMetrics> => {
  const response = await apiClient.get<RiskMetrics>('/dashboard/risk-metrics');
  return response.data;
};

/**
 * Get complete dashboard overview (all data in one call)
 * This is more efficient if you need all dashboard data at once
 */
export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  const response = await apiClient.get<DashboardOverview>('/dashboard/overview');
  return response.data;
};

/**
 * Get portfolio statistics summary
 */
export interface PortfolioStats {
  active_trades: number;
  win_rate: number;
  ai_signals_24h: number;
  total_profit: number;
  total_trades: number;
}

export const getPortfolioStats = async (): Promise<PortfolioStats> => {
  const response = await apiClient.get<PortfolioStats>('/dashboard/portfolio-stats');
  return response.data;
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format currency amount for display
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format percentage for display
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

/**
 * Format time ago (e.g., "2 min ago", "1 hour ago")
 */
export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return `${diffSecs} sec ago`;
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return past.toLocaleDateString();
};

/**
 * Get activity icon name based on activity type
 */
export const getActivityIcon = (type: ActivityItem['type']): string => {
  const iconMap: Record<ActivityItem['type'], string> = {
    trade: 'TrendingUp',
    analysis: 'Brain',
    deposit: 'ArrowDownCircle',
    withdrawal: 'ArrowUpCircle',
    upgrade: 'Zap',
    other: 'Activity',
  };
  return iconMap[type] || 'Activity';
};

/**
 * Get subscription plan display name
 */
export const getPlanDisplayName = (plan: AccountSummary['subscription_plan']): string => {
  const planMap = {
    free: 'Free Plan',
    pro: 'Pro Plan',
    max: 'Max Plan',
  };
  return planMap[plan] || 'Free Plan';
};

/**
 * Get plan color for badges
 */
export const getPlanColor = (plan: AccountSummary['subscription_plan']): string => {
  const colorMap = {
    free: 'bg-gray-500',
    pro: 'bg-blue-500',
    max: 'bg-purple-500',
  };
  return colorMap[plan] || 'bg-gray-500';
};
