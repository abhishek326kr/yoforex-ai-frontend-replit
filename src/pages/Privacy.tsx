import { COMPANY } from "@/config/company";

export function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <p>
            <span className="font-medium text-foreground">{COMPANY.LEGAL_NAME}</span> respects your privacy. We
            collect only what is necessary to operate and improve the Service, and we do not sell your personal data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Account information: name, email/phone, authentication identifiers.</li>
            <li>Usage data: device info, logs, and interaction metrics for reliability and analytics.</li>
            <li>User content: research notes, prompts, and trade journals you choose to store.</li>
            <li>Billing data: limited information necessary to process payments via our payment provider.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. How We Use Information</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>To provide, secure, and maintain the Service.</li>
            <li>To improve features, performance, and user experience.</li>
            <li>To communicate important updates and support responses.</li>
            <li>To comply with legal obligations and prevent abuse or fraud.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Legal Basis</h2>
          <p>
            We process data based on legitimate interests, contract performance, consent (where applicable), and
            compliance with legal obligations.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Sharing & Third Parties</h2>
          <p>
            We may share limited data with vendors who help us operate the Service (e.g., cloud hosting, analytics,
            payment processing). These providers are bound by appropriate data protection commitments.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Security</h2>
          <p>
            We take reasonable technical and organizational measures to protect your information. No method of
            transmission or storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Data Retention</h2>
          <p>
            We retain information for as long as needed to provide the Service and meet legal requirements. You can
            request deletion or export of your data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Your Rights</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Access, correct, or delete personal data we hold about you.</li>
            <li>Object to or restrict certain processing where applicable.</li>
            <li>Request data portability where technically feasible.</li>
          </ul>
          <p className="mt-2">
            To exercise these rights, contact us at {COMPANY.CONTACT_EMAIL}.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Contact</h2>
          <p>
            Questions about this Privacy Policy can be sent to {COMPANY.CONTACT_EMAIL} or {COMPANY.CONTACT_PHONE}.
          </p>
        </section>
      </div>
    </div>
  );
}
