import { Card } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { getTradingPairs } from "@/utils/trading";
import { DollarSign, BarChart3, Zap } from "lucide-react";

type MarketType = 'forex' | 'crypto' | 'indices' | 'commodities';

const generateMarketData = (pairs: string[]) =>
    pairs.map(pair => ({
        pair,
        price: (Math.random() * 100).toFixed(4),
        change: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 0.5).toFixed(4)}`,
        positive: Math.random() > 0.5,
        favorite: Math.random() > 0.7
    }));

interface MarketSelectionProps {
    selectedPair: string;
    onPairSelect: (pair: string) => void;
}

function MarketSelection({ selectedPair, onPairSelect }: MarketSelectionProps) {
    const [selectedMarket, setSelectedMarket] = useState<MarketType>('forex');
    const [searchQuery, setSearchQuery] = useState('');

    const { forex, crypto, indices, commodities } = getTradingPairs();
    
    const marketData = {
        forex: generateMarketData(forex || []),
        crypto: generateMarketData(crypto || []),
        indices: generateMarketData(indices || []),
        commodities: generateMarketData(commodities || [])
    };

    // Filter pairs based on search query
    const filteredMarketData = marketData[selectedMarket].filter(pair => 
        pair.pair.toLowerCase().includes(searchQuery.toLowerCase())
    );

    

    return (
        <Card className="bg-gradient-glass backdrop-blur-sm border-border/20 relative z-10">
            <Accordion type="single" collapsible defaultValue="market-selection" className="w-full">
                <AccordionItem value="market-selection" className="border-0">
                    <div className="bg-gradient-to-r from-primary/5 to-transparent px-4 py-3">
                        <AccordionTrigger className="hover:no-underline p-0">
                            <h3 className="text-lg font-semibold text-foreground">Market Selection</h3>
                        </AccordionTrigger>
                    </div>
                    <AccordionContent className="px-4 pb-4 pt-2 relative z-20">
                        {/* Currency Pair Tabs */}
                        {/* Market Type Selection - Responsive Button Group */}
                        <div className="w-full overflow-x-auto pb-2 mb-4 scrollbar-thin scrollbar-primary">
                            <div className="flex space-x-2 w-max min-w-full">
                                <Button
                                    variant={selectedMarket === 'forex' ? 'default' : 'outline'}
                                    size="sm"
                                    className="whitespace-nowrap flex-shrink-0"
                                    onClick={() => setSelectedMarket('forex')}
                                >
                                    Forex
                                </Button>
                                <Button
                                    variant={selectedMarket === 'crypto' ? 'default' : 'outline'}
                                    size="sm"
                                    className="whitespace-nowrap flex-shrink-0"
                                    onClick={() => setSelectedMarket('crypto')}
                                >
                                    Crypto
                                </Button>
                                <Button
                                    variant={selectedMarket === 'indices' ? 'default' : 'outline'}
                                    size="sm"
                                    className="whitespace-nowrap flex-shrink-0"
                                    onClick={() => setSelectedMarket('indices')}
                                >
                                    Indices
                                </Button>
                                <Button
                                    variant={selectedMarket === 'commodities' ? 'default' : 'outline'}
                                    size="sm"
                                    className="whitespace-nowrap flex-shrink-0"
                                    onClick={() => setSelectedMarket('commodities')}
                                >
                                    Commodities
                                </Button>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input 
                                placeholder={`Search ${selectedMarket} pairs...`} 
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Market Pairs List */}
                        <div className="space-y-4 flex-1 pr-1 pb-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-primary">
                            {filteredMarketData.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground">
                                    No pairs found matching "{searchQuery}"
                                </div>
                            ) : (
                                filteredMarketData.map((pair, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted/50 ${selectedPair === pair.pair ? 'bg-muted/30' : ''}`}
                                    onClick={() => onPairSelect(pair.pair)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            {selectedMarket === 'crypto' ? (
                                                <Zap className="h-4 w-4 text-yellow-500" />
                                            ) : selectedMarket === 'indices' ? (
                                                <BarChart3 className="h-4 w-4 text-blue-500" />
                                            ) : (
                                                <DollarSign className="h-4 w-4 text-primary" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium">{pair.pair}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{pair.price}</p>
                                        <p className={`text-xs ${pair.positive ? 'text-trading-profit' : 'text-trading-loss'}`}>
                                            {pair.change}%
                                        </p>
                                    </div>
                                </div>
                            )))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    );
}

export default MarketSelection;
