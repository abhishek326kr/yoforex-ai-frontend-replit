import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { X } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { Clock } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { Minimize2 } from "lucide-react";
import { Maximize2 } from "lucide-react";
import { SlidersHorizontal } from "lucide-react";
import { PencilRuler } from "lucide-react";
import { LayoutGrid } from "lucide-react";
import { Brain } from "lucide-react";
import { useState } from "react";
import TradingViewWidget from "./charts/TradingViewWidget";

interface TradingChartProps {
    selectedPair: string;
    selectedTimeframe: string;
    onCandleDataUpdate?: (data: any[]) => void;
}

export function TradingChart({ selectedPair, selectedTimeframe }: TradingChartProps) {
    const [isChartExpanded, setIsChartExpanded] = useState(false);
    
    return (
        <div className={`transition-all duration-300 ${isChartExpanded ? 'fixed inset-0 z-50 m-4' : 'col-span-12 lg:col-span-6 flex flex-col'}`}>
            <Card className={`bg-gradient-glass backdrop-blur-sm border-border/20 flex flex-col ${isChartExpanded ? 'h-[calc(100vh-2rem)]' : 'h-[600px]'}`}>
                {/* Close button when expanded */}
                {isChartExpanded && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 z-50 bg-background/80 hover:bg-background"
                        onClick={() => setIsChartExpanded(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
                {/* Header with Pair and Controls */}
                <div className="p-4 border-b border-border/20 bg-card/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <BarChart3 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">{selectedPair}</h3>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-muted-foreground">Live Market Data</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="bg-muted/50 rounded-md px-2 py-1 flex items-center space-x-1">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-xs font-medium">{selectedTimeframe}</span>
                            </div>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground"
                                onClick={() => setIsChartExpanded(!isChartExpanded)}
                            >
                                {isChartExpanded ? (
                                    <Minimize2 className="h-4 w-4" />
                                ) : (
                                    <Maximize2 className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Chart Container */}
                <div className="flex-1 relative group">
                    {/* Expand Button - Only shows when hovering over the top-right corner */}
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-background/80 backdrop-blur-sm shadow-md" 
                            onClick={() => setIsChartExpanded(!isChartExpanded)}
                        >
                            {isChartExpanded ? (
                                <>
                                    <Minimize2 className="h-4 w-4 mr-2" />
                                    Minimize Chart
                                </>
                            ) : (
                                <>
                                    <Maximize2 className="h-4 w-4 mr-2" />
                                    Expand Chart
                                </>
                            )}
                        </Button>
                    </div>

                    {/* TradingView Chart */}
                    <div className="h-full w-full">
                        <TradingViewWidget 
                            symbol={selectedPair}
                            interval={selectedTimeframe}
                            theme="dark"
                            style="1"
                            
                            
                        />
                    </div>
                </div>

                {/* Chart Controls */}
                {/* <div className="p-3 border-t border-border/20 bg-card/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                                <span className="text-xs">Indicators</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                <PencilRuler className="h-4 w-4 mr-1.5" />
                                <span className="text-xs">Drawing</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                <LayoutGrid className="h-4 w-4 mr-1.5" />
                                <span className="text-xs">Layouts</span>
                            </Button>
                        </div>
                        <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-opacity">
                            <Brain className="h-4 w-4 mr-2" />
                            <span className="font-medium">AI Analysis</span>
                        </Button>
                    </div>
                </div> */}
            </Card>
        </div>
    );
}