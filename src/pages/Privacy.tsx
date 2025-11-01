import { COMPANY } from "@/config/company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Database, 
  Eye, 
  Shield, 
  Share2, 
  Lock, 
  Clock, 
  UserCheck, 
  Mail,
  List,
  CheckCircle2
} from "lucide-react";

export function Privacy() {
  const sections = [
    { id: "collect", title: "Information We Collect", icon: Database },
    { id: "use", title: "How We Use Information", icon: Eye },
    { id: "basis", title: "Legal Basis", icon: Shield },
    { id: "sharing", title: "Sharing & Third Parties", icon: Share2 },
    { id: "security", title: "Security", icon: Lock },
    { id: "retention", title: "Data Retention", icon: Clock },
    { id: "rights", title: "Your Rights", icon: UserCheck },
    { id: "contact", title: "Contact", icon: Mail }
  ];

  const complianceFeatures = [
    "GDPR Compliant",
    "Data Encryption",
    "Regular Audits",
    "Right to Deletion"
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="heading-trading text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your privacy matters to us. Learn how we collect, use, and protect your data.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="outline">Last Updated: {new Date().toLocaleDateString()}</Badge>
        </div>
      </div>

      <div className="space-y-8">
        {/* Compliance Badges */}
        <div className="flex flex-wrap justify-center gap-3">
          {complianceFeatures.map((feature, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3" />
              {feature}
            </Badge>
          ))}
        </div>

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
              <span className="font-medium text-foreground">{COMPANY.LEGAL_NAME}</span> respects your privacy. We
              collect only what is necessary to operate and improve the Service, and we do not sell your personal data.
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* 1. Information We Collect */}
        <Card id="collect" className="bg-gradient-to-br from-card to-card/50 border-border/40 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">1. Information We Collect</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                <h4 className="font-medium text-foreground mb-2">Account Information</h4>
                <p className="text-sm text-muted-foreground">Name, email/phone, authentication identifiers</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                <h4 className="font-medium text-foreground mb-2">Usage Data</h4>
                <p className="text-sm text-muted-foreground">Device info, logs, and interaction metrics for reliability and analytics</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                <h4 className="font-medium text-foreground mb-2">User Content</h4>
                <p className="text-sm text-muted-foreground">Research notes, prompts, and trade journals you choose to store</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                <h4 className="font-medium text-foreground mb-2">Billing Data</h4>
                <p className="text-sm text-muted-foreground">Limited information necessary to process payments via our payment provider</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. How We Use Information */}
        <Card id="use" className="bg-gradient-to-br from-card to-card/50 border-border/40 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">2. How We Use Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>To provide, secure, and maintain the Service</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>To improve features, performance, and user experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>To communicate important updates and support responses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>To comply with legal obligations and prevent abuse or fraud</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* 3. Legal Basis */}
        <Card id="basis" className="bg-gradient-to-br from-card to-card/50 border-border/40 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">3. Legal Basis</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              We process data based on legitimate interests, contract performance, consent (where applicable), and
              compliance with legal obligations.
            </p>
          </CardContent>
        </Card>

        {/* 4. Sharing & Third Parties */}
        <Card id="sharing" className="bg-gradient-to-br from-card to-card/50 border-border/40 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">4. Sharing & Third Parties</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              We may share limited data with vendors who help us operate the Service (e.g., cloud hosting, analytics,
              payment processing). These providers are bound by appropriate data protection commitments.
            </p>
          </CardContent>
        </Card>

        {/* 5. Security - Highlighted */}
        <Card id="security" className="border-green-500/50 bg-green-500/5 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Lock className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle className="text-2xl">5. Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              We take reasonable technical and organizational measures to protect your information. No method of
              transmission or storage is 100% secure.
            </p>
          </CardContent>
        </Card>

        {/* 6. Data Retention */}
        <Card id="retention" className="bg-gradient-to-br from-card to-card/50 border-border/40 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">6. Data Retention</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              We retain information for as long as needed to provide the Service and meet legal requirements. You can
              request deletion or export of your data.
            </p>
          </CardContent>
        </Card>

        {/* 7. Your Rights - Highlighted */}
        <Card id="rights" className="border-blue-500/50 bg-blue-500/5 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <UserCheck className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle className="text-2xl">7. Your Rights</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                  <h4 className="font-medium text-foreground mb-2 text-sm">Access</h4>
                  <p className="text-xs text-muted-foreground">Request access to your personal data</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                  <h4 className="font-medium text-foreground mb-2 text-sm">Correct</h4>
                  <p className="text-xs text-muted-foreground">Update or correct your information</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                  <h4 className="font-medium text-foreground mb-2 text-sm">Delete</h4>
                  <p className="text-xs text-muted-foreground">Request deletion of your data</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                  <h4 className="font-medium text-foreground mb-2 text-sm">Object</h4>
                  <p className="text-xs text-muted-foreground">Object to certain processing</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                  <h4 className="font-medium text-foreground mb-2 text-sm">Restrict</h4>
                  <p className="text-xs text-muted-foreground">Restrict processing where applicable</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                  <h4 className="font-medium text-foreground mb-2 text-sm">Portability</h4>
                  <p className="text-xs text-muted-foreground">Request data export</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                To exercise these rights, contact us at{" "}
                <a href={`mailto:${COMPANY.CONTACT_EMAIL}`} className="text-primary hover:underline font-medium">
                  {COMPANY.CONTACT_EMAIL}
                </a>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 8. Contact */}
        <Card id="contact" className="bg-gradient-to-br from-card to-card/50 border-border/40 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">8. Contact</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Questions about this Privacy Policy can be sent to{" "}
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
