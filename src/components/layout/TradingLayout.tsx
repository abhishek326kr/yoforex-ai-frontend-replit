<<<<<<< HEAD
import { ReactNode, useEffect, useState } from "react";
=======
import { ReactNode } from "react";
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
import { TradingSidebar } from "./TradingSidebar";
import { TradingHeader } from "./TradingHeader";

interface TradingLayoutProps {
  children: ReactNode;
}

export function TradingLayout({ children }: TradingLayoutProps) {
<<<<<<< HEAD
  const [compact, setCompact] = useState<boolean>(false);

  useEffect(() => {
    // Read initial preference from localStorage
    try {
      const cached = localStorage.getItem('userPreferences');
      if (cached) {
        const prefs = JSON.parse(cached);
        setCompact(!!prefs?.compact_view);
        if (prefs?.compact_view) {
          document.documentElement.classList.add('compact');
        } else {
          document.documentElement.classList.remove('compact');
        }
      }
    } catch {
      // ignore
    }

    // Listen for changes to preferences in other tabs/windows
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'userPreferences' && e.newValue) {
        try {
          const prefs = JSON.parse(e.newValue);
          const isCompact = !!prefs?.compact_view;
          setCompact(isCompact);
          if (isCompact) {
            document.documentElement.classList.add('compact');
          } else {
            document.documentElement.classList.remove('compact');
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col overflow-hidden">
      <TradingHeader />
      <div className="flex flex-1 overflow-hidden">
        <TradingSidebar />
        
        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto relative pt-16 transition-all duration-300 lg:ml-64">
          <div className={compact ? "p-3 md:p-4" : "p-4 md:p-6 w-full max-w-[1440px] mx-auto"}>
            {children}
          </div>
        </main>
      </div>
=======
  return (
    <div className="min-h-screen bg-gradient-dark">
      <TradingSidebar />
      <TradingHeader />
      
      {/* Main Content */}
      <main className="md:pl-60 pt-16">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
    </div>
  );
}