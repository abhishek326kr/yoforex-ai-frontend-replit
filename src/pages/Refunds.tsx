import { COMPANY } from "@/config/company";

export function Refunds() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-6">Refunds & Cancellations</h1>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <p>
            We aim to provide a frictionless experience. If you face any issues with a purchase or subscription,
            please contact us and we will assist promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Cancellations</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>You may cancel your subscription at any time from your account settings.</li>
            <li>Cancellation takes effect at the end of the current billing period.</li>
            <li>No further charges will apply after cancellation confirmation.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Refund Eligibility</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Refunds may be considered in cases of duplicate charges or confirmed technical issues.</li>
            <li>Requests must be made within 7 days of the charge, unless required otherwise by law.</li>
            <li>Refunds are not typically granted for change-of-mind on already-used subscription periods.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Exceptions</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Evidence of fraud, abuse, or violation of Terms may void eligibility for refunds.</li>
            <li>Promotional or trial plans may have special terms noted at signup.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. How to Request a Refund</h2>
          <p>
            Email <span className="font-medium text-foreground">{COMPANY.CONTACT_EMAIL}</span> with your account email,
            transaction reference, and a brief description of the issue. You may also reach us at
            {" "}<span className="font-medium text-foreground">{COMPANY.CONTACT_PHONE}</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
