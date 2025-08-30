import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

const ActivePositions = () => {
    return (
        <Card className="p-4 bg-gradient-glass backdrop-blur-sm border-border/20 overflow-visible">
            <h3 className="text-lg font-semibold text-foreground mb-4">Active Positions</h3>
            <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gradient-dark border border-border/10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">EUR/USD</span>
                        <Badge className="bg-gradient-profit text-xs">+$124.50</Badge>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Entry: 1.0820</span>
                        <span>Current: 1.0847</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ActivePositions;
