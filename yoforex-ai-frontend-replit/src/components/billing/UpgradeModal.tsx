import { useEffect, useState } from "react";
import { UPGRADE_REQUIRED_EVENT, UpgradeRequiredDetail } from "@/lib/billingEvents";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Crown, Zap } from "lucide-react";

export default function UpgradeModal() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const onUpgradeRequired = (evt: Event) => {
      try {
        const anyEvt = evt as CustomEvent<UpgradeRequiredDetail>;
        setReason(anyEvt.detail?.reason);
        setMessage(anyEvt.detail?.message);
      } catch {}
      setOpen(true);
    };
    window.addEventListener(UPGRADE_REQUIRED_EVENT, onUpgradeRequired as EventListener);
    return () => window.removeEventListener(UPGRADE_REQUIRED_EVENT, onUpgradeRequired as EventListener);
  }, []);

  const goToBilling = (plan?: "pro" | "max") => {
    try {
      const suffix = plan ? `?plan=${plan}` : "";
      window.location.href = `/billing${suffix}`;
    } catch {
      window.location.href = "/billing";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-400" />
            Upgrade to unlock more power
          </DialogTitle>
          <DialogDescription>
            {message || (reason === 'daily_cap'
              ? 'You have reached today\'s credit cap. Upgrade to Pro or Max to increase your daily limit and continue.'
              : 'Upgrade your plan to continue without interruptions.')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <div className="p-3 rounded-lg border border-border/40 bg-gradient-dark flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-primary">Pro</Badge>
                <span className="text-foreground font-medium">Best for active traders</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Higher daily cap and more monthly credits.</p>
            </div>
            <Button className="btn-trading-primary" onClick={() => goToBilling('pro')}>
              Choose Pro <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="p-3 rounded-lg border border-border/40 bg-gradient-dark flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground"><Zap className="h-3 w-3" /> Max</Badge>
                <span className="text-foreground font-medium">Unlimited momentum</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Highest daily cap, priority access, and more.</p>
            </div>
            <Button variant="outline" onClick={() => goToBilling('max')}>
              Go Max <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>Maybe later</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
