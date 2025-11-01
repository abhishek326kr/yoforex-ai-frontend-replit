import { COMPANY } from "@/config/company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  XCircle, 
  Ban, 
  ToggleLeft, 
  Scale, 
  Mail, 
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Settings
} from "lucide-react";

export function Refunds() {
  const faqs = [
    {
      question: "Why don't you offer refunds?",
      answer: "Our no-refund policy allows us to maintain competitive pricing and invest in platform improvements. All features are clearly described before purchase, and we offer support to help you get the most value from your subscription."
    },
    {
      question: "Can I get a partial refund if I cancel mid-month?",
      answer: "No, partial refunds are not available. However, you will retain full access to all paid features until the end of your current billing cycle."
    },
    {
      question: "What happens after I disable auto-renewal?",
      answer: "You will not be charged for the next billing period. Your current subscription will remain active until the end of the paid term, at which point it will not renew."
    },
    {
      question: "Are there any exceptions to the no-refund policy?",
      answer: "Where mandatory consumer protection laws apply and grant you additional rights, those rights remain unaffected by this policy."
    }
  ];

  const policyPoints = [
    {
      icon: XCircle,
      title: "No Refunds",
      description: "All payments are final and non-refundable",
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    },
    {
      icon: Ban,
      title: "No Mid-Term Cancellations",
      description: "Subscriptions run until the end of the billing cycle",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      icon: ToggleLeft,
      title: "Manage Auto-Renewal",
      description: "Disable auto-renewal anytime in billing settings",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Scale,
      title: "Legal Rights Protected",
      description: "Consumer protection laws remain unaffected",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="heading-trading text-5xl font-bold mb-4">Refunds & Cancellations</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Understanding our refund policy and how to manage your subscription
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="outline">Last Updated: {new Date().toLocaleDateString()}</Badge>
        </div>
      </div>

      <div className="space-y-8">
        {/* Important Notice */}
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              All purchases and subscriptions made with{" "}
              <span className="font-medium text-foreground">{COMPANY.LEGAL_NAME}</span> are final and non-refundable. 
              We do not accept refund requests or mid-term cancellation requests for active billing periods.
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Policy Overview */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="heading-trading text-3xl font-bold mb-2">Policy Overview</h2>
            <p className="text-muted-foreground">Key points of our refund and cancellation policy</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {policyPoints.map((point, index) => (
              <Card key={index} className="bg-gradient-to-br from-card to-card/50 border-border/40">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${point.bgColor}`}>
                      <point.icon className={`h-6 w-6 ${point.color}`} />
                    </div>
                    <CardTitle className="text-xl">{point.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{point.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Detailed Sections */}
        <div className="space-y-6">
          {/* 1. No Refunds */}
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-primary/10">
                  <XCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">1. No Refunds</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Payments successfully processed are non-refundable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Partial-period refunds for subscriptions are not provided</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 2. No Mid-Term Cancellations */}
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Ban className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">2. No Mid-Term Cancellations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Subscriptions cannot be cancelled during an active billing cycle</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Access to paid features remains available until the end of the current term</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 3. Managing Renewals */}
          <Card className="border-blue-500/50 bg-blue-500/5">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Settings className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle className="text-2xl">3. Managing Renewals</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  You have full control over your subscription auto-renewal settings:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/40">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Disable Auto-Renewal</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You may disable auto-renewal in your billing settings prior to the next renewal date
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/40">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Current Term Unaffected</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Turning off auto-renew stops future charges but does not refund or shorten the current term
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Legal Requirements */}
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">4. Legal Requirements</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Where mandatory consumer protection laws apply and grant you additional rights, those rights remain
                unaffected by this policy.
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* FAQ Section */}
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              <h2 className="heading-trading text-3xl font-bold">Frequently Asked Questions</h2>
            </div>
            <p className="text-muted-foreground">Common questions about refunds and cancellations</p>
          </div>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Contact for Support */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Need Help?</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions about your subscription, billing, or need assistance managing your account, 
              our support team is here to help.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Email</Badge>
                <a 
                  href={`mailto:${COMPANY.CONTACT_EMAIL}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {COMPANY.CONTACT_EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Phone</Badge>
                <a 
                  href={`tel:${COMPANY.CONTACT_PHONE}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {COMPANY.CONTACT_PHONE}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
