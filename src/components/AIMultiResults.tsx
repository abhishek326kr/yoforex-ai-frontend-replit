import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MultiAnalysisResponse, Provider } from '@/lib/api/aiMulti';
import { AnalysisDisplay } from '@/components/AnalysisDisplay';
import { toast } from 'react-toastify';

const PROVIDER_LABELS: Record<string, string> = {
  gemini: 'Gemini',
  claude: 'Claude',
  deepseek: 'DeepSeek',
  openai: 'OpenAI',
  mistral: 'Mistral',
  cohere: 'Cohere',
  xai: 'xAI',
};

interface AIMultiResultsProps {
  result: MultiAnalysisResponse | null;
}

export default function AIMultiResults({ result }: AIMultiResultsProps) {
  if (!result) return null;

  return (
    <div className="space-y-3 mt-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-sm">AI Providers Results</h4>
          <span className="text-xs text-muted-foreground">{result.pair} • {result.granularity}</span>
        </div>
        <div className="space-y-3">
          {Object.entries(result.analysis || {}).map(([prov, payload]) => {
            const normalized = normalizeAnalysisPayload(payload);
            const errorText = !normalized ? extractErrorText(payload) : null;
            return (
              <div key={prov} className="p-3 rounded-md border border-border/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">{PROVIDER_LABELS[prov] || prov}</span>
                  {normalized && (
                    <Badge className={
                      normalized.signal === 'BUY'
                        ? 'bg-green-500 text-white'
                        : normalized.signal === 'SELL'
                          ? 'bg-red-500 text-white'
                          : 'bg-amber-500 text-white'
                    }>
                      {normalized.signal}
                    </Badge>
                  )}
                </div>
                {normalized ? (
                  <AnalysisDisplay analysis={normalized} />
                ) : errorText ? (
                  <div className="text-sm text-red-400/90 bg-red-500/5 border border-red-500/20 rounded-md p-3 whitespace-pre-wrap">
                    {errorText}
                  </div>
                ) : (
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-muted-foreground">{JSON.stringify(payload, null, 2)}</pre>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// Types mirrored from AnalysisDisplay props to validate and coerce provider payloads
type Signal = 'BUY' | 'SELL' | 'HOLD';
type AnalysisShape = {
  signal: Signal;
  confidence: number;
  entry: number;
  stop_loss: number;
  take_profit: number;
  risk_reward_ratio: string;
  timeframe: string;
  technical_analysis: Record<string, unknown>;
  recommendation: string;
};

function normalizeAnalysisPayload(payload: any): AnalysisShape | null {
  if (!payload || typeof payload !== 'object') return null;

<<<<<<< HEAD
=======
  // Handle Gemini response format
  if (payload.candidates && Array.isArray(payload.candidates)) {
    try {
      const firstCandidate = payload.candidates[0];
      if (firstCandidate?.content?.parts?.[0]?.text) {
        const jsonText = firstCandidate.content.parts[0].text;
        // Remove markdown code block markers if present
        const cleanJson = jsonText.replace(/^```json\n|\n```$/g, '');
        payload = JSON.parse(cleanJson);
      }
    } catch (e) {
      console.error('Failed to parse Gemini response:', e);
      return null;
    }
  }

>>>>>>> puspal
  // Accept both number and numeric string inputs, coerce safely
  const toNum = (v: any): number | null => {
    if (v === null || v === undefined) return null;
    const n = typeof v === 'number' ? v : parseFloat(String(v));
    return Number.isFinite(n) ? n : null;
  };

  const signalRaw = String(payload.signal || '').toUpperCase();
  const signal: Signal = signalRaw === 'BUY' || signalRaw === 'SELL' || signalRaw === 'STRADDLE_BUY' || signalRaw === 'STRADDLE_SELL' ? 
    (signalRaw.includes('BUY') ? 'BUY' : signalRaw.includes('SELL') ? 'SELL' : signalRaw as Signal) : 'HOLD';
  
  const confidence = toNum(payload.confidence);
  
  // Handle Options Straddle specific fields
  let entry, stop_loss, take_profit;
  
  if (payload.call_entry && payload.put_entry) {
    // Options Straddle strategy - map specific fields
    entry = toNum(payload.call_entry) || toNum(payload.put_entry) || 0;
    stop_loss = toNum(payload.breakeven_lower) || 0;
    take_profit = toNum(payload.breakeven_upper) || 0;
  } else {
    // Standard strategy fields
    entry = toNum(payload.entry);
    stop_loss = toNum(payload.stop_loss);
    take_profit = toNum(payload.take_profit);
  }

  // Minimal required fields to render nicely
  if (confidence === null || entry === null || stop_loss === null || take_profit === null) {
    return null;
  }

  const risk_reward_ratio = payload.risk_reward_ratio ? String(payload.risk_reward_ratio) : '1:1';
  const timeframe = payload.timeframe ? String(payload.timeframe) : '';
  const recommendation = payload.recommendation ? String(payload.recommendation) : '';
  const technical_analysis = (payload.technical_analysis && typeof payload.technical_analysis === 'object')
    ? payload.technical_analysis as Record<string, unknown>
    : {};

  return {
    signal,
    confidence,
    entry,
    stop_loss,
    take_profit,
    risk_reward_ratio,
    timeframe,
    technical_analysis,
    recommendation
  };
}

// Attempt to extract a human-readable error message from provider payloads
function extractErrorText(payload: any): string | null {
  try {
    // If payload itself is a string, try JSON parse, else return trimmed
    if (typeof payload === 'string') {
      try {
        const parsed = JSON.parse(payload);
        return extractErrorText(parsed);
      } catch {
        return payload.trim();
      }
    }

<<<<<<< HEAD
=======
    // Handle Gemini response format
    if (payload.candidates && Array.isArray(payload.candidates)) {
      try {
        const firstCandidate = payload.candidates[0];
        if (firstCandidate?.content?.parts?.[0]?.text) {
          const jsonText = firstCandidate.content.parts[0].text;
          // Remove markdown code block markers if present
          const cleanJson = jsonText.replace(/^```json\n|\n```$/g, '');
          const parsed = JSON.parse(cleanJson);
          return extractErrorText(parsed);
        }
      } catch (e) {
        console.error('Failed to parse Gemini response:', e);
      }
    }

>>>>>>> puspal
    if (!payload || typeof payload !== 'object') return null;

    // Common shapes
    const maybeStrings: any[] = [
      payload.error,
      payload.detail,
      payload.message,
      payload?.error?.message,
      payload?.details?.message,
    ].filter(v => v != null);

    for (const v of maybeStrings) {
      if (typeof v === 'string') {
        // Often the API returns a JSON string inside error
        try {
          const parsed = JSON.parse(v);
          const nested = extractErrorText(parsed);
          if (nested) return nested;
        } catch {
          console.log("No JSON response!");
        }
        // Strip quotes/escapes/newlines
        return v.replace(/\\n/g, '\n').replace(/^"|"$/g, '').trim();
      }
      if (v && typeof v === 'object') {
        const msg = v.message || v.error || v.detail;
        if (typeof msg === 'string' && msg.trim()) return msg.trim();
      }
    }

    // OpenAI-like nested structure { error: { message, type, param, code } }
    if (payload.error && typeof payload.error === 'object') {
      const e = payload.error as any;
      if (e.message) return String(e.message);
    }

    // Last resort: look for recognizable fields
    for (const key of ['msg', 'reason', 'description']) {
      if (payload[key]) return String(payload[key]);
    }

    return null;
  } catch {
    return null;
  }
}
