import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  TrendingUp,
  History,
  Target,
  CreditCard,
  HelpCircle,
  Menu,
  X,
  Home,
  Activity,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useBillingSummary } from "@/hooks/useBillingSummary";
import { useTheme } from "@/hooks/useTheme";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Live Trading", href: "/trading", icon: TrendingUp },
  { name: "History", href: "/history", icon: History },
  { name: "Active Trades", href: "/active", icon: Activity },
  // { name: "Forum", href: "/forum", icon: MessageSquare },
  // { name: "Journal", href: "/journal", icon: BookOpen }, // hidden
  // { name: "Settings", href: "/settings", icon: Settings }, // hidden
  { name: "Pricing", href: "/pricing", icon: CreditCard },
  { name: "Billing", href: "/billing", icon: Target },
  { name: "Help & Support", href: "/help", icon: HelpCircle },
];

export function TradingSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Disable background scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isMobileOpen]);
  const [location] = useLocation();
  const { data, loading, error } = useBillingSummary();

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

  const SidebarContent = ({ mobileOpen = false }: { mobileOpen?: boolean }) => {
    const { theme } = useTheme();
    const isDark =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : theme === "dark";
    const logoSrc = isDark ? "/logo.png" : "/logo_light.png";

    return (
      <aside
        className={cn(
          "flex h-full w-64 flex-col bg-sidebar-background border-r border-sidebar-border fixed top-0 left-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out shadow-lg",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:bottom-auto lg:overflow-hidden"
        )}
        aria-label="Main navigation sidebar"
      >
        {/* Logo Section */}
        <div className="flex h-16 justify-start items-center border-b border-sidebar-border">
          <Link href="/dashboard" aria-label="Yoforex AI - Return to dashboard">
            <img
              src={logoSrc}
              alt="Yoforex AI"
              className="mt-[10px] mx-[20px] w-[180px]"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Primary navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-sidebar-background",
                  active
                    ? "bg-gradient-primary text-white shadow-glow"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={() => setIsMobileOpen(false)}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                    active ? "text-white" : "text-sidebar-foreground/60"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Credit Counter */}
        <div className="p-4 border-t border-sidebar-border" role="region" aria-label="Credit usage">
          <div className="bg-gradient-glass backdrop-blur-sm rounded-lg p-4 border border-border/20 transition-colors duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-sidebar-foreground" id="credits-label">
                Credits
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                {loading
                  ? "Loading..."
                  : data?.plan
                    ? `${data.plan} Plan`
                    : "-"}
              </span>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm" id="credits-status">
                {(() => {
                  const remaining = data?.monthly_credits_remaining ?? 0;
                  const max = data?.monthly_credits_max ?? 0;
                  const percent =
                    max > 0
                      ? Math.min(100, Math.floor((remaining / max) * 100))
                      : 0;
                  return (
                    <>
                      <span className="text-sidebar-foreground/80">
                        {loading
                          ? "-"
                          : `${remaining.toLocaleString()} / ${max.toLocaleString()}`}
                      </span>
                      <span className="text-primary font-medium">
                        {loading ? "-" : `${percent}%`}
                      </span>
                    </>
                  );
                })()}
              </div>
              <div 
                className="mt-1 h-2 bg-muted rounded-full overflow-hidden"
                role="progressbar"
                aria-labelledby="credits-label"
                aria-describedby="credits-status"
                aria-valuenow={data?.monthly_credits_remaining ?? 0}
                aria-valuemin={0}
                aria-valuemax={data?.monthly_credits_max ?? 0}
              >
                {(() => {
                  const remaining = data?.monthly_credits_remaining ?? 0;
                  const max = data?.monthly_credits_max ?? 0;
                  const percent =
                    max > 0
                      ? Math.min(100, Math.floor((remaining / max) * 100))
                      : 0;
                  return (
                    <div
                      className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  );
                })()}
              </div>
            </div>
            {/* Daily cap UI removed (no daily cap enforcement) */}
            {error && (
              <p className="text-xs text-red-500" role="alert">Failed to load credits</p>
            )}
          </div>
        </div>
      </aside>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
          aria-expanded={isMobileOpen}
          aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="mobile-sidebar"
        >
          <span className="sr-only">{isMobileOpen ? "Close" : "Open"} main menu</span>
          {isMobileOpen ? (
            <X className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={"block lg:block"} id="mobile-sidebar" aria-hidden={!isMobileOpen}>
        <SidebarContent mobileOpen={isMobileOpen} />
      </div>
    </>
  );
}
