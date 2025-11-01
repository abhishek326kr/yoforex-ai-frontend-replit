import { useEffect, useState } from "react";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
 
 
 
import LivePriceTracker from "@/components/LivePriceTracker";
import { UserProfileDropdown } from "../user/UserProfileDropdown";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getPlanDetails, type PlanDetailsResponse } from "@/lib/api/billing";

export function TradingHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [planBanner, setPlanBanner] = useState<{ kind: 'expired' | 'expiring'; message: string } | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(false);
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const d: PlanDetailsResponse = await getPlanDetails();
        if (cancelled) return;
        if (d?.plan && d.plan !== 'free') {
          if (d.is_expired) {
            setPlanBanner({ kind: 'expired', message: 'Your plan has expired. Recharge to continue analysis.' });
          } else if (d.is_expiring_soon) {
            const days = typeof d.days_until_expiry === 'number' ? d.days_until_expiry : undefined;
            setPlanBanner({ kind: 'expiring', message: `Plan expires ${days !== undefined ? `in ${days} day${days === 1 ? '' : 's'}` : 'soon'}. Please recharge.` });
          }
        }
      } catch {
        // ignore
      }
    };
    run();
    // Refresh occasionally (e.g., every login/navigation); lightweight call
    const t = setInterval(run, 6 * 60 * 60 * 1000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);
  
  

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 bg-card/90 backdrop-blur-md border-b border-border/20 z-30" role="banner">
      <div className="h-16 flex items-center px-3 sm:px-4 lg:px-6 gap-2 sm:gap-4">
        {/* Skip to main content link for screen readers */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Skip to main content
        </a>

        {/* Live Price Tracker - Takes remaining space */}
        <div className="flex-1 min-w-0 overflow-hidden" role="region" aria-label="Live market prices">
          <LivePriceTracker />
        </div>

        {/* Search Bar - Collapses on small screens */}
        <div className="hidden md:block w-[200px] lg:w-[250px] xl:w-[300px] flex-shrink-0">
          <form role="search" className="relative" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="global-search" className="sr-only">Search</label>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <Input
              id="global-search"
              type="search"
              placeholder="Search..."
              className="pl-10 bg-muted/50 border-0 focus:bg-muted focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search the platform"
            />
          </form>
        </div>

        {/* Right Section */}
        <nav className="flex items-center space-x-2 sm:space-x-3" aria-label="Secondary navigation">
          {/* Mobile Search Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Open search"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Button>

          {/* Join Telegram Button - replaces credit display */}
          <Button
            className="inline-flex items-center gap-2 px-2 sm:px-3 focus:ring-2 focus:ring-primary focus:ring-offset-2"
            variant="secondary"
            aria-label="Join our Telegram community"
            onClick={() => {
              window.open("https://t.me/+n0jVrMKTReg0Y2M1", "_blank", "noopener,noreferrer");
            }}
          >
            <img src="/telegram.png" alt="" width={20} height={20} aria-hidden="true" />
            <span className="hidden sm:inline">Join Telegram</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="View notifications (3 unread)"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
              aria-hidden="true"
            >
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <UserProfileDropdown />
        </nav>
      </div>
      {/* Expiry banner */}
      {planBanner && !bannerDismissed && (
        <div 
          className={`px-4 py-2 text-sm flex items-center justify-between ${planBanner.kind === 'expired' ? 'bg-trading-loss/15 text-trading-loss' : 'bg-yellow-500/10 text-yellow-500'}`}
          role="alert"
          aria-live="polite"
        >
          <div>
            <strong>{planBanner.kind === 'expired' ? 'Plan expired: ' : 'Plan notice: '}</strong>
            <span>{planBanner.message}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              className="btn-trading-primary focus:ring-2 focus:ring-primary focus:ring-offset-2" 
              onClick={() => { window.location.href = '/billing'; }}
              aria-label="Go to billing to recharge"
            >
              Recharge
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setBannerDismissed(true)}
              aria-label="Dismiss plan notification"
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}