import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
<<<<<<< HEAD
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Zap } from 'lucide-react';
import { fetchModelsCatalog, runMultiAnalysis, type Provider, type MultiAnalysisResponse } from '@/lib/api/aiMulti';
=======
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { fetchModelsCatalog, type Provider, type MultiAnalysisResponse } from '@/lib/api/aiMulti';
import { Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
>>>>>>> cdeaa4e (aaj to phaad hi denge)

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
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MultiAnalysisResponse | null>(null);
=======
  // This component no longer executes runs itself; parent triggers execution.

  // Heuristic to treat certain models as paid/locked (non-clickable) per provider
  const PAID_PATTERNS: Partial<Record<Provider, RegExp[]>> = {
    openai: [/gpt-4/i, /gpt-4o(?!-mini)/i, /gpt-4\.1(?!-mini)/i, /gpt-4-turbo/i, /o1/i, /o3/i, /omni/i],
    claude: [/claude-3\.5/i, /claude-3-7/i, /sonnet-4/i, /opus/i],
    mistral: [/mistral-large/i],
    // Lock all Cohere models present in backend catalog
    cohere: [/^command$/i, /^command-?r$/i, /^command-?r-?plus$/i],
    // Gemini paid: pro tiers; keep flash SKUs unlocked
    gemini: [/^gemini-?2\.5-?pro$/i],
    deepseek: [/coder-v2\+/i, /reasoner/i],
  };

  const isPaidModel = (provider: Provider, model: string) => {
    // Lock ALL Claude models
    if (provider === 'claude') return true;
    const patterns = PAID_PATTERNS[provider] || [];
    return patterns.some((re) => re.test(model));
  };

  const firstFreeModelForProvider = (provider: Provider): string | undefined => {
    const list = catalog[provider] || [];
    return list.find((m) => !isPaidModel(provider, m));
  };

  const isProviderLocked = (provider: Provider): boolean => {
    if (provider === 'claude') return true;
    const list = catalog[provider] || [];
    return list.length > 0 && list.every((m) => isPaidModel(provider, m));
  };

  const hasFreeModel = (provider: Provider): boolean => {
    const list = catalog[provider] || [];
    return list.some((m) => !isPaidModel(provider, m));
  };
>>>>>>> cdeaa4e (aaj to phaad hi denge)

  // Load model catalog once
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchModelsCatalog();
        setCatalog(data);
      } catch (e: any) {
<<<<<<< HEAD
        setError(e?.message || 'Failed to load models catalog');
=======
        // Silently ignore catalog errors; parent will surface errors on run.
>>>>>>> cdeaa4e (aaj to phaad hi denge)
      }
    })();
  }, []);

  const providerModels = catalog[selectedProvider] || [];
  const needsExplicitModel = selectedProvider === 'openai' && providerModels.length > 0;
  const hasSelectedModel = !!models[selectedProvider];
<<<<<<< HEAD
  const canRun = useMemo(
    () => !!pair && !!timeframe && !!strategy && !!selectedProvider && (!needsExplicitModel || hasSelectedModel),
    [pair, timeframe, strategy, selectedProvider, needsExplicitModel, hasSelectedModel]
  );
=======
  const canRun = useMemo(() => {
    if (!pair || !timeframe || !strategy || !selectedProvider) return false;
    if (isProviderLocked(selectedProvider)) return false;
    const selectedModel = models[selectedProvider];
    if (selectedModel && isPaidModel(selectedProvider, selectedModel)) return false;
    if (needsExplicitModel) return !!hasSelectedModel && !isPaidModel(selectedProvider, selectedModel!);
    // If catalog has entries for this provider, ensure at least one free model exists
    const list = catalog[selectedProvider] || [];
    if (list.length > 0) return hasFreeModel(selectedProvider);
    // No catalog info, allow run (backend may have defaults)
    return true;
  }, [pair, timeframe, strategy, selectedProvider, needsExplicitModel, hasSelectedModel, models, catalog]);
>>>>>>> cdeaa4e (aaj to phaad hi denge)

  const handleModelChange = (prov: Provider, value: string) => {
    setModels(prev => ({ ...prev, [prov]: value }));
  };

<<<<<<< HEAD
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
=======
  // Auto-select first FREE model when switching providers (avoid locked defaults)
  useEffect(() => {
    const free = firstFreeModelForProvider(selectedProvider);
    if (free && !models[selectedProvider]) {
      setModels(prev => ({ ...prev, [selectedProvider]: free }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvider, catalog]);

  // Sanitize selection: if a locked model is somehow selected, switch to first free (or unset)
  useEffect(() => {
    const current = models[selectedProvider];
    if (current && isPaidModel(selectedProvider, current)) {
      const free = firstFreeModelForProvider(selectedProvider);
      setModels(prev => ({ ...prev, [selectedProvider]: free }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [models, selectedProvider, catalog]);

  // If selected provider becomes locked (e.g., catalog loads), switch to the first provider with a free model
  useEffect(() => {
    if (!selectedProvider) return;
    if (!isProviderLocked(selectedProvider)) return;
    const providers = Object.keys(PROVIDER_LABELS) as Provider[];
    const fallback = providers.find((p) => !isProviderLocked(p) && hasFreeModel(p));
    if (fallback && fallback !== selectedProvider) {
      setSelectedProvider(fallback);
>>>>>>> cdeaa4e (aaj to phaad hi denge)
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
<<<<<<< HEAD
        <Button onClick={run} disabled={!canRun || loading} className="bg-gradient-primary">
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Zap className="h-4 w-4 mr-2"/>}
          {loading ? 'Running...' : 'Run'}
        </Button>
=======
        {/* Run is initiated from the Market Analysis card. */}
        <span className="text-xs text-muted-foreground">Configured via this panel</span>
>>>>>>> cdeaa4e (aaj to phaad hi denge)
      </div>

      {/* Provider (single-select) */}
      <div>
        <RadioGroup value={selectedProvider} onValueChange={(v) => setSelectedProvider(v as Provider)} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
<<<<<<< HEAD
          {(Object.keys(PROVIDER_LABELS) as Provider[]).map((p) => (
            <label key={p} className="flex items-center gap-2 text-sm border rounded-md p-2 cursor-pointer">
              <RadioGroupItem id={`prov-${p}`} value={p} />
              <span>{PROVIDER_LABELS[p]}</span>
            </label>
          ))}
=======
          {(Object.keys(PROVIDER_LABELS) as Provider[]).map((p) => {
            const lockedProv = isProviderLocked(p);
            return (
              <TooltipProvider key={p}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <label
                      className={`flex items-center gap-2 text-sm border rounded-md p-2 ${lockedProv ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                      title={lockedProv ? 'Paid provider — upgrade required' : undefined}
                    >
                      <RadioGroupItem id={`prov-${p}`} value={p} disabled={lockedProv} />
                      <span className="flex items-center gap-1">
                        {PROVIDER_LABELS[p]}
                        {lockedProv && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                      </span>
                    </label>
                  </TooltipTrigger>
                  {lockedProv && (
                    <TooltipContent side="top" className="text-xs">Paid provider — upgrade required</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
>>>>>>> cdeaa4e (aaj to phaad hi denge)
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
<<<<<<< HEAD
              {(catalog[selectedProvider] || []).map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
=======
              {(catalog[selectedProvider] || []).map((m) => {
                const locked = isPaidModel(selectedProvider, m);
                return (
                  <SelectItem
                    key={m}
                    value={m}
                    disabled={locked}
                    className="flex items-center justify-between"
                  >
                    {locked ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-between w-full" title="Paid model — upgrade required">
                              <span className="truncate mr-2">{m}</span>
                              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="text-xs">
                            Paid model — upgrade required
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="truncate mr-2">{m}</span>
                    )}
                  </SelectItem>
                );
              })}
>>>>>>> cdeaa4e (aaj to phaad hi denge)
            </SelectContent>
          </Select>
        </div>
      </div>
<<<<<<< HEAD

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
=======
>>>>>>> cdeaa4e (aaj to phaad hi denge)
    </Card>
  );
}
