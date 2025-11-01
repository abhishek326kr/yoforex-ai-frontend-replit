import { useState, useEffect } from 'react';
import {
  getAccountSummary,
  getPerformanceData,
  getTopPerformingPairs,
  getMarketMovers,
  getRecentActivity,
  getRiskMetrics,
  getDashboardOverview,
  getPortfolioStats,
  type AccountSummary,
  type PerformanceData,
  type TopPerformingPair,
  type MarketMover,
  type ActivityItem,
  type RiskMetrics,
  type DashboardOverview,
  type PortfolioStats,
} from '@/lib/api/dashboard';

// ============================================
// INDIVIDUAL HOOKS
// ============================================

/**
 * Hook to fetch and manage account summary data
 */
export const useAccountSummary = () => {
  const [data, setData] = useState<AccountSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const summary = await getAccountSummary();
      setData(summary);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch account summary');
      console.error('Error fetching account summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { data, loading, error, refresh };
};

/**
 * Hook to fetch and manage performance chart data
 */
export const usePerformanceData = (period: 'weekly' | 'monthly' | 'yearly' = 'weekly') => {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const performance = await getPerformanceData(period);
      setData(performance);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch performance data');
      console.error('Error fetching performance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [period]);

  return { data, loading, error, refresh };
};

/**
 * Hook to fetch and manage top performing pairs
 */
export const useTopPerformingPairs = (limit: number = 5) => {
  const [data, setData] = useState<TopPerformingPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const pairs = await getTopPerformingPairs(limit);
      setData(pairs);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch top performing pairs');
      console.error('Error fetching top performing pairs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [limit]);

  return { data, loading, error, refresh };
};

/**
 * Hook to fetch and manage market movers
 */
export const useMarketMovers = (limit: number = 5) => {
  const [data, setData] = useState<MarketMover[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const movers = await getMarketMovers(limit);
      setData(movers);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch market movers');
      console.error('Error fetching market movers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [limit]);

  return { data, loading, error, refresh };
};

/**
 * Hook to fetch and manage recent activity
 */
export const useRecentActivity = (limit: number = 5) => {
  const [data, setData] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const activity = await getRecentActivity(limit);
      setData(activity);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recent activity');
      console.error('Error fetching recent activity:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [limit]);

  return { data, loading, error, refresh };
};

/**
 * Hook to fetch and manage risk metrics
 */
export const useRiskMetrics = () => {
  const [data, setData] = useState<RiskMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const metrics = await getRiskMetrics();
      setData(metrics);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch risk metrics');
      console.error('Error fetching risk metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { data, loading, error, refresh };
};

/**
 * Hook to fetch and manage portfolio stats
 */
export const usePortfolioStats = () => {
  const [data, setData] = useState<PortfolioStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await getPortfolioStats();
      setData(stats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch portfolio stats');
      console.error('Error fetching portfolio stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { data, loading, error, refresh };
};

// ============================================
// COMBINED HOOK
// ============================================

/**
 * Hook to fetch all dashboard data at once
 * More efficient than using individual hooks if you need everything
 */
export const useDashboardOverview = () => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const overview = await getDashboardOverview();
      setData(overview);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard overview');
      console.error('Error fetching dashboard overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { data, loading, error, refresh };
};
