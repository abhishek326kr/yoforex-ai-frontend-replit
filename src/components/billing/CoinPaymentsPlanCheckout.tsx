import { useEffect, useRef } from "react";
import { startCoinpaymentsCheckout } from "@/lib/api/billing";
import { toast } from "@/components/ui/use-toast";

export function CoinPaymentsPlanCheckout(props: { plan: "pro" | "max" }) {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      try {
        const isDev = import.meta.env.MODE === 'development';
        const frontendBase = isDev ? 'http://localhost:3000' : window.location.origin;
        try { localStorage.setItem('cp_last_plan', props.plan); } catch {}
        const res = await startCoinpaymentsCheckout({ plan: props.plan, frontend_base: frontendBase });
        const url = res?.checkout_url;
        if (!url) throw new Error('No checkout_url returned');
        // Redirect user to CoinPayments hosted checkout
        window.location.href = url;
      } catch (e: any) {
        let friendly = 'Could not start crypto checkout. Please try again.';
        try {
          const respData = e?.response?.data;
          const detail = respData?.detail ?? respData;
          if (detail?.error) friendly = String(detail.error);
          else if (e?.message) friendly = String(e.message);
        } catch {}
        toast.error({ title: 'CoinPayments Error', description: friendly, variant: 'destructive' });
      }
    };

    void run();
  }, [props.plan]);

  return null;
}
