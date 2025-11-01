import { useEffect, useState, useMemo, useCallback } from "react";
import { TradingLayout } from "@/components/layout/TradingLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Download, 
  Filter, 
  Search, 
  Calendar,
  BarChart3,
  Activity,
  Target,
  Brain,
  Copy,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";

type AnalysisHistoryItem = {
  id: number;
  user_id: number;
  strategy: string;
  pair: string;
  granularity: string;
  provider?: string | null;
  model_used?: string | null;
  analysis_result: Record<string, any>;
  created_at: string;
};

type ParsedFields = {
  provider: string | null;
  signal: string | null;
  entry: number | string | null;
  stop_loss: number | string | null;
  take_profit: number | string | null;
  confidence: number | string | null;
  rr?: string | null;
  recommendation?: string | null;
};

type DateRange = 'last_7' | 'last_30' | 'last_90' | 'all';

function parseAnalysisFields(it: AnalysisHistoryItem): ParsedFields {
  const res = it.analysis_result as any;
  if (!res || typeof res !== 'object') {
    return { provider: null, signal: null, entry: null, stop_loss: null, take_profit: null, confidence: null };
  }
  const keys = Object.keys(res);
  for (const k of keys) {
    const v = res[k];
    if (v && typeof v === 'object' && !v.error) {
      return {
        provider: k,
        signal: (v.signal ?? null) as any,
        entry: (v.entry ?? null) as any,
        stop_loss: (v.stop_loss ?? null) as any,
        take_profit: (v.take_profit ?? null) as any,
        confidence: (v.confidence ?? null) as any,
        rr: (v.risk_reward_ratio ?? null) as any,
        recommendation: (v.recommendation ?? null) as any,
      };
    }
  }
  const k0 = keys[0];
  return { provider: k0 || null, signal: null, entry: null, stop_loss: null, take_profit: null, confidence: null, rr: null, recommendation: null };
}

function formatTimeAgo(dateString: string): string {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return new Date(dateString).toLocaleString();
  }
}

export function History() {
  const { toast } = useToast();
  const [mode, setMode] = useState<"my" | "all">("my");
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsItem, setDetailsItem] = useState<AnalysisHistoryItem | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const PAGE_SIZE = 10;

  const [filters, setFilters] = useState({
    search: '',
    pair: 'all',
    strategy: 'all',
    signal: 'all',
    provider: 'all',
    dateRange: 'all' as DateRange
  });

  const toTitleCase = (s: string) =>
    (s || "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const renderTAValue = (value: any) => {
    if (value === null || value === undefined) return <span>—</span>;
    if (Array.isArray(value)) {
      if (!value.length) return <span>—</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((v, i) => (
            <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0.5">
              {String(v)}
            </Badge>
          ))}
        </div>
      );
    }
    if (typeof value === "object") {
      const entries = Object.entries(value as Record<string, any>);
      if (!entries.length) return <span>—</span>;
      return (
        <div className="space-y-1">
          {entries.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground">{toTitleCase(k)}</span>
              <span className="font-medium text-foreground truncate">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
            </div>
          ))}
        </div>
      );
    }
    return <span className="text-sm font-medium">{String(value)}</span>;
  };

  const resetAndLoad = (nextMode: "my" | "all") => {
    setMode(nextMode);
    setItems([]);
    setPage(1);
    setHasMore(true);
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = mode === "my" ? `/analysis/history/me?page=${page}` : `/analysis/history/all?page=${page}`;
        const res = await apiClient.get<any>(url, { headers: { Accept: "application/json" } });
        if (cancelled) return;
        const data = res?.data?.history as AnalysisHistoryItem[] | undefined;
        const list = Array.isArray(data) ? data : [];
        setItems(prev => (page === 1 ? list : [...prev, ...list]));
        const totalAnalyses = typeof res?.data?.total_analyses === 'number' ? res.data.total_analyses : null;
        setTotal(totalAnalyses);
        if (totalAnalyses !== null) {
          const totalPages = Math.max(1, Math.ceil(totalAnalyses / PAGE_SIZE));
          setHasMore(page < totalPages);
        } else {
          setHasMore(list.length >= PAGE_SIZE);
        }
      } catch (e: any) {
        if (!cancelled) {
          console.error("Failed to load analysis history:", e);
          setError(e?.message || "Failed to load history");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [mode, page]);

  const quickStats = useMemo(() => {
    const totalAnalyses = items.length;
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthCount = items.filter(it => new Date(it.created_at) >= thisMonthStart).length;
    
    const strategyCount: Record<string, number> = {};
    const pairCount: Record<string, number> = {};
    
    items.forEach(it => {
      strategyCount[it.strategy] = (strategyCount[it.strategy] || 0) + 1;
      pairCount[it.pair] = (pairCount[it.pair] || 0) + 1;
    });
    
    const mostUsedStrategy = Object.entries(strategyCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
    const mostAnalyzedPair = Object.entries(pairCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
    
    return { totalAnalyses, thisMonthCount, mostUsedStrategy, mostAnalyzedPair };
  }, [items]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });
    
    const counts: Record<string, number> = {};
    last7Days.forEach(day => counts[day] = 0);
    
    items.forEach(it => {
      const day = it.created_at.split('T')[0];
      if (counts[day] !== undefined) {
        counts[day]++;
      }
    });
    
    return last7Days.map(day => ({
      day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
      count: counts[day]
    }));
  }, [items]);

  const uniquePairs = useMemo(() => {
    return Array.from(new Set(items.map(it => it.pair))).sort();
  }, [items]);

  const uniqueStrategies = useMemo(() => {
    return Array.from(new Set(items.map(it => it.strategy))).sort();
  }, [items]);

  const uniqueProviders = useMemo(() => {
    const providers = new Set<string>();
    items.forEach(it => {
      const parsed = parseAnalysisFields(it);
      if (parsed.provider) providers.add(parsed.provider);
    });
    return Array.from(providers).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(it => {
      if (filters.search && !it.pair.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.pair !== 'all' && it.pair !== filters.pair) {
        return false;
      }
      if (filters.strategy !== 'all' && it.strategy !== filters.strategy) {
        return false;
      }
      const parsed = parseAnalysisFields(it);
      if (filters.signal !== 'all') {
        const signal = (parsed.signal || '').toUpperCase();
        if (signal !== filters.signal) return false;
      }
      if (filters.provider !== 'all' && parsed.provider !== filters.provider) {
        return false;
      }
      if (filters.dateRange !== 'all') {
        const date = new Date(it.created_at);
        const now = new Date();
        const daysDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
        
        if (filters.dateRange === 'last_7' && daysDiff > 7) return false;
        if (filters.dateRange === 'last_30' && daysDiff > 30) return false;
        if (filters.dateRange === 'last_90' && daysDiff > 90) return false;
      }
      return true;
    });
  }, [items, filters]);

  const exportToCSV = useCallback(() => {
    const headers = ['ID', 'Pair', 'Strategy', 'Granularity', 'Provider', 'Signal', 'Entry', 'Stop Loss', 'Take Profit', 'Confidence', 'R:R', 'Date'];
    const rows = filteredItems.map(it => {
      const parsed = parseAnalysisFields(it);
      return [
        it.id,
        it.pair,
        it.strategy,
        it.granularity,
        parsed.provider || '',
        parsed.signal || '',
        parsed.entry || '',
        parsed.stop_loss || '',
        parsed.take_profit || '',
        parsed.confidence || '',
        parsed.rr || '',
        new Date(it.created_at).toLocaleString()
      ];
    });
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Export successful', description: `Exported ${filteredItems.length} analyses to CSV` });
  }, [filteredItems, toast]);

  const handleCopyAnalysis = useCallback((item: AnalysisHistoryItem) => {
    const parsed = parseAnalysisFields(item);
    const text = `${item.pair} ${parsed.signal} Analysis
Entry: ${parsed.entry}
Stop Loss: ${parsed.stop_loss}
Take Profit: ${parsed.take_profit}
Confidence: ${parsed.confidence}%
Provider: ${parsed.provider}
Date: ${new Date(item.created_at).toLocaleString()}`;
    
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard', description: 'Analysis details copied successfully' });
  }, [toast]);

  const startIdx = total !== null ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endIdx = total !== null ? Math.min(page * PAGE_SIZE, total) : items.length;

  return (
    <TradingLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analysis History</h1>
            <p className="text-muted-foreground mt-1">View your past AI trading analysis</p>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <Button variant={mode === "my" ? "default" : "outline"} onClick={() => resetAndLoad("my")}>
              My History
            </Button>
            <Button variant={mode === "all" ? "default" : "outline"} onClick={() => resetAndLoad("all")}>
              All History
            </Button>
            <Button 
              variant="outline" 
              onClick={exportToCSV}
              disabled={filteredItems.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Analyses</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quickStats.totalAnalyses}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quickStats.thisMonthCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Analyses this month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Most Used Strategy</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">{quickStats.mostUsedStrategy}</div>
              <p className="text-xs text-muted-foreground mt-1">Top strategy</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Most Analyzed Pair</CardTitle>
              <Brain className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{quickStats.mostAnalyzedPair}</div>
              <p className="text-xs text-muted-foreground mt-1">Top pair</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analyses per Day (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by pair..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-9"
                />
              </div>

              <Select value={filters.dateRange} onValueChange={(val) => setFilters(prev => ({ ...prev, dateRange: val as DateRange }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last_7">Last 7 Days</SelectItem>
                  <SelectItem value="last_30">Last 30 Days</SelectItem>
                  <SelectItem value="last_90">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.pair} onValueChange={(val) => setFilters(prev => ({ ...prev, pair: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Pair" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pairs</SelectItem>
                  {uniquePairs.map(pair => (
                    <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.strategy} onValueChange={(val) => setFilters(prev => ({ ...prev, strategy: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Strategies</SelectItem>
                  {uniqueStrategies.map(strategy => (
                    <SelectItem key={strategy} value={strategy}>{strategy}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.signal} onValueChange={(val) => setFilters(prev => ({ ...prev, signal: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Signal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Signals</SelectItem>
                  <SelectItem value="BUY">BUY</SelectItem>
                  <SelectItem value="SELL">SELL</SelectItem>
                  <SelectItem value="HOLD">HOLD</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.provider} onValueChange={(val) => setFilters(prev => ({ ...prev, provider: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  {uniqueProviders.map(provider => (
                    <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30">
          <CardHeader>
            <CardTitle>Analysis Results ({filteredItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-destructive mb-4 text-sm">{error}</p>}
            
            {loading && filteredItems.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                <span className="text-muted-foreground">Loading analyses...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map(it => {
                  const p = parseAnalysisFields(it);
                  const isBuy = (p.signal || '').toUpperCase() === 'BUY';
                  const isSell = (p.signal || '').toUpperCase() === 'SELL';
                  const isHold = (p.signal || '').toUpperCase() === 'HOLD';
                  const SignalIcon = isBuy ? TrendingUp : isSell ? TrendingDown : Activity;
                  const confidence = typeof p.confidence === 'number' ? p.confidence : parseFloat(String(p.confidence)) || 0;
                  
                  return (
                    <Card key={it.id} className="p-4 bg-gradient-to-br from-card to-card/50 border border-border/30 hover:border-border/50 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge 
                            variant={isBuy ? 'default' : isSell ? 'destructive' : 'secondary'} 
                            className={isBuy ? 'signal-buy' : isSell ? 'signal-sell' : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'}
                          >
                            <SignalIcon className="h-3 w-3 mr-1" />
                            {p.signal ? p.signal.toString().toUpperCase() : '—'}
                          </Badge>
                          <span className="text-lg font-semibold text-foreground">{it.pair}</span>
                          <Badge variant="outline" className="text-xs">{it.strategy}</Badge>
                          <Badge variant="outline" className="text-xs">{it.granularity}</Badge>
                          <Badge variant="outline" className="text-xs">
                            <Brain className="h-3 w-3 mr-1" />
                            {p.provider || it.provider || 'provider'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(it.created_at)}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyAnalysis(it)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setDetailsItem(it); setDetailsOpen(true); }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Entry</p>
                          <p className="font-medium">{p.entry ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Stop Loss</p>
                          <p className="font-medium text-trading-loss">{p.stop_loss ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Take Profit</p>
                          <p className="font-medium text-trading-profit">{p.take_profit ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">R:R</p>
                          <p className="font-medium">{p.rr || '—'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">ID</p>
                          <Badge variant="outline" className="text-xs">#{it.id}</Badge>
                        </div>
                      </div>

                      {confidence > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-muted-foreground">Confidence</p>
                            <p className="text-xs font-medium">{confidence}%</p>
                          </div>
                          <Progress value={confidence} className="h-2" />
                        </div>
                      )}
                      
                      {p.recommendation && (
                        <div className="mt-3 text-sm text-muted-foreground">
                          <p className="line-clamp-2">{p.recommendation}</p>
                        </div>
                      )}
                    </Card>
                  );
                })}
                
                {filteredItems.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-6 rounded-2xl mb-4 inline-block">
                      <BarChart3 className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Analysis Found</h3>
                    <p className="text-muted-foreground">
                      {filters.search || filters.pair !== 'all' || filters.strategy !== 'all' || filters.signal !== 'all' || filters.provider !== 'all' || filters.dateRange !== 'all'
                        ? 'Try adjusting your filters to see more results.'
                        : 'No analysis history available yet.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {total !== null && total > 0 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <span className="text-sm text-muted-foreground">
                  Showing {startIdx}-{endIdx} of {total} analyses
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || loading}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasMore || loading}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={detailsOpen} onOpenChange={(open) => { setDetailsOpen(open); if (!open) setDetailsItem(null); }}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Analysis Details</DialogTitle>
            {detailsItem && (
              <DialogDescription>
                {detailsItem.pair} • {detailsItem.strategy} • {detailsItem.granularity} • ID #{detailsItem.id}
              </DialogDescription>
            )}
          </DialogHeader>
          {detailsItem && (
            <div className="max-h-[70vh] overflow-y-auto space-y-4 pr-1">
              {Object.entries(detailsItem.analysis_result || {}).map(([provider, payload]) => (
                <Card key={provider} className="p-4 bg-background/60 border border-border/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{String(provider)}</Badge>
                      {typeof (payload as any)?.signal === 'string' && (
                        <Badge variant={(payload as any).signal.toUpperCase() === 'BUY' ? 'default' : 'destructive'} className={(payload as any).signal.toUpperCase() === 'BUY' ? 'signal-buy' : 'signal-sell'}>
                          {(payload as any).signal.toString().toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(detailsItem.created_at)}</span>
                  </div>
                  {typeof payload === 'object' && payload && !(payload as any).error ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Entry</p>
                          <p className="font-medium">{(payload as any).entry ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Stop Loss</p>
                          <p className="font-medium text-trading-loss">{(payload as any).stop_loss ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Take Profit</p>
                          <p className="font-medium text-trading-profit">{(payload as any).take_profit ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                          <p className="font-medium">{(payload as any).confidence !== undefined ? `${(payload as any).confidence}%` : '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">R:R</p>
                          <p className="font-medium">{(payload as any).risk_reward_ratio ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Timeframe</p>
                          <p className="font-medium">{(payload as any).timeframe ?? '—'}</p>
                        </div>
                      </div>
                      {(payload as any).recommendation && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Recommendation</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{(payload as any).recommendation}</p>
                        </div>
                      )}
                      {(payload as any).technical_analysis && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Technical Analysis</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.entries((payload as any).technical_analysis as Record<string, any>).map(([k, v]) => (
                              <div key={k} className="rounded-md border border-border/30 bg-muted/20 p-3">
                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">{toTitleCase(k)}</p>
                                <div className="text-sm">
                                  {renderTAValue(v)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-destructive">
                      {(payload as any)?.error ? String((payload as any).error) : 'No details available'}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TradingLayout>
  );
}
