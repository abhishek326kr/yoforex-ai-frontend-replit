import { Card } from "./ui/card"
import { Button } from "./ui/button"

// UI timeframes and their corresponding TradingView intervals
const TIMEFRAME_MAP: { [key: string]: string } = {
  '1M': '1',
  '5M': '5',
  '15M': '15',
  '30M': '30',
  '1H': '60',
  '4H': '240',
  '1D': 'D',
  '1W': 'W',
  '1MO': 'M'
};

// Get display timeframes in the order we want to show them
const DISPLAY_TIMEFRAMES = Object.keys(TIMEFRAME_MAP);

// Helper to get TradingView interval from UI timeframe
const getTradingViewInterval = (timeframe: string): string => {
  return TIMEFRAME_MAP[timeframe] || '60'; // Default to 1H if not found
};

// Helper to get UI timeframe from TradingView interval
const getUITimeframe = (interval: string): string => {
  const found = Object.entries(TIMEFRAME_MAP).find(([_, value]) => value === interval);
  return found ? found[0] : '1H'; // Default to 1H if not found
};

interface TimeframeSelectionProps {
    selectedTimeframe: string; // This should be the TradingView interval (e.g., '1', '5', '60', 'D', 'W', 'M')
    onTimeframeSelect: (timeframe: string) => void; // Should receive TradingView interval
}

export default function TimeframeSelection({ selectedTimeframe, onTimeframeSelect }: TimeframeSelectionProps) {
    const handleTimeframeSelect = (uiTimeframe: string) => {
        const tradingViewInterval = getTradingViewInterval(uiTimeframe);
        onTimeframeSelect(tradingViewInterval);
    };
    
    // Convert the selected TradingView interval back to UI timeframe for display
    const selectedUITimeframe = getUITimeframe(selectedTimeframe);
    
    return (
        <Card className="p-4 bg-gradient-glass backdrop-blur-sm border-border/20 flex-shrink-0">
            <h3 className="text-lg font-semibold text-foreground mb-4">Timeframe</h3>
            <div className="grid grid-cols-3 gap-2">
                {DISPLAY_TIMEFRAMES.map((uiTimeframe) => {
                    const isSelected = uiTimeframe === selectedUITimeframe;
                    
                    return (
                        <Button
                            key={uiTimeframe}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className={isSelected ? "bg-gradient-primary" : ""}
                            onClick={(e) => {
                                e.preventDefault();
                                handleTimeframeSelect(uiTimeframe);
                            }}
                        >
                            {uiTimeframe}
                        </Button>
                    );
                })}
            </div>
        </Card>
    );
}