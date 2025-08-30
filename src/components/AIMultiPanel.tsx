import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Zap } from 'lucide-react';
import { fetchModelsCatalog, runMultiAnalysis, type Provider, type MultiAnalysisResponse } from '@/lib/api/aiMulti';

interface AIMultiPanelProps {
  pair: string;
  timeframe: string;
  strategy: string;
  onResult?: (result: MultiAnalysisResponse) => void;
  onConfigChange?: (config: { provider: Provider; models: Partial<Record<Provider, string>> }) => void;
}

const PROVIDER_LABELS: Record<Provider, string> = {
  gemini: 'Gemini',
  claude: 'Claude',
  deepseek: 'DeepSeek',
  openai: 'OpenAI',
  mistral: 'Mistral',
  cohere: 'Cohere',
  xai: 'xAI',
};

export default function AIMultiPanel({ pair, timeframe, strategy, onResult, onConfigChange }: AIMultiPanelProps) {
  const [catalog, setCatalog] = useState<Record<string, string[]>>({});
  const [selectedProvider, setSelectedProvider] = useState<Provider>('gemini');
  const [models, setModels] = useState<Partial<Record<Provider, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MultiAnalysisResponse | null>(null);

  // Load model catalog once
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchModelsCatalog();
        setCatalog(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load models catalog');
      }
    })();
  }, []);

  const providerModels = catalog[selectedProvider] || [];
  const needsExplicitModel = selectedProvider === 'openai' && providerModels.length > 0;
  const hasSelectedModel = !!models[selectedProvider];
  const canRun = useMemo(
    () => !!pair && !!timeframe && !!strategy && !!selectedProvider && (!needsExplicitModel || hasSelectedModel),
    [pair, timeframe, strategy, selectedProvider, needsExplicitModel, hasSelectedModel]
  );

  const handleModelChange = (prov: Provider, value: string) => {
    setModels(prev => ({ ...prev, [prov]: value }));
  };

  const run = async () => {
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const data = await runMultiAnalysis({ providers: [selectedProvider], pair, timeframe, strategy, models });
      setResult(data);
      onResult?.(data);
    } catch (e: any) {
      const msg = e?.message || 'Failed to run AI multi analysis';
      // Improve common OpenAI messages
      const enhanced = /insufficient_quota|quota/i.test(msg)
        ? 'OpenAI quota exceeded. Select a different provider/model or check billing.'
        : /model_not_found|does not exist/i.test(msg)
        ? 'Selected OpenAI model is unavailable for this account. Choose a different model.'
        : msg;
      setError(enhanced);
    } finally {
      setLoading(false);
    }
  };

  // Auto-select first available model when switching providers (helps avoid invalid defaults)
  useEffect(() => {
    const list = catalog[selectedProvider];
    if (list && list.length > 0 && !models[selectedProvider]) {
      setModels(prev => ({ ...prev, [selectedProvider]: list[0] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvider, catalog]);

  // Notify parent when provider or models change
  useEffect(() => {
    onConfigChange?.({ provider: selectedProvider, models });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvider, models]);

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Multi-Provider AI Analysis</h3>
        <Button onClick={run} disabled={!canRun || loading} className="bg-gradient-primary">
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Zap className="h-4 w-4 mr-2"/>}
          {loading ? 'Running...' : 'Run'}
        </Button>
      </div>

      {/* Provider (single-select) */}
      <div>
        <RadioGroup value={selectedProvider} onValueChange={(v) => setSelectedProvider(v as Provider)} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(PROVIDER_LABELS) as Provider[]).map((p) => (
            <label key={p} className="flex items-center gap-2 text-sm border rounded-md p-2 cursor-pointer">
              <RadioGroupItem id={`prov-${p}`} value={p} />
              <span>{PROVIDER_LABELS[p]}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Model for selected provider (optional override; required for OpenAI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm w-20">{PROVIDER_LABELS[selectedProvider]}</span>
          <Select value={models[selectedProvider] || ''} onValueChange={(v) => handleModelChange(selectedProvider, v)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder={needsExplicitModel ? 'Select a model (required)' : 'Default model'} />
            </SelectTrigger>
            <SelectContent>
              {(catalog[selectedProvider] || []).map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status */}
      {!loading && error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">Pair: {result.pair} • TF: {result.granularity}</div>
          <div className="space-y-3">
            {Object.entries(result.analysis || {}).map(([prov, payload]) => (
              <div key={prov} className="p-3 rounded-md border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{PROVIDER_LABELS[prov as Provider] || prov}</span>
                  {payload?.signal && (
                    <Badge className={payload.signal === 'BUY' ? 'bg-green-500 text-white' : payload.signal === 'SELL' ? 'bg-red-500 text-white' : ''}>
                      {payload.signal}
                    </Badge>
                  )}
                </div>
                {payload?.recommendation ? (
                  <div className="text-sm text-foreground/80">{payload.recommendation}</div>
                ) : (
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-muted-foreground">{JSON.stringify(payload, null, 2)}</pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
