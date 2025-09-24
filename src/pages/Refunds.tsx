import { COMPANY } from "@/config/company";

export function Refunds() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-6">Refunds & Cancellations</h1>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <p>
            All purchases and subscriptions made with <span className="font-medium text-foreground">{COMPANY.LEGAL_NAME}</span>
            {" "}are final and non-refundable. We do not accept refund requests or mid-term cancellation requests for
            active billing periods.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. No Refunds</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Payments successfully processed are non-refundable.</li>
            <li>Partial-period refunds for subscriptions are not provided.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. No Mid‑Term Cancellations</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Subscriptions cannot be cancelled during an active billing cycle.</li>
            <li>Access to paid features remains available until the end of the current term.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Managing Renewals</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>You may disable auto‑renewal in your billing settings prior to the next renewal date.</li>
            <li>Turning off auto‑renew stops future charges but does not refund or shorten the current term.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Legal Requirements</h2>
          <p>
            Where mandatory consumer protection laws apply and grant you additional rights, those rights remain
            unaffected by this policy.
          </p>
        </section>
      </div>
    </div>
  );
}
