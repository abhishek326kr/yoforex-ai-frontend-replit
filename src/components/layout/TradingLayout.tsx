<<<<<<< HEAD
import { ReactNode } from "react";
=======
import { ReactNode, useEffect, useState } from "react";
>>>>>>> cdeaa4e (aaj to phaad hi denge)
import { TradingSidebar } from "./TradingSidebar";
import { TradingHeader } from "./TradingHeader";

interface TradingLayoutProps {
  children: ReactNode;
}

export function TradingLayout({ children }: TradingLayoutProps) {
<<<<<<< HEAD
=======
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

>>>>>>> cdeaa4e (aaj to phaad hi denge)
  return (
    <div className="min-h-screen bg-gradient-dark">
      <TradingSidebar />
      <TradingHeader />
      
      {/* Main Content */}
<<<<<<< HEAD
      <main className="md:pl-60 pt-16">
        <div className="p-4 md:p-6">
=======
      <main className={compact ? "md:pl-60 pt-12" : "md:pl-60 pt-16"}>
        <div className={compact ? "p-3 md:p-4" : "p-4 md:p-6"}>
>>>>>>> cdeaa4e (aaj to phaad hi denge)
          {children}
        </div>
      </main>
    </div>
  );
}