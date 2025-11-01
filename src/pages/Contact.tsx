import { COMPANY } from "@/config/company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, MapPin, Clock, MessageSquare, HelpCircle } from "lucide-react";

export function Contact() {
  const faqs = [
    {
      question: "How quickly can I expect a response?",
      answer: "We typically respond within 24-48 hours on business days (Mon-Sat). Messages sent outside support hours may take longer."
    },
    {
      question: "What information should I include for billing inquiries?",
      answer: "Please include your registered email address and any transaction reference number so we can locate your account and assist you quickly."
    },
    {
      question: "Can I schedule a call with support?",
      answer: "Currently, we provide support via email and phone. For complex issues, we'll coordinate the best time to discuss your concerns."
    },
    {
      question: "Do you offer live chat support?",
      answer: "We currently handle inquiries via email and phone. We're working on adding more support channels in the future."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="heading-trading text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions? We're here to help. Reach out to us through any of the channels below.
        </p>
      </div>

      <div className="space-y-8">
        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Email Card */}
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email Us</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <a 
                className="text-lg font-medium text-primary hover:underline" 
                href={`mailto:${COMPANY.CONTACT_EMAIL}`}
              >
                {COMPANY.CONTACT_EMAIL}
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                Best for detailed inquiries and support requests
              </p>
            </CardContent>
          </Card>

          {/* Phone Card */}
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Call Us</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <a 
                className="text-lg font-medium text-primary hover:underline" 
                href={`tel:${COMPANY.CONTACT_PHONE}`}
              >
                {COMPANY.CONTACT_PHONE}
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                For urgent matters during support hours
              </p>
            </CardContent>
          </Card>

          {/* Address Card */}
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Visit Us</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <address className="not-italic text-muted-foreground leading-relaxed">
                {COMPANY.ADDRESS_LINES.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </address>
            </CardContent>
          </Card>

          {/* Support Hours Card */}
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Support Hours</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium text-foreground">Monday - Saturday</p>
                <p className="text-muted-foreground">10:00 AM - 5:00 PM IST</p>
                <p className="text-sm text-muted-foreground mt-3">
                  Responses outside these hours may be slower
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Billing & Payments Info */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Billing & Payment Inquiries</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              For queries related to subscriptions, invoices, or refunds, please include your registered 
              email and any transaction reference in your message. This helps us locate your account and 
              assist you more quickly.
            </p>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              <h2 className="heading-trading text-3xl font-bold">Frequently Asked Questions</h2>
            </div>
            <p className="text-muted-foreground">Quick answers to common questions</p>
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

        {/* Response Time Info */}
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Expected Response Time</h3>
                <p className="text-sm text-muted-foreground">
                  We aim to respond to all inquiries within 24-48 hours during business days. 
                  For urgent matters, please call us during support hours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
