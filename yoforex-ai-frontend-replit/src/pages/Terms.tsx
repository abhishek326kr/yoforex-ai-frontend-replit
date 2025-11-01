import { COMPANY } from "@/config/company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  UserCheck, 
  FileText, 
  CreditCard, 
  XCircle, 
  ShieldCheck, 
  Copyright, 
  AlertTriangle, 
  Scale, 
  Edit, 
  Mail,
  List
} from "lucide-react";

export function Terms() {
  const sections = [
    { id: "eligibility", title: "Eligibility & Accounts", icon: UserCheck },
    { id: "service", title: "Nature of Service", icon: FileText },
    { id: "billing", title: "Subscriptions, Billing & Taxes", icon: CreditCard },
    { id: "refunds", title: "Cancellations & Refunds", icon: XCircle },
    { id: "use", title: "Acceptable Use", icon: ShieldCheck },
    { id: "ip", title: "Intellectual Property", icon: Copyright },
    { id: "warranty", title: "Warranty Disclaimer", icon: AlertTriangle },
    { id: "liability", title: "Limitation of Liability", icon: Scale },
    { id: "changes", title: "Changes to the Terms", icon: Edit },
    { id: "contact", title: "Contact", icon: Mail }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="heading-trading text-5xl font-bold mb-4">Terms and Conditions</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Please read these terms carefully before using our service
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="outline">Last Updated: {new Date().toLocaleDateString()}</Badge>
        </div>
      </div>

      <div className="space-y-8">
        {/* Table of Contents */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5 text-primary" />
              Table of Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <section.icon className="h-4 w-4" />
                  {section.title}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Introduction */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              Welcome to <span className="font-medium text-foreground">{COMPANY.LEGAL_NAME}</span>. By accessing or
              using our website and services (the "Service"), you agree to be bound by these Terms and Conditions (the
              "Terms"). If you do not agree, please discontinue use of the Service.
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* 1. Eligibility & Accounts */}
        <Card id="eligibility" className="bg-gradient-to-br from-card to-card/50 border-border/40 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">1. Eligibility & Accounts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>You must be capable of entering into a binding contract to use the Service.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>You are responsible for maintaining the confidentiality of your account credentials.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>You are responsible for all activities that occur under your account.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* 2. Nature of Service */}
        <Card id="service" className="bg-gradient-to-br from-card to-card/50 border-border/40 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">2. Nature of Service</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              The Service provides AI-assisted research, documentation, and analysis tools. We do not offer investment
              advice or portfolio management. Outputs are for educational and research purposes only. Trading involves risk
              of loss.
            </p>
          </CardContent>
        </Card>

        {/* 3. Subscriptions, Billing & Taxes */}
        <Card id="billing" className="bg-gradient-to-br from-card to-card/50 border-border/40 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">3. Subscriptions, Billing & Taxes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Paid plans renew automatically unless cancelled prior to renewal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Prices are subject to change with notice; continued use implies acceptance of new pricing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>You are responsible for applicable taxes unless otherwise stated at checkout.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* 4. Cancellations & Refunds - Highlighted */}
        <Card id="refunds" className="border-amber-500/50 bg-amber-500/5 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <XCircle className="h-6 w-6 text-amber-500" />
              </div>
              <CardTitle className="text-2xl">4. Cancellations & Refunds</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>All payments are final and non-refundable. We do not accept refund requests.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>Subscriptions cannot be cancelled mid-term; access continues until the end of the current billing cycle.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>You can disable auto-renewal in your billing settings to prevent future charges.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* 5. Acceptable Use */}
        <Card id="use" className="bg-gradient-to-br from-card to-card/50 border-border/40 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">5. Acceptable Use</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>No unlawful, harmful, fraudulent, infringing, or abusive activity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>No attempts to circumvent security or access non-public areas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>No automated scraping or rate abuse that degrades the Service.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Collapsible Sections for Less Critical Info */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
          <CardHeader>
            <CardTitle>Additional Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {/* 6. Intellectual Property */}
              <AccordionItem id="ip" value="ip" className="scroll-mt-8">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Copyright className="h-5 w-5 text-primary" />
                    <span className="font-semibold">6. Intellectual Property</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed pt-2">
                    All content, features, and functionality are owned by {COMPANY.LEGAL_NAME} or its licensors and are protected
                    by applicable intellectual property laws. You receive a limited, non-exclusive, non-transferable license to
                    use the Service subject to these Terms.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 7. Warranty Disclaimer */}
              <AccordionItem id="warranty" value="warranty" className="scroll-mt-8">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <span className="font-semibold">7. Warranty Disclaimer</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed pt-2">
                    The Service is provided on an "as is" and "as available" basis without warranties of any kind, express or
                    implied.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 8. Limitation of Liability */}
              <AccordionItem id="liability" value="liability" className="scroll-mt-8">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    <span className="font-semibold">8. Limitation of Liability</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed pt-2">
                    To the maximum extent permitted by law, {COMPANY.LEGAL_NAME} shall not be liable for indirect, incidental,
                    special, consequential, or exemplary damages, or for loss of profits, revenue, data, or use.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 9. Changes to the Terms */}
              <AccordionItem id="changes" value="changes" className="scroll-mt-8">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Edit className="h-5 w-5 text-primary" />
                    <span className="font-semibold">9. Changes to the Terms</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed pt-2">
                    We may update these Terms from time to time. Material changes will be notified via the website or email.
                    Continued use of the Service after changes become effective constitutes acceptance.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* 10. Contact */}
        <Card id="contact" className="bg-gradient-to-br from-card to-card/50 border-border/40 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">10. Contact</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms, contact us at{" "}
              <a href={`mailto:${COMPANY.CONTACT_EMAIL}`} className="text-primary hover:underline font-medium">
                {COMPANY.CONTACT_EMAIL}
              </a>{" "}
              or{" "}
              <a href={`tel:${COMPANY.CONTACT_PHONE}`} className="text-primary hover:underline font-medium">
                {COMPANY.CONTACT_PHONE}
              </a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
