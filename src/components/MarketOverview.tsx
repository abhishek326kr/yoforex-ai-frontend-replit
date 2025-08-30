import React, { useState, useEffect, useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TradingViewWidget from "@/components/charts/TradingViewWidget";
import { useTheme } from "@/hooks/useTheme";

type MarketItem = {
  pair: string;
  price: string;
  change: string;
  sentiment: "Bullish" | "Bearish" | "Neutral" | string;
};

export default function MarketOverview({ items }: { items?: MarketItem[] }) {
  const data: MarketItem[] = items ?? [
    { pair: "EUR/USD", price: "1.0847", change: "+0.23%", sentiment: "Bullish" },
    { pair: "GBP/USD", price: "1.2634", change: "-0.15%", sentiment: "Bearish" },
    { pair: "USD/JPY", price: "149.82", change: "+0.34%", sentiment: "Bullish" },
    { pair: "AUD/USD", price: "0.6542", change: "-0.08%", sentiment: "Neutral" },
  ];

  // TradingView Forex symbol list (from TradingView embed config)
  const forexSymbols = [
    { code: "FX:EURUSD", label: "EUR/USD" },
    { code: "FX:GBPUSD", label: "GBP/USD" },
    { code: "FX:USDJPY", label: "USD/JPY" },
    { code: "FX:USDCHF", label: "USD/CHF" },
    { code: "FX:AUDUSD", label: "AUD/USD" },
    { code: "FX:USDCAD", label: "USD/CAD" },
  ];

  const [selectedSymbol, setSelectedSymbol] = useState<string>(forexSymbols[0].code);
  const { theme } = useTheme();

  const effectiveTheme = useMemo(() => {
    if (theme === "system") return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    return theme === "dark" ? "dark" : "light";
  }, [theme]);
  const [prices, setPrices] = useState<Record<string, { price: number | null; prev?: number | null; changePerc?: number | null }>>(() => {
    const map: Record<string, { price: number | null }>= {} as any;
    forexSymbols.forEach((s) => (map[s.code] = { price: null }));
    return map;
  });

  const pollingRef = useRef<number | null>(null);

  // helper to fetch rate for a pair code like 'FX:EURUSD'
  const fetchRateFor = async (code: string) => {
    try {
      const [_, pair] = code.split(":");
      const base = pair.slice(0, 3);
      const quote = pair.slice(3);
      const url = `https://api.exchangerate.host/convert?from=${base}&to=${quote}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      // json.result holds the rate
      return Number(json.result ?? null);
    } catch (err) {
      // ignore errors per-pair
      return null;
    }
  };

  // fetch all pair rates and update state
  const fetchAllRates = async () => {
    const entries = await Promise.all(
      forexSymbols.map(async (s) => ({ code: s.code, rate: await fetchRateFor(s.code) }))
    );

    setPrices((prev) => {
      const next = { ...prev };
      for (const e of entries) {
        const old = prev[e.code]?.price ?? null;
        const rate = e.rate ?? null;
        if (rate == null) continue;
        const changePerc = old ? ((rate - old) / old) * 100 : null;
        next[e.code] = { price: rate, prev: old, changePerc };
      }
      return next;
    });
  };

  useEffect(() => {
    // initial fetch
    fetchAllRates();
    // set interval
    pollingRef.current = window.setInterval(fetchAllRates, 10000);
    return () => {
      if (pollingRef.current) window.clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helpers (avoid non-null assertions in JSX)
  const formatPrice = (code: string) => {
    const p = prices[code]?.price;
    return p != null ? p.toFixed(5) : "—";
  };

  const formatChange = (code: string) => {
    const c = prices[code]?.changePerc;
    return c != null ? `${c.toFixed(2)}%` : "—";
  };

  const changeClass = (code: string) => {
    const c = prices[code]?.changePerc;
    if (c == null) return "bg-muted";
    return c >= 0 ? "bg-trading-profit" : "bg-trading-loss";
  };

  const changeBarWidth = (code: string) => Math.min(Math.abs(prices[code]?.changePerc ?? 0) * 2, 100);

  return (
    <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/20 ">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Market Overview</h3>
          <p className="text-sm text-muted-foreground">Key forex pairs and market sentiment</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-trading-profit animate-pulse" />
          <span className="text-sm text-foreground">Markets Open</span>
        </div>
      </div>

      <div className="mb-4">
        {/* Forex pair selector */}
        <div className="mb-3 flex flex-wrap gap-2">
          {forexSymbols.map((s) => (
                <button
                  key={s.code}
                  onClick={() => setSelectedSymbol(s.code)}
                  className={`flex flex-col items-start p-3 rounded-md text-sm font-medium border ${selectedSymbol === s.code ? 'bg-primary text-white border-primary' : 'bg-card/10 text-muted-foreground border-border/10'}`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span>{s.label}</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{formatPrice(s.code)}</div>
                      <div className="text-xs">{formatChange(s.code)}</div>
                    </div>
                  </div>
                  <div className="w-full mt-2 h-1 bg-muted/10 rounded-full overflow-hidden">
                    <div className={`h-full ${changeClass(s.code)}`} style={{ width: `${changeBarWidth(s.code)}%` }} />
                  </div>
                </button>
          ))}
        </div>

        {/* TradingView chart (market overview) */}
        <div className="w-full h-[360px] rounded-lg overflow-hidden border border-border/10 bg-card/20">
          <TradingViewWidget symbol={selectedSymbol} interval="60" theme={effectiveTheme as any} height={360} width="100%" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((item, index) => (
          <div key={index} className="p-4 rounded-lg bg-card/30 border border-border/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">{item.pair}</span>
              <Badge
                variant={
                  item.sentiment === "Bullish" ? "default" : item.sentiment === "Bearish" ? "destructive" : "secondary"
                }
                className="text-xs"
              >
                {item.sentiment}
              </Badge>
            </div>
            <p className="text-xl font-bold text-foreground">{item.price}</p>
            <p className={`text-sm ${item.change.startsWith("+") ? "text-trading-profit" : "text-trading-loss"}`}>{item.change}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
