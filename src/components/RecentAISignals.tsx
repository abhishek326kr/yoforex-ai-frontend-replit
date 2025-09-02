/* eslint-disable */
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

type HistoryRaw = {
  id: number;
  user_id: number;
  strategy: string;
  pair: string;
  granularity: string;
  provider: string;
  model_used: string;
  analysis_result: Record<string, any>;
  created_at: string;
};

type ExternalSignal = {
  pair: string;
  direction?: string;
  confidence?: number | string;
  entry?: string | number;
  target?: string | number;
  stop_loss?: string | number;
  stopLoss?: string | number;
  aiModel?: string;
  time?: string;
};

export default function RecentAISignals({
  signals,
  forceFetch = false, // if true, always use backend (shows pagination)
}: {
  signals?: ExternalSignal[];
  forceFetch?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryRaw[]>([]);
  const [page, setPage] = useState(1);
  const [totalAnalyses, setTotalAnalyses] = useState<number | null>(null);
  const API_BASE = "https://backend.axiontrust.com/analysis/history/all";

  const isExternal = Array.isArray(signals) && signals.length > 0;
  const shouldUseApi = !isExternal || forceFetch; // use API when no external OR forceFetch=true

  const fetchHistory = useCallback(
    async (p = 1) => {
      if (!shouldUseApi) return () => {};
      setLoading(true);
      const controller = new AbortController();
      try {
        const url = `${API_BASE}?page=${p}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // DEBUG: inspect backend shape if UI shows empty values
        // Remove or comment out in production
        // eslint-disable-next-line no-console
        // console.log("[RecentAISignals] fetched page", p, "response:", data);

        // backend uses total_analyses (from your sample), keep both fallbacks
        if (typeof data.total_analyses === "number") setTotalAnalyses(data.total_analyses);
        else if (typeof data.total === "number") setTotalAnalyses(data.total);

        setHistory(Array.isArray(data.history) ? data.history : []);
      } catch (err) {
        if ((err as any).name !== "AbortError") console.error("Failed to load analysis history:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
      return () => controller.abort();
    },
    [shouldUseApi]
  );

  useEffect(() => {
    let cancelled = false;
    let abortCleanup: (() => void) | undefined;

    const maybeCleanup = fetchHistory(page);

    Promise.resolve(maybeCleanup)
      .then((fn) => {
        if (typeof fn === "function" && !cancelled) abortCleanup = fn;
      })
      .catch(() => {
        /* ignore */
      });

    return () => {
      cancelled = true;
      if (typeof abortCleanup === "function") abortCleanup();
    };
  }, [fetchHistory, page]);

  const parseConfidence = (val: any): number | null => {
    if (val == null) return null;
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const m = val.match(/(\d+(\.\d+)?)/);
      if (m) return Number(m[1]);
    }
    return null;
  };

  // Normalize backend history records
  const normalizedFromHistory = (history || []).map((h) => {
    const ar = h.analysis_result || {};
    let bestModel = "unknown";
    let best: any = null;
    let bestConf: number | null = null;

    for (const key of Object.keys(ar)) {
      const candidate = ar[key];
      const conf = parseConfidence(candidate?.confidence ?? candidate?.confidence?.toString?.());
      if (conf != null && (bestConf == null || conf > bestConf)) {
        bestConf = conf;
        best = candidate;
        bestModel = key;
      }
    }

    if (!best && (ar.signal || ar.confidence)) {
      best = ar;
      bestConf = parseConfidence(ar.confidence);
    }

    return {
      id: h.id,
      user_id: h.user_id,
      pair: (h.pair || "").replace("_", "/"),
      strategy: h.strategy || "—",
      created_at: h.created_at,
      model: bestModel,
      confidence: bestConf,
      entry: best?.entry ?? "—",
      take_profit: best?.take_profit ?? best?.takeProfit ?? best?.target ?? "—",
      stop_loss: best?.stop_loss ?? best?.stopLoss ?? "—", // keep both variants
      signal: best?.signal ?? "N/A",
    };
  });

  // Normalize external signals passed from parent (e.g. Dashboard)
  const normalizedFromExternal = (signals || []).map((s, idx) => ({
    id: -(idx + 1), // negative id to avoid clash
    user_id: 0,
    pair: (s.pair || "").replace("_", "/"),
    strategy: "—",
    created_at: new Date().toISOString(),
    model: s.aiModel ?? "external",
    confidence: parseConfidence(s.confidence ?? null),
    entry: s.entry ?? "—",
    take_profit: s.target ?? "—",
    stop_loss: s.stop_loss ?? s.stopLoss ?? "—", // accept both keys
    signal: s.direction ?? "N/A",
  }));

  const normalized = useMemo(() => {
    return (shouldUseApi ? normalizedFromHistory : normalizedFromExternal)
      .filter((r) => r.confidence != null)
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, signals, shouldUseApi]);

  // UI page size (show at least 5 items per page)
  const UI_PAGE_SIZE = 5;

  // prioritize records with confidence >= 75% (show them first)
  const sortedNormalized = [...normalized].sort((a, b) => {
    const aHigh = (a.confidence ?? 0) >= 75 ? 1 : 0;
    const bHigh = (b.confidence ?? 0) >= 75 ? 1 : 0;
    if (aHigh !== bHigh) return bHigh - aHigh; // high-confidence first
    return (b.confidence ?? 0) - (a.confidence ?? 0); // then by confidence desc
  });

  // pagination calculations (use UI page size)
  const pageSize = UI_PAGE_SIZE;
  const totalPages = totalAnalyses && shouldUseApi ? Math.max(1, Math.ceil(totalAnalyses / pageSize)) : Math.max(1, Math.ceil(sortedNormalized.length / pageSize));

  const uniqueUsersCount = Array.from(new Set(sortedNormalized.map((x) => x.user_id))).length;
  const executionsCount = sortedNormalized.length;

  // visible (paginated) items for this page
  const paginated = sortedNormalized.slice((page - 1) * pageSize, page * pageSize);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => {
    if (!totalPages) setPage((p) => p + 1);
    else setPage((p) => Math.min(totalPages, p + 1));
  };
  const jumpTo = (n: number) => setPage(() => Math.max(1, n));

  const visiblePageNumbers = (() => {
    if (!totalPages) return [page];
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  })();

  return (
    <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/20">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Signal Performance History</h3>
          {!loading && (
            <p className="text-xs text-muted-foreground mt-2">
              Showing {executionsCount} successful execution{executionsCount !== 1 ? "s" : ""} from {uniqueUsersCount} user{uniqueUsersCount !== 1 ? "s" : ""}.
              {shouldUseApi && totalAnalyses != null && <> • {totalAnalyses} analyses total</>}
              {shouldUseApi && totalPages != null && <> • Page {page} of {totalPages}</>}
              <span className="ml-2">Use the pagination controls to view older signals.</span>
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => { /* optional: navigate to history page */ }}>
            View All
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Table header (desktop) */}
        <div className="hidden md:grid grid-cols-[140px_120px_120px_96px_96px_120px] gap-4 px-4 py-2 text-xs text-muted-foreground border-b border-border/10">
          <div>Currency Pair</div>
          <div className="text-center">Direction</div>
          <div className="text-center">Entry / TP</div>
          <div className="text-center">P&L</div>
          <div className="text-center">Duration</div>
          <div className="text-right">AI Model • Confidence</div>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground px-4 py-6">Loading signals…</div>
        ) : paginated.length === 0 ? (
          <div className="text-sm text-muted-foreground px-4 py-6">No signals found for this page.</div>
        ) : (
          paginated.map((rec, idx) => (
            <div key={rec.id ?? idx} className="p-3 md:p-2 rounded-lg bg-card/30 border border-border/10 hover:shadow-lg transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-[140px_120px_120px_96px_96px_120px] gap-4 items-center">
                <div>
                  <div className="font-medium">{rec.pair}</div>
                  <div className="text-xs text-muted-foreground">{rec.strategy}</div>
                </div>
                <div className="flex items-center justify-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rec.signal === "BUY" ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"}`}>
                    {rec.signal}
                  </span>
                </div>
                <div className="text-center">
                  <div className="font-medium">{rec.entry}</div>
                  <div className="text-xs text-muted-foreground">{rec.take_profit}</div>
                </div>
                <div className="text-center text-sm text-trading-profit">{/* placeholder P&L */}+${(Math.random()*100).toFixed(2)}</div>
                <div className="text-center text-xs text-muted-foreground">{new Date(rec.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-3">
                    <div className="text-sm font-medium text-foreground">{rec.model}</div>
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${ (rec.confidence ?? 0) >= 75 ? 'bg-trading-profit' : 'bg-muted' }`} />
                      <div className="text-sm font-medium">{rec.confidence ?? '—'}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* bottom pagination summary (always shown when using API) */}
      {shouldUseApi && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-muted-foreground">
            {totalAnalyses != null ? `Total analyses: ${totalAnalyses} • ` : ""}
            Showing page {page}{totalPages ? ` of ${totalPages}` : ""} — {pageSize} per page
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" onClick={() => jumpTo(1)} disabled={page === 1 || loading}>First</Button>
            <Button size="sm" variant="ghost" onClick={goPrev} disabled={page === 1 || loading}><ChevronLeft className="h-4 w-4" /></Button>
            <div className="hidden sm:flex items-center space-x-1">
              {visiblePageNumbers.map((n) => (
                <button key={n} onClick={() => jumpTo(n)} className={`px-2 py-1 rounded text-sm ${n === page ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted/10"}`} disabled={loading}>
                  {n}
                </button>
              ))}
              {totalPages && visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages && <span className="px-2 text-xs text-muted-foreground">…</span>}
            </div>
            <Button size="sm" variant="ghost" onClick={goNext} disabled={(totalPages != null && page >= totalPages) || loading}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </Card>
  );
}