import apiClient from "@/lib/api/client";
import { mapToOandaInstrument } from "@/utils/trading";
import { toast } from "react-toastify";

export type Provider =
  | "gemini"
  | "claude"
  | "deepseek"
  | "openai"
  | "mistral"
  | "cohere"
  | "xai";

export type TimeframeAPI =
  | "M1"
  | "M5"
  | "M15"
  | "M30"
  | "H1"
  | "H4"
  | "H8"
  | "D1"
  | "W1"
  | "M";

export type TradingStrategyApi =
  | "breakout"
  | "ict"
  | "advanced_smc"
  | "smc"
  | "fibonacci"
  | "trend_following"
  | "momentum"
  | "volatility_breakout"
  | "carry_trade"
  | "options_straddle";

export interface ModelsCatalog {
  [provider: string]: string[];
}

export interface MultiAnalysisResponse {
  pair: string;
  granularity: string;
  candles: any[];
  analysis: Record<string, any>; // keyed by provider
  billing?: {
    charged_credits: number;
    monthly_credits_remaining: number;
    daily_credits_spent: number;
  };
}

export interface RunMultiParams {
  providers: Provider[];
  pair: string; // UI pair e.g. "EUR/USD" or backend e.g. "EUR_USD"
  timeframe: string; // UI timeframe (we'll map)
  strategy: string; // UI label (we'll map)
  count?: number;
  models?: Partial<Record<Provider, string>>; // per-provider model override
}

// Local duplicate of the mapping used by analysis.ts
const formatStrategyForApi = (strategy: string): TradingStrategyApi => {
  switch (strategy) {
    case "Breakout Strategy":
      return "breakout";
    case "ICT Concept":
      return "ict";
    case "Advanced SMC":
      return "advanced_smc";
    case "SMC Strategy":
      return "smc";
    case "Fibonacci Retracement":
      return "fibonacci";
    case "Trend Following":
      return "trend_following";
    case "Momentum":
      return "momentum";
    case "Volatility Breakout":
      return "volatility_breakout";
    case "Carry Trade":
      return "carry_trade";
    case "Options Straddle":
      return "options_straddle";
    default:
      return "breakout";
  }
};

// Local copy of timeframe mapping used by analysis.ts
const toApiTimeframe = (timeframe: string): TimeframeAPI => {
  const apiFormats = new Set([
    "M1",
    "M5",
    "M15",
    "M30",
    "H1",
    "H4",
    "D1",
    "W1",
    "M",
  ]);
  if (apiFormats.has(timeframe)) return timeframe as TimeframeAPI;
  switch (timeframe) {
    case "1M":
      return "M1";
    case "5M":
      return "M5";
    case "15M":
      return "M15";
    case "30M":
      return "M30";
    case "1H":
      return "H1";
    case "4H":
      return "H4";
    // case '8H': return 'H8';
    case "1D":
      return "D1";
    case "1W":
      return "W1";
    case "1MO":
      return "M";
    case "1":
      return "M1";
    case "5":
      return "M5";
    case "15":
      return "M15";
    case "30":
      return "M30";
    case "60":
      return "H1";
    case "240":
      return "H4";
    case "D":
      return "D1";
    case "W":
      return "W1";
    case "M":
      return "M";
    default:
      return "H1";
  }
};

export async function fetchModelsCatalog(): Promise<ModelsCatalog> {
  const res = await apiClient.get<ModelsCatalog>(
    "/analysis/strategy/ai/models",
    {
      headers: { Accept: "application/json" },
    }
  );
  return res.data;
}

const getProvider = (models: Partial<Record<string, string>>): string => {
    const modelKeys = Object.keys(models);
    const firstProvider = modelKeys[0];
    if (!firstProvider) throw new Error("No provider found");
    return firstProvider;
}

export async function runMultiAnalysis(
  params: RunMultiParams
): Promise<MultiAnalysisResponse> {
  const { providers, pair, timeframe, strategy, count = 100, models } = params;
  const formattedPair = mapToOandaInstrument(pair);
  const granularity = toApiTimeframe(timeframe);
  const strategyApi = formatStrategyForApi(strategy);

  const qp = new URLSearchParams();
 providers.forEach((p) => qp.append("providers", p));
  
  qp.append("strategy", strategyApi);
  qp.append("pair", formattedPair);
  qp.append("granularity", granularity);
  qp.append("count", String(count));

  // Also include optional per-provider model query params expected by backend
  // (gemini_model, claude_model, deepseek_model, openai_model, mistral_model, cohere_model, xai_model)
  const perProviderQueryMap: Record<string, string> = {};
  if (models) {
    if (models.gemini) perProviderQueryMap["gemini_model"] = models.gemini;
    if (models.claude) perProviderQueryMap["claude_model"] = models.claude;
    if (models.deepseek)
      perProviderQueryMap["deepseek_model"] = models.deepseek;
    if (models.openai) perProviderQueryMap["openai_model"] = models.openai;
    if (models.mistral) perProviderQueryMap["mistral_model"] = models.mistral;
    if (models.cohere) perProviderQueryMap["cohere_model"] = models.cohere;
    if (models.xai) perProviderQueryMap["xai_model"] = models.xai;
  }
  Object.entries(perProviderQueryMap).forEach(([k, v]) => qp.append(k, v));

  const url = `/analysis/strategy/ai/multi?${qp.toString()}`;
  // Body should contain a mapping of provider -> model slug when provided
  const body =
    models && Object.keys(models).length > 0 ? { models } : undefined;

  

  // Retry logic for transient errors (network/timeout/5xx)
  const maxRetries = 2;
  let lastErr: any;
  const provider = getProvider(models as Partial<Record<string, string>>);
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await apiClient.post<MultiAnalysisResponse>(url, body, {
        headers: { Accept: "application/json" },
        timeout: 400000000,
        // Treat only 2xx as success; 4xx should throw and be handled below
        validateStatus: (s) => s >= 200 && s < 300,
      });
      const data = response.data as any;
      // Basic shape validation to avoid propagating HTML/text errors
      const looksValid =
        data &&
        typeof data === "object" &&
        "analysis" in data &&
        "pair" in data &&
        "granularity" in data;
      if (!looksValid) {
        const raw = typeof data === "string" ? data : JSON.stringify(data);
        throw new Error(
          `Invalid AI multi-analysis response: ${raw?.slice(0, 500)}`
        );
      }

      const provStatus = data?.analysis?.[provider]?.status;
      if (provStatus && [500, 501, 502].includes(Number(provStatus))) {
        const provError = data?.analysis?.[provider]?.error;
        toast.error(provError);
        throw new Error(`Error! ${provError}`);
      }

      return data as MultiAnalysisResponse;
    } catch (e: any) {
      lastErr = e;
      const status = e?.status || e?.response?.status;
      const isTimeout =
        e?.code === "ECONNABORTED" || /timeout/i.test(e?.message || "");
      const isNetwork = !e?.response && e?.request;
      const isServer = status && status >= 500 && status < 600;

      const retryable = isTimeout || isNetwork || isServer;
      if (!retryable || attempt === maxRetries) {
        throw e;
      }
      const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}
