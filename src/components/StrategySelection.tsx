import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
// import { useState } from "react";
import { StrategyItem } from "./StrategyItem";


interface StrategySelectionProps {
  selectedStrategy: string;
  onStrategySelect: (strategy: string) => void;
}

export default function StrategySelection({ selectedStrategy, onStrategySelect }: StrategySelectionProps) {

    

    
    const strategies = [
        { name: "Breakout Strategy", credits: 2, winRate: 68, risk: "Medium", tier: "free" },
        { name: "Fibonacci Retracement", credits: 2, winRate: 72, risk: "Low", tier: "free" },
        { name: "Trend Following", credits: 2, winRate: 75, risk: "Low", tier: "free" },
        { name: "ICT Concept", credits: 5, winRate: 81, risk: "Medium", tier: "pro" },
        { name: "SMC Strategy", credits: 5, winRate: 79, risk: "Medium", tier: "pro" },
        { name: "Advanced SMC", credits: 8, winRate: 84, risk: "High", tier: "max" },
        { name: "Volatility Breakout", credits: 10, winRate: 86, risk: "Variable", tier: "max" },
        { name: "Carry Trade", credits: 10, winRate: 86, risk: "Variable", tier: "max" },
        { name: "Options Straddle", credits: 10, winRate: 86, risk: "Variable", tier: "max" },
        { name: "Momentum", credits: 10, winRate: 86, risk: "Variable", tier: "max" },
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
                                        credits={strategy.credits}
                                        winRate={strategy.winRate}
                                        risk={strategy.risk}
                                        tier={strategy.tier}
                                        isSelected={selectedStrategy === strategy.name}
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
                                        credits={strategy.credits}
                                        winRate={strategy.winRate}
                                        risk={strategy.risk}
                                        tier={strategy.tier}
                                        isSelected={selectedStrategy === strategy.name}
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
                                        isDisabled={false}
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