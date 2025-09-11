import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

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

  useEffect(() => {
    let mounted = true;
    if (!apiUrl) return;
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiUrl, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
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
          } else if (typeof (json as any).active_trades === "number") {
            // Generic support if field exists but title doesn't match for some reason
            mapped = { value: String((json as any).active_trades) };
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
        // Expecting { value, change, changePercent, positive } or mapped shape
        if (mounted) setData(mapped ?? null);
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err.message ?? "Failed to load");
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
          <div className={`flex items-center mt-2 text-sm ${stat.positive ? "text-trading-profit" : "text-trading-loss"}`}>
            {stat.positive ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="font-medium">{stat.change}</span>
            <span className="text-muted-foreground ml-1">{stat.changePercent}</span>
          </div>
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
        </div>
        <div className="h-12 w-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}
