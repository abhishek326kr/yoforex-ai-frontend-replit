import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import apiClient from "@/lib/api/client";

type StatData = {
  value: string;
  change?: string;
  changePercent?: string;
  positive?: boolean;
};

export default function PortfolioStatCard({
  title,
  icon: Icon,
  apiUrl,
  fallback,
}: {
  title: string;
  icon: React.ComponentType<any>;
  apiUrl?: string;
  fallback?: StatData;
}) {
  const [data, setData] = useState<StatData | null>(fallback ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const formatRelativeTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return "just now";
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  useEffect(() => {
    let mounted = true;
    if (!apiUrl) return;
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(apiUrl, { signal: ctrl.signal as any });
        const json = res.data;
        // Backend specific mapping for common shapes
        let mapped: any = json;
        if (typeof json === "number") {
          mapped = { value: String(json) };
        } else if (json && typeof json === "object") {
          // Prefer average_confidence for Win Rate card
          if (title === "Win Rate" && typeof (json as any).average_confidence === "number") {
            const unit = (json as any).unit || "%";
            const val = (json as any).average_confidence;
            mapped = { value: `${Number(val).toFixed(1)}${unit}` };
          } else if (typeof (json as any).average_confidence === "number") {
            // Fallback if title not matched but field exists
            const unit = (json as any).unit || "%";
            const val = (json as any).average_confidence;
            mapped = { value: `${Number(val).toFixed(1)}${unit}` };
          } else if (title === "Active Trades" && typeof (json as any).active_trades === "number") {
            // Use explicit active_trades field for Active Trades card
            mapped = { value: String((json as any).active_trades) };
          } else if (title === "Closed Positions" && typeof (json as any).closed_trades === "number") {
            // Use explicit closed_trades field for Closed Positions card
            mapped = { value: String((json as any).closed_trades) };
          } else if (typeof (json as any).active_trades === "number") {
            // Generic support if field exists but title doesn't match for some reason
            mapped = { value: String((json as any).active_trades) };
          } else if (typeof (json as any).closed_trades === "number") {
            // Generic support for closed_trades if title doesn't match
            mapped = { value: String((json as any).closed_trades) };
          } else if (typeof json.count === "number") {
            // e.g., { count: 5 }
            mapped = { value: String(json.count) };
          } else if (typeof json.win_rate === "number") {
            // e.g., { win_rate: 73.4 } or { win_rate: 0.734 }
            const rate = json.win_rate <= 1 ? json.win_rate * 100 : json.win_rate;
            mapped = { value: `${Number(rate).toFixed(1)}%` };
          } else if (typeof json.total_analyses === "number") {
            mapped = { value: String(json.total_analyses) };
          } else if (typeof json.total === "number") {
            mapped = { value: String(json.total) };
          }
        }

        // Provide sensible secondary text defaults when backend doesn't supply them
        if (mapped && (mapped.change == null && mapped.changePercent == null)) {
          if (title === "Active Trades") {
            mapped.change = "Open positions";
            mapped.changePercent = "Right now";
          } else if (title === "Win Rate") {
            mapped.change = "Overall";
            mapped.changePercent = "All time";
          } else if (title === "AI Signals") {
            mapped.change = "Records";
            mapped.changePercent = "Total generated";
          }
        }

        // Compute local delta vs last seen value (numeric only)
        try {
          const key = `stat:${title}:last`;
          const toNumber = (v: any): number | null => {
            if (v == null) return null;
            if (typeof v === "number") return v;
            if (typeof v === "string") {
              const m = v.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
              return m ? Number(m[0]) : null;
            }
            return null;
          };
          const currentVal = toNumber(mapped?.value);
          const raw = localStorage.getItem(key);
          const prev = raw ? JSON.parse(raw) as { value: number; ts: number } : null;
          if (currentVal != null) {
            if (prev && typeof prev.value === 'number') {
              const diff = currentVal - prev.value;
              const pct = prev.value !== 0 ? (diff / prev.value) * 100 : (diff === 0 ? 0 : 100);
              const sign = diff >= 0 ? '+' : '';
              // Only override placeholder if backend didn't provide change
              if (!mapped.change && !mapped.changePercent) {
                mapped.change = `${sign}${diff.toFixed(2)}`;
                mapped.changePercent = `${sign}${pct.toFixed(1)}% vs last`; 
              }
              mapped.positive = diff >= 0;
            }
            localStorage.setItem(key, JSON.stringify({ value: currentVal, ts: Date.now() }));
          }
        } catch {}

        // Expecting { value, change, changePercent, positive } or mapped shape
        if (mounted) {
          setData(mapped ?? null);
          setLastUpdated(new Date());
        }
      } catch (err: any) {
        // Axios cancellation error has different shape; normalize to AbortError name check
        const isAborted = err?.code === "ERR_CANCELED" || err?.name === "CanceledError" || err?.name === "AbortError";
        if (!isAborted) setError(err.message ?? "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      ctrl.abort();
    };
  }, [apiUrl]);

  const stat = data ?? { value: "—", change: "", changePercent: "", positive: true };

  return (
    <Card className={`trading-card-hover p-6 fade-in-up`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-1">{loading ? "…" : stat.value}</p>
          {stat.change || stat.changePercent ? (
            <div className={`flex items-center mt-2 text-sm ${stat.positive ? "text-trading-profit" : "text-trading-loss"}`}>
              {stat.positive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span className="font-medium">{stat.change}</span>
              <span className="text-muted-foreground ml-1">{stat.changePercent}</span>
            </div>
          ) : (
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{lastUpdated ? `Updated ${formatRelativeTime(lastUpdated)}` : "Awaiting update"}</span>
            </div>
          )}
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
        </div>
        <div className="h-12 w-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}
