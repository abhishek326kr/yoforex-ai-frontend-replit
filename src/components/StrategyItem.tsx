import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

interface StrategyItemProps {
  // Old props structure (for backward compatibility)
  strategy?: {
    name: string;
    winRate: number;
    risk: string;
    tier: string;
  };
  isSelected?: boolean;
  isDisabled?: boolean;
  onSelect?: (name: string) => void;
  
  // New props structure
  name?: string;
  winRate?: number;
  risk?: string;
  tier?: string;
  onClick?: () => void;
}

export function StrategyItem({ 
  strategy, 
  isSelected = false, 
  isDisabled = false, 
  onSelect,
  // New props
  name,
  winRate,
  risk,
  tier,
  onClick
}: StrategyItemProps) {
  // Use direct props if available, otherwise use strategy object
  const strategyName = name || strategy?.name || '';
  const strategyWinRate = winRate ?? strategy?.winRate ?? 0;
  const strategyRisk = risk ?? strategy?.risk ?? '';
  const strategyTier = tier ?? strategy?.tier ?? '';
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (onSelect && strategy) {
      onSelect(strategy.name);
    }
  };
  return (
    <div
      className={`p-3 rounded-lg border transition-all ${
        isSelected
          ? 'border-primary bg-primary/10 cursor-pointer'
          : isDisabled
          ? 'border-border/10 bg-muted/30 opacity-50 cursor-not-allowed'
          : 'border-border/20 hover:border-border/40 cursor-pointer'
      }`}
      onClick={() => {
        if (isDisabled) {
          const tierLabel = strategyTier ? strategyTier.toUpperCase() : 'higher';
          const nameLabel = strategyName || 'This strategy';
          toast.info({
            title: 'Upgrade required',
            description: `${nameLabel} is available on the ${tierLabel} plan. Upgrade to unlock.`,
          });
          return;
        }
        handleClick();
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-foreground">{strategyName}</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-trading-profit">{strategyWinRate}% win rate</span>
        <span className="text-muted-foreground">{strategyRisk} risk</span>
      </div>
    </div>
  );
}
