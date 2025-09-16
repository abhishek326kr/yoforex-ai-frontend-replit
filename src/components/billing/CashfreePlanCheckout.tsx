import { useEffect, useRef } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import type { Cashfree } from "@cashfreepayments/cashfree-js";
import { startCashfreePlanOrder, getCashfreeOrderStatus } from "@/lib/api/billing";
import { CASHFREE_MODE } from "@/config/payments";

export function CashfreePlanCheckout(props: { plan: "pro" | "max"; currency?: string }) {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      try {
        // 1) Ask backend to create Cashfree order for selected plan
        const isDev = import.meta.env.MODE === 'development';
        const frontendBase = isDev ? 'http://localhost:3000' : window.location.origin;
        const returnUrl = `${frontendBase}/billing`;
        try { localStorage.setItem('cf_last_plan', props.plan); } catch {}
        const order = await startCashfreePlanOrder({ plan: props.plan, currency: props.currency, return_url: returnUrl });

        // 2) Load Cashfree SDK
        const cashfree: Cashfree = await load({ mode: CASHFREE_MODE });

        // 3) Start checkout in a modal (popup). Cashfree will redirect to return_url after completion.
        await cashfree.checkout({
          paymentSessionId: order.payment_session_id,
          redirectTarget: "_modal",
        });

        // 4) Poll order status and redirect accordingly
        try {
          const maxTries = 10;
          const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
          let lastStatus: string | undefined;
          const isDev2 = import.meta.env.MODE === 'development';
          const frontendBase = isDev2 ? 'http://localhost:3000' : window.location.origin;
          for (let i = 0; i < maxTries; i++) {
            const status = await getCashfreeOrderStatus(order.order_id, frontendBase);
            lastStatus = status.status;
            if (status.status === "paid") {
              // Redirect to dedicated success page
              window.location.href = `${frontendBase}/billing/success?order_id=${encodeURIComponent(order.order_id)}`;
              return;
            }
            if (status.status === "failed") {
              window.location.href = `${frontendBase}/billing/failure?order_id=${encodeURIComponent(order.order_id)}`;
              return;
            }
            await delay(2000);
          }
          // Fallback if still pending/unknown
          // Go to success page which will poll and inform the user while finalization completes
          window.location.href = `${frontendBase}/billing/success?order_id=${encodeURIComponent(order.order_id)}`;
        } catch {
          window.location.href = "/billing";
        }
      } catch (e) {
        console.error("Cashfree plan checkout failed:", e);
        // Fallback: stay on billing page
      }
    };

    void run();
  }, [props.plan, props.currency]);

  return null;
}
