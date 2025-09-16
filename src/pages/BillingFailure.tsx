import { TradingLayout } from "@/components/layout/TradingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";

export default function BillingFailure() {
  const [, navigate] = useLocation();
  const sp = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : "");
  const orderId = sp.get("order_id") || undefined;

  return (
    <TradingLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="trading-card p-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <AlertTriangle className="h-10 w-10 text-trading-loss" />
            <h1 className="text-2xl font-bold heading-trading">Payment Failed</h1>
            <p className="text-muted-foreground">{orderId ? `Order ${orderId} could not be completed.` : 'Your payment could not be completed.'}</p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => navigate('/billing')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Billing
            </Button>
            <Button className="btn-trading-primary" onClick={() => navigate('/pricing')}>
              <RotateCcw className="h-4 w-4 mr-2" /> Try Again
            </Button>
          </div>
        </Card>
      </div>
    </TradingLayout>
  );
}
