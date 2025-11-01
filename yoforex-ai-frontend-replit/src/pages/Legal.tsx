import { COMPANY } from "@/config/company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Shield, Copyright, Scale, Mail, FileText, Lock, UserCheck } from "lucide-react";
import { Link } from "wouter";

export function Legal() {
  const sections = [
    { id: "company", title: "Company Details", icon: Building2 },
    { id: "disclaimer", title: "Usage Disclaimer", icon: Shield },
    { id: "ip", title: "Intellectual Property", icon: Copyright },
    { id: "law", title: "Governing Law", icon: Scale },
    { id: "contact", title: "Contact", icon: Mail }
  ];

  const relatedPages = [
    { title: "Terms & Conditions", path: "/terms", icon: FileText },
    { title: "Privacy Policy", path: "/privacy", icon: Lock },
    { title: "Refunds & Cancellations", path: "/refunds", icon: UserCheck }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="heading-trading text-5xl font-bold mb-4">Legal Information</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Important legal notices and company information
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
              <FileText className="h-5 w-5 text-primary" />
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
              This website and the <span className="font-medium text-foreground">{COMPANY.LEGAL_NAME}</span> services 
              are operated by the same entity referenced below.
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Company Details */}
        <Card id="company" className="bg-gradient-to-br from-card to-card/50 border-border/40 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">1. Company Details</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Registered Legal Name</p>
                  <p className="text-foreground font-medium">Yoforex</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Website</p>
                  <p className="text-foreground font-medium">{COMPANY.WEBSITE}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Primary Contact</p>
                  <p className="text-foreground font-medium">{COMPANY.CONTACT_EMAIL}</p>
                  <p className="text-foreground font-medium">{COMPANY.CONTACT_PHONE}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Operating Address</p>
                  <div className="text-foreground">
                    {COMPANY.ADDRESS_LINES.map((line, i) => (
                      <div key={i} className="text-sm">{line}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Disclaimer */}
        <Card id="disclaimer" className="bg-gradient-to-br from-card to-card/50 border-border/40 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">2. Usage Disclaimer</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              The Service provides tools for research and documentation only and does not constitute financial advice.
              Users remain solely responsible for their decisions and compliance with applicable laws.
            </p>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card id="ip" className="bg-gradient-to-br from-card to-card/50 border-border/40 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Copyright className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">3. Intellectual Property</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              All trademarks, service marks, and logos are the property of their respective owners. Materials on this site
              may not be reproduced without permission.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card id="law" className="bg-gradient-to-br from-card to-card/50 border-border/40 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">4. Governing Law</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              These notices and any disputes arising from the use of the Service are governed by applicable laws of India,
              without regard to conflict of laws principles.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card id="contact" className="bg-gradient-to-br from-card to-card/50 border-border/40 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">5. Contact</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Legal correspondence can be sent to{" "}
              <a href={`mailto:${COMPANY.CONTACT_EMAIL}`} className="text-primary hover:underline font-medium">
                {COMPANY.CONTACT_EMAIL}
              </a>. For operational issues, please use the Contact page.
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Related Pages */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="heading-trading text-3xl font-bold mb-2">Related Legal Documents</h2>
            <p className="text-muted-foreground">Important policies and agreements</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedPages.map((page, index) => (
              <Link key={index} href={page.path}>
                <Card className="bg-gradient-to-br from-card to-card/50 border-border/40 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <page.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
