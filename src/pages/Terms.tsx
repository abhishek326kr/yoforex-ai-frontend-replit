import { COMPANY } from "@/config/company";

export function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>
      <div className="text-xs text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</div>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <p>
            Welcome to <span className="font-medium text-foreground">{COMPANY.LEGAL_NAME}</span>. By accessing or
            using our website and services (the "Service"), you agree to be bound by these Terms and Conditions (the
            "Terms"). If you do not agree, please discontinue use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Eligibility & Accounts</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>You must be capable of entering into a binding contract to use the Service.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You are responsible for all activities that occur under your account.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Nature of Service</h2>
          <p>
            The Service provides AI-assisted research, documentation, and analysis tools. We do not offer investment
            advice or portfolio management. Outputs are for educational and research purposes only. Trading involves risk
            of loss.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Subscriptions, Billing & Taxes</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Paid plans renew automatically unless cancelled prior to renewal.</li>
            <li>Prices are subject to change with notice; continued use implies acceptance of new pricing.</li>
            <li>You are responsible for applicable taxes unless otherwise stated at checkout.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Cancellations & Refunds</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>All payments are final and non-refundable. We do not accept refund requests.</li>
            <li>Subscriptions cannot be cancelled mid-term; access continues until the end of the current billing cycle.</li>
            <li>You can disable auto-renewal in your billing settings to prevent future charges.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Acceptable Use</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>No unlawful, harmful, fraudulent, infringing, or abusive activity.</li>
            <li>No attempts to circumvent security or access non-public areas.</li>
            <li>No automated scraping or rate abuse that degrades the Service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Intellectual Property</h2>
          <p>
            All content, features, and functionality are owned by {COMPANY.LEGAL_NAME} or its licensors and are protected
            by applicable intellectual property laws. You receive a limited, non-exclusive, non-transferable license to
            use the Service subject to these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Warranty Disclaimer</h2>
          <p>
            The Service is provided on an "as is" and "as available" basis without warranties of any kind, express or
            implied.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, {COMPANY.LEGAL_NAME} shall not be liable for indirect, incidental,
            special, consequential, or exemplary damages, or for loss of profits, revenue, data, or use.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">9. Changes to the Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be notified via the website or email.
            Continued use of the Service after changes become effective constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">10. Contact</h2>
          <p>
            For questions about these Terms, contact us at {COMPANY.CONTACT_EMAIL} or {COMPANY.CONTACT_PHONE}.
          </p>
        </section>
      </div>
    </div>
  );
}
