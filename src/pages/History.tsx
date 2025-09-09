import { useEffect, useState } from "react";
import { TradingLayout } from "@/components/layout/TradingLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// table components no longer used after redesign
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import apiClient from "@/lib/api/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

function parseAnalysisFields(it: AnalysisHistoryItem): ParsedFields {
  const res = it.analysis_result as any;
  if (!res || typeof res !== 'object') {
    return { provider: null, signal: null, entry: null, stop_loss: null, take_profit: null, confidence: null };
  }
  // Multi-provider: pick first provider key with a non-error payload
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
  // If only errors, take first as placeholder
  const k0 = keys[0];
  return { provider: k0 || null, signal: null, entry: null, stop_loss: null, take_profit: null, confidence: null, rr: null, recommendation: null };
}

export function History() {
  const [mode, setMode] = useState<"my" | "all">("my");
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsItem, setDetailsItem] = useState<AnalysisHistoryItem | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const PAGE_SIZE = 5;

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
          // Fallback if total not provided
          setHasMore(list.length >= PAGE_SIZE);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load history");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [mode, page]);

  return (
    <TradingLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold heading-trading">Trading History</h1>
            <p className="text-muted-foreground mt-1">Browse your trade history or view all users' history.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={mode === "my" ? "default" : "outline"} onClick={() => resetAndLoad("my")}>
              My History
            </Button>
            <Button variant={mode === "all" ? "default" : "outline"} onClick={() => resetAndLoad("all")}>
              All History
            </Button>
          </div>
        </div>

        <Card className="trading-card">
          <div className="p-6">
            {error && <p className="text-destructive mb-4 text-sm">{error}</p>}
            <div className="space-y-4">
              {items.map(it => {
                const p = parseAnalysisFields(it);
                const isBuy = (p.signal || '').toUpperCase() === 'BUY';
                const isSell = (p.signal || '').toUpperCase() === 'SELL';
                const SignalIcon = isBuy ? TrendingUp : TrendingDown;
                return (
                  <Card key={it.id} className="p-4 bg-gradient-dark border border-border/20">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Badge variant={isBuy ? 'default' : 'destructive'} className={isBuy ? 'signal-buy' : isSell ? 'signal-sell' : ''}>
                          {p.signal ? p.signal.toString().toUpperCase() : '—'}
                        </Badge>
                        <span className="text-lg font-semibold text-foreground">{it.pair}</span>
                        <Badge variant="outline" className="text-xs">{it.strategy}</Badge>
                        <Badge variant="outline" className="text-xs">{it.granularity}</Badge>
                        <Badge variant="outline" className="text-xs">{p.provider || it.provider || 'provider'}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(it.created_at).toLocaleString()}</span>
                          <Badge variant="outline" className="text-xs">#{it.id}</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setDetailsItem(it); setDetailsOpen(true); }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-3 text-sm">
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
                        <p className="text-muted-foreground text-xs mb-1">Confidence</p>
                        <p className="font-medium">{p.confidence !== null && p.confidence !== undefined ? `${p.confidence}%` : '—'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">R:R</p>
                        <p className="font-medium">{p.rr || '—'}</p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-muted-foreground text-xs mb-1">Signal</p>
                        <div className={`inline-flex items-center gap-1 ${isBuy ? 'text-trading-profit' : isSell ? 'text-trading-loss' : ''}`}>
                          <SignalIcon className="h-4 w-4" />
                          <span className="font-medium">{p.signal || '—'}</span>
                        </div>
                      </div>
                    </div>
                    {p.recommendation && (
                      <div className="mt-3 text-sm text-muted-foreground">
                        <p className="line-clamp-3">{p.recommendation}</p>
                      </div>
                    )}
                  </Card>
                );
              })}
              {!items.length && !loading && (
                <div className="text-center text-muted-foreground text-sm">No history found.</div>
              )}
            </div>
            <div className="flex items-center justify-between mt-6">
              <span className="text-xs text-muted-foreground">
                {total !== null ? `Page ${page} of ${Math.max(1, Math.ceil(total / PAGE_SIZE))}` : `Page ${page}`}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1 || loading}
                  onClick={() => setPage(1)}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={(() => { if (loading) return true; if (total !== null) { const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE)); return page >= totalPages; } return !hasMore; })()}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  disabled={(() => { if (loading) return true; if (total !== null) { const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE)); return page >= totalPages; } return !hasMore; })()}
                  onClick={() => {
                    if (total !== null) {
                      const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
                      setPage(totalPages);
                    }
                  }}
                >
                  Last
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Details Dialog */}
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
                    <span className="text-xs text-muted-foreground">{new Date(detailsItem.created_at).toLocaleString()}</span>
                  </div>
                  {typeof payload === 'object' && payload && !(payload as any).error ? (
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
                      {(payload as any).recommendation && (
                        <div className="md:col-span-3 col-span-2">
                          <p className="text-xs text-muted-foreground mb-1">Recommendation</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{(payload as any).recommendation}</p>
                        </div>
                      )}
                      {(payload as any).technical_analysis && (
                        <div className="md:col-span-3 col-span-2">
                          <p className="text-xs text-muted-foreground mb-1">Technical Analysis</p>
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