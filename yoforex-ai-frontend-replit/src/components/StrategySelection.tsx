import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
// import { useState } from "react";
import { StrategyItem } from "./StrategyItem";
import { useBillingSummary } from "@/hooks/useBillingSummary";

interface StrategySelectionProps {
  selectedStrategy: string;
  onStrategySelect: (strategy: string) => void;
}

export default function StrategySelection({ selectedStrategy, onStrategySelect }: StrategySelectionProps) {
  const { data: billing } = useBillingSummary();
  const currentPlan = (billing?.plan || 'free').toLowerCase() as 'free' | 'pro' | 'max';
  const planRank: Record<'free' | 'pro' | 'max', number> = { free: 0, pro: 1, max: 2 };
  const tierAllowed = (tier: 'free' | 'pro' | 'max') => planRank[currentPlan] >= planRank[tier];

  const strategies = [
    { name: "Breakout Strategy", winRate: 68, risk: "Medium", tier: "free" as const },
    { name: "Fibonacci Retracement", winRate: 72, risk: "Low", tier: "free" as const },
    { name: "Trend Following", winRate: 75, risk: "Low", tier: "free" as const },
    { name: "ICT Concept", winRate: 81, risk: "Medium", tier: "pro" as const },
    { name: "SMC Strategy", winRate: 79, risk: "Medium", tier: "pro" as const },
    { name: "Advanced SMC", winRate: 84, risk: "High", tier: "max" as const },
    { name: "Volatility Breakout", winRate: 86, risk: "Variable", tier: "max" as const },
    { name: "Carry Trade", winRate: 86, risk: "Variable", tier: "max" as const },
    { name: "Options Straddle", winRate: 86, risk: "Variable", tier: "max" as const },
    { name: "Momentum", winRate: 86, risk: "Variable", tier: "max" as const },
  ];

  const handleStrategyClick = (strategyName: string) => {
    onStrategySelect(strategyName === selectedStrategy ? '' : strategyName);
  };

  return (
    <Card className="p-4 bg-gradient-glass backdrop-blur-sm border-border/20 flex-shrink-0 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3>Select any one of them</h3>
        <Badge variant="outline">{selectedStrategy ? 1 : 0}/1</Badge>
      </div>
      <Accordion type="multiple" defaultValue={['free']} className="space-y-2">
        {/* Free Tier Strategies */}
        <AccordionItem value="free" className="overflow-hidden rounded-lg border border-border/20">
          <AccordionTrigger className="group flex w-full items-center justify-between p-3 text-sm font-medium transition-all hover:bg-secondary/30 [&[data-state=open]>svg]:rotate-180">
            <div className="flex items-center space-x-2">
              <span>Free Tier</span>
              <Badge variant="outline" className="text-xs">
                {strategies.filter(s => s.tier === 'free').length} strategies
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden">
            <div className="p-3 pt-0 space-y-2">
              {strategies
                .filter(strategy => strategy.tier === 'free')
                .map((strategy) => (
                  <StrategyItem
                    key={strategy.name}
                    name={strategy.name}
                    winRate={strategy.winRate}
                    risk={strategy.risk}
                    tier={strategy.tier}
                    isSelected={selectedStrategy === strategy.name}
                    isDisabled={!tierAllowed('free')}
                    onClick={() => handleStrategyClick(strategy.name)}
                  />
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Pro Tier Strategies */}
        <AccordionItem value="pro" className="overflow-hidden rounded-lg border border-primary/30">
          <AccordionTrigger className="group flex w-full items-center justify-between p-3 text-sm font-medium transition-all hover:bg-primary/5 [&[data-state=open]>svg]:rotate-180">
            <div className="flex items-center space-x-2">
              <span>Pro Tier</span>
              <Badge variant="secondary" className="text-xs">
                {strategies.filter(s => s.tier === 'pro').length} strategies
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden">
            <div className="p-3 pt-0 space-y-2">
              {strategies
                .filter(strategy => strategy.tier === 'pro')
                .map((strategy) => (
                  <StrategyItem
                    key={strategy.name}
                    name={strategy.name}
                    winRate={strategy.winRate}
                    risk={strategy.risk}
                    tier={strategy.tier}
                    isSelected={selectedStrategy === strategy.name}
                    isDisabled={!tierAllowed('pro')}
                    onClick={() => handleStrategyClick(strategy.name)}
                  />
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Max Tier Strategies */}
        <AccordionItem value="max" className="overflow-hidden rounded-lg border border-amber-500/30">
          <AccordionTrigger className="group flex w-full items-center justify-between p-3 text-sm font-medium transition-all hover:bg-amber-500/5 [&[data-state=open]>svg]:rotate-180">
            <div className="flex items-center space-x-2">
              <span>Max Tier</span>
              <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/20">
                {strategies.filter(s => s.tier === 'max').length} premium strategies
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden">
            <div className="p-3 pt-0 space-y-2">
              {strategies
                .filter(strategy => strategy.tier === 'max')
                .map((strategy) => (
                  <StrategyItem
                    key={strategy.name}
                    strategy={strategy}
                    isSelected={selectedStrategy === strategy.name}
                    isDisabled={!tierAllowed('max')}
                    onSelect={onStrategySelect}
                  />
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}