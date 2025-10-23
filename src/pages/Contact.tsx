import { COMPANY } from "@/config/company";

export function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-6">Contact Us</h1>

      <div className="space-y-6 text-muted-foreground">
        <section className="space-y-2">
          <div>
            <span className="font-medium text-foreground">Email:</span>{" "}
            <a className="underline hover:text-primary" href={`mailto:${COMPANY.CONTACT_EMAIL}`}>{COMPANY.CONTACT_EMAIL}</a>
          </div>
          <div>
            <span className="font-medium text-foreground">Phone:</span>{" "}
            <a className="underline hover:text-primary" href={`tel:${COMPANY.CONTACT_PHONE}`}>{COMPANY.CONTACT_PHONE}</a>
          </div>
          <div>
            <div className="font-medium text-foreground">Operating Address:</div>
            <address className="not-italic leading-6">
              {COMPANY.ADDRESS_LINES.map((ln, i) => (
                <div key={i}>{ln}</div>
              ))}
            </address>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Support Hours</h2>
          <p>Mon–Sat, 10:00–17:00 IST (responses outside these hours may be slower).</p>
          <p className="mt-2">Typical first response time: 24–48 hours on business days.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Billing & Payments</h2>
          <p>
            For queries related to subscriptions, invoices, or refunds, please include your registered email and any
            transaction reference so we can assist quickly.
          </p>
        </section>
      </div>
    </div>
  );
}
