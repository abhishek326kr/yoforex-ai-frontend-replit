import { ReactNode } from "react";
import { TradingSidebar } from "./TradingSidebar";
import { TradingHeader } from "./TradingHeader";

interface TradingLayoutProps {
  children: ReactNode;
}

export function TradingLayout({ children }: TradingLayoutProps) {
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
    </div>
  );
}