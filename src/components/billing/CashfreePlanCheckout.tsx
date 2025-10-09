import { useEffect, useRef } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import type { Cashfree } from "@cashfreepayments/cashfree-js";
import { startCashfreePlanOrder, getCashfreeOrderStatus, finalizeCashfreeNow } from "@/lib/api/billing";
import { CASHFREE_MODE } from "@/config/payments";
import { toast } from "@/components/ui/use-toast";

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
        // Read optional interval from query (?interval=monthly|yearly)
        let interval: 'monthly' | 'yearly' | undefined = undefined;
        try {
          const sp = new URLSearchParams(window.location.search);
          const iv = (sp.get('interval') || '').toLowerCase();
          if (iv === 'monthly' || iv === 'yearly') interval = iv as any;
        } catch {}
        let order = await startCashfreePlanOrder({ plan: props.plan, currency: props.currency, return_url: returnUrl, interval });

        // 2) Load Cashfree SDK
        const cashfree: Cashfree = await load({ mode: CASHFREE_MODE });
        console.debug("Cashfree checkout mode:", CASHFREE_MODE, "order:", order.order_id);

        // 3) Start checkout in a modal (popup). Cashfree will redirect to return_url after completion.
        const doCheckout = async (sessionId: string) => {
          return cashfree.checkout({
            paymentSessionId: sessionId,
            redirectTarget: "_modal",
          });
        };

        try {
          await doCheckout(order.payment_session_id);
        } catch (checkoutErr: any) {
          const msg = checkoutErr?.message || checkoutErr?.toString?.() || "";
          const code = checkoutErr?.code || checkoutErr?.response?.data?.code;
          const looksSessionInvalid = /payment_session_id/i.test(String(code)) || /payment_session_id.*invalid/i.test(msg);
          if (looksSessionInvalid) {
            // Try to regenerate a fresh session once and retry checkout
            try {
              const fresh = await startCashfreePlanOrder({ plan: props.plan, currency: props.currency, return_url: undefined, interval });
              order = fresh; // Use the fresh order for subsequent status polling and redirects
              await doCheckout(fresh.payment_session_id);
            } catch (retryErr: any) {
              // Surface likely environment mismatch to the user
              toast.error({
                title: 'Cashfree Error',
                description: 'Payment session invalid. Ensure frontend VITE_CASHFREE_ENV matches backend key environment (sandbox vs production).',
                variant: 'destructive',
              });
              throw retryErr;
            }
          } else {
            throw checkoutErr;
          }
        }

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
              // Attempt immediate finalize to update credits/plan right away
              try {
                await finalizeCashfreeNow(order.order_id, { plan: props.plan });
              } catch {}
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
      } catch (e: any) {
        // Show detailed Cashfree errors in a popup
        try {
          const respData = e?.response?.data;
          const detail = respData?.detail ?? respData; // FastAPI wraps as { detail: {...} }
          let friendly = "Payment could not be started. Please try again.";
          if (detail) {
            const code = detail.code || e?.code;
            // Extract nested Cashfree JSON from the backend error string if present
            let cfMessage: string | undefined;
            let cfCode: string | undefined;
            let cfHelp: string | undefined;
            const raw = typeof detail.error === 'string' ? detail.error : undefined;
            if (raw) {
              // Look for a JSON object in the error string
              const match = raw.match(/{\s*"code"[\s\S]*}/);
              if (match) {
                try {
                  const parsed = JSON.parse(match[0]);
                  cfMessage = parsed?.message;
                  cfCode = parsed?.code;
                  cfHelp = parsed?.help;
                } catch {}
              }
              // Additional friendly hints for common causes
              if (/return_url_invalid/i.test(raw) || /url should be https/i.test(raw)) {
                cfMessage = cfMessage || "Cashfree requires an HTTPS return_url.";
              }
            }
            // Compose message
            const parts: string[] = [];
            if (code) parts.push(`[${code}]`);
            if (cfCode && cfCode !== code) parts.push(`[${cfCode}]`);
            if (cfMessage) parts.push(cfMessage);
            else if (detail.error && typeof detail.error === 'string') parts.push(detail.error);
            else if (e?.message) parts.push(String(e.message));
            friendly = parts.join(' ');
            if (cfHelp) {
              friendly += `\nHelp: ${cfHelp}`;
            }
          }
          toast.error({ title: 'Cashfree Error', description: friendly, variant: 'destructive' });
        } catch {
          toast.error({ title: 'Cashfree Error', description: 'Payment could not be started. Please try again.', variant: 'destructive' });
        }
        console.error("Cashfree plan checkout failed:", e);
        // Fallback: stay on billing page
      }
    };

    void run();
  }, [props.plan, props.currency]);

  return null;
}
