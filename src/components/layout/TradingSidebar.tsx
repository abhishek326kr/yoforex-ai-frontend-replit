<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState } from "react";
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
import { Link, useLocation } from "wouter";
import {
  TrendingUp,
  History,
  Target,
<<<<<<< HEAD
=======
  BookOpen,
  Settings,
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
  CreditCard,
  HelpCircle,
  Menu,
  X,
  Home,
<<<<<<< HEAD
  Activity,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useBillingSummary } from "@/hooks/useBillingSummary";
import { useTheme } from "@/hooks/useTheme";
=======
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Live Trading", href: "/trading", icon: TrendingUp },
  { name: "History", href: "/history", icon: History },
  { name: "Active Trades", href: "/active", icon: Activity },
<<<<<<< HEAD
  { name: "Forum", href: "/forum", icon: MessageSquare },
  // { name: "Journal", href: "/journal", icon: BookOpen }, // hidden
  // { name: "Settings", href: "/settings", icon: Settings }, // hidden
=======
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
  { name: "Pricing", href: "/pricing", icon: CreditCard },
  { name: "Billing", href: "/billing", icon: Target },
  { name: "Help & Support", href: "/help", icon: HelpCircle },
];

export function TradingSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
<<<<<<< HEAD

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
=======
  const [location] = useLocation();
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

<<<<<<< HEAD
  const SidebarContent = ({ mobileOpen = false }: { mobileOpen?: boolean }) => {
    const { theme } = useTheme();
    const isDark =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : theme === "dark";
    const logoSrc = isDark ? "/logo.png" : "/logo_light.png";

    return (
      <div
        className={cn(
          "flex h-full w-64 flex-col bg-sidebar-background border-r border-sidebar-border fixed top-0 left-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out shadow-lg",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:bottom-auto lg:overflow-hidden"
        )}
      >
        {/* Logo Section */}
        <div className="flex h-16 justify-start items-center border-b border-sidebar-border">
          <img
            src={logoSrc}
            alt="Yoforex AI logo"
            className="mt-[10px] mx-[20px] w-[180px]"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  active
                    ? "bg-gradient-primary text-white shadow-glow"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                    active ? "text-white" : "text-sidebar-foreground/60"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Credit Counter */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-gradient-glass backdrop-blur-sm rounded-lg p-4 border border-border/20 transition-colors duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-sidebar-foreground">
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
              <div className="flex justify-between text-sm">
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
              <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
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
              <p className="text-xs text-red-500">Failed to load credits</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
          aria-expanded={isMobileOpen}
        >
          <span className="sr-only">Open main menu</span>
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
        />
      )}

      <div className={"block lg:block"} aria-hidden={!isMobileOpen}>
        <SidebarContent mobileOpen={isMobileOpen} />
      </div>
    </>
  );
}
=======
  const SidebarContent = () => (

    <div className="flex h-full flex-col bg-sidebar-background border-r border-sidebar-border z-auto absolute transition-colors duration-300">
      {/* Logo Section */}
      <div className="flex h-16 justify-start items-center border-b border-sidebar-border py-2">
        <img src="/logo.png" alt="Yoforex AI logo" className="ml-[0px]"/>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                active
                  ? "bg-gradient-primary text-white shadow-glow"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <Icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  active ? "text-white" : "text-sidebar-foreground/60"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Credit Counter */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-gradient-glass backdrop-blur-sm rounded-lg p-4 border border-border/20 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-sidebar-foreground">Credits</span>
            <span className="text-xs text-sidebar-foreground/60">Pro Plan</span>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm">
              <span className="text-sidebar-foreground/80">2,153 / 5,000</span>
              <span className="text-primary font-medium">43%</span>
            </div>
            <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[43%] bg-gradient-primary rounded-full transition-all duration-500" />
            </div>
          </div>
          <p className="text-xs text-sidebar-foreground/60">Resets in 8h 42m</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-card/80 backdrop-blur-sm"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-60 z-50">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
