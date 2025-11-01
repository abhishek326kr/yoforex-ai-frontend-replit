import { useEffect, useRef, useState } from "react";
import { startCoinpaymentsCheckout } from "@/lib/api/billing";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export function CoinPaymentsPlanCheckout(props: {
  plan: "pro" | "max";
  currency?: string;
}) {
  const startedRef = useRef(false);
  const [step, setStep] = useState<string>("Preparing crypto checkout…");

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      try {
        setStep("Creating payment…");
        const isDev = import.meta.env.MODE === "development";
        const frontendBase = isDev
          ? "http://localhost:3000"
          : window.location.origin;
        try {
          localStorage.setItem("cp_last_plan", props.plan);
        } catch {}
        const params: {
          plan: "pro" | "max";
          frontend_base?: string;
          currency?: string;
          interval?: "monthly" | "yearly";
        } = {
          plan: props.plan,
          frontend_base: frontendBase,
          currency: props.currency,
        };
        try {
          const iv = new URLSearchParams(window.location.search).get(
            "interval"
          );
          if (iv === "monthly" || iv === "yearly")
            params.interval = iv as "monthly" | "yearly";
        } catch {}

        const res = await startCoinpaymentsCheckout(params);
        const url = res?.checkout_url;
        if (!url) throw new Error("No checkout_url returned");
        setStep("Redirecting to CoinPayments…");
        // Redirect user to CoinPayments hosted checkout
        window.location.href = url;
      } catch (e: any) {
        let friendly = "Could not start crypto checkout. Please try again.";
        try {
          const respData = e?.response?.data;
          const detail = respData?.detail ?? respData;
          if (detail?.error) friendly = String(detail.error);
          else if (e?.message) friendly = String(e.message);
        } catch {}
        toast.error({
          title: "CoinPayments Error",
          description: friendly,
          variant: "destructive",
        });
      }
    };

    void run();
  }, [props.plan, props.currency]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="trading-card p-6 w-full max-w-sm text-center">
        <div className="flex items-center justify-center mb-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">{step}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Do not refresh or close this tab.
        </p>
      </div>
    </div>
  );
}
