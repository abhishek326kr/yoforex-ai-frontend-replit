import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MultiAnalysisResponse, Provider } from '@/lib/api/aiMulti';

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
          {Object.entries(result.analysis || {}).map(([prov, payload]) => (
            <div key={prov} className="p-3 rounded-md border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{PROVIDER_LABELS[prov] || prov}</span>
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
      </Card>
    </div>
  );
}
