import { COMPANY } from "@/config/company";

export function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-6">About Us</h1>
      <section className="space-y-4 text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">{COMPANY.LEGAL_NAME}</span> builds AI-powered
          research and documentation tools that help traders and investors analyze markets, validate
          strategies, and keep records with clarity and confidence.
        </p>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Our Mission</h2>
          <p>
            To make high-quality market analysis accessible and transparent while keeping you in full
            control of your data.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">What We Offer</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>AI assistance for market research and trade journaling.</li>
            <li>Backtesting and hypothesis documentation features.</li>
            <li>Exportable reports and clean record-keeping.</li>
            <li>Privacy-first design with simple controls.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Who We Serve</h2>
          <p>
            Individual traders, small desks, and creators who value process-driven trading and clear
            documentation.
          </p>
        </div>

        <div className="rounded-lg border border-border/40 bg-background/40 p-4">
          <h2 className="text-lg font-semibold text-foreground mb-2">Important Note</h2>
          <p className="text-sm">
            We do not provide investment advice or portfolio management. Information and outputs from
            our tools are for educational and research purposes only. Trading involves risk of loss.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Compliance & Contact</h2>
          <p className="mb-2">
            For details on our Terms, Privacy Policy, Refunds/Cancellations, and Legal disclosures,
            please visit the respective pages available via the footer Quick Links.
          </p>
          <p>
            You can reach us at <span className="font-medium text-foreground">{COMPANY.CONTACT_EMAIL}</span>
            {" "}or <span className="font-medium text-foreground">{COMPANY.CONTACT_PHONE}</span>.
          </p>
        </div>
      </section>
    </div>
  );
}
