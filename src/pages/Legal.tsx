import { COMPANY } from "@/config/company";

export function Legal() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-6">Legal</h1>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <p>
            This website and the {""}
            <span className="font-medium text-foreground">{COMPANY.LEGAL_NAME}</span> services are operated by the
            same entity referenced below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Company Details</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Registered legal name: {COMPANY.LEGAL_NAME}</li>
            <li>Website: {COMPANY.WEBSITE}</li>
            <li>Primary contact: {COMPANY.CONTACT_EMAIL} / {COMPANY.CONTACT_PHONE}</li>
            <li>Operating address: {COMPANY.ADDRESS_LINES.join(", ")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Usage Disclaimer</h2>
          <p>
            The Service provides tools for research and documentation only and does not constitute financial advice.
            Users remain solely responsible for their decisions and compliance with applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Intellectual Property</h2>
          <p>
            All trademarks, service marks, and logos are the property of their respective owners. Materials on this site
            may not be reproduced without permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Governing Law</h2>
          <p>
            These notices and any disputes arising from the use of the Service are governed by applicable laws of India,
            without regard to conflict of laws principles.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Contact</h2>
          <p>
            Legal correspondence can be sent to {COMPANY.CONTACT_EMAIL}. For operational issues, please use the
            Contact page.
          </p>
        </section>
      </div>
    </div>
  );
}
