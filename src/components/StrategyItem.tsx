import { Badge } from "@/components/ui/badge";
<<<<<<< HEAD
import { toast } from "@/components/ui/use-toast";
=======
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2

interface StrategyItemProps {
  // Old props structure (for backward compatibility)
  strategy?: {
    name: string;
<<<<<<< HEAD
=======
    credits: number;
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
    winRate: number;
    risk: string;
    tier: string;
  };
  isSelected?: boolean;
  isDisabled?: boolean;
  onSelect?: (name: string) => void;
  
  // New props structure
  name?: string;
<<<<<<< HEAD
=======
  credits?: number;
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
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
<<<<<<< HEAD
=======
  credits,
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
  winRate,
  risk,
  tier,
  onClick
}: StrategyItemProps) {
  // Use direct props if available, otherwise use strategy object
  const strategyName = name || strategy?.name || '';
<<<<<<< HEAD
=======
  const strategyCredits = credits ?? strategy?.credits ?? 0;
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
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
<<<<<<< HEAD
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
=======
      onClick={() => !isDisabled && handleClick()}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-foreground">{strategyName}</span>
        <Badge
          variant={strategyTier === 'free' ? 'secondary' : strategyTier === 'pro' ? 'default' : 'destructive'}
          className="text-xs"
        >
          {strategyCredits} credits
        </Badge>
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-trading-profit">{strategyWinRate}% win rate</span>
        <span className="text-muted-foreground">{strategyRisk} risk</span>
      </div>
    </div>
  );
}
