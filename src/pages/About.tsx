import { COMPANY } from "@/config/company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Target, TrendingUp, Users, Shield, Heart, Zap, Award, Eye } from "lucide-react";

export function About() {
  const values = [
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data belongs to you. We never sell or share your personal information."
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "Clear pricing, honest capabilities, and no hidden fees or surprises."
    },
    {
      icon: Heart,
      title: "User-Centric",
      description: "Built for traders, by traders. Every feature serves your workflow."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Leveraging cutting-edge AI to make market analysis accessible to everyone."
    }
  ];

  const team = [
    {
      name: "Trading Team",
      role: "Market Analysis",
      description: "Experienced traders developing tools that solve real trading challenges."
    },
    {
      name: "AI Team",
      role: "Technology",
      description: "Building intelligent systems that enhance decision-making capabilities."
    },
    {
      name: "Support Team",
      role: "Customer Success",
      description: "Dedicated to helping you get the most from our platform."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="heading-trading text-5xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Empowering traders with AI-powered research and documentation tools
        </p>
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed text-center text-lg">
              <span className="font-medium text-foreground">{COMPANY.LEGAL_NAME}</span> builds AI-powered
              research and documentation tools that help traders and investors analyze markets, validate
              strategies, and keep records with clarity and confidence.
            </p>
          </CardContent>
        </Card>

        {/* Mission and What We Offer */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To make high-quality market analysis accessible and transparent while keeping you in full
                control of your data.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>What We Offer</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>AI assistance for market research and trade journaling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Backtesting and hypothesis documentation features</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Exportable reports and clean record-keeping</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Privacy-first design with simple controls</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Who We Serve */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Who We Serve</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Individual traders, small desks, and creators who value process-driven trading and clear
              documentation. Whether you're a beginner learning the markets or an experienced trader
              refining your strategy, our tools adapt to your needs.
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Our Values */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="heading-trading text-3xl font-bold mb-2">Our Values</h2>
            <p className="text-muted-foreground">Principles that guide everything we build</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-gradient-to-br from-card to-card/50 border-border/40">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Meet the Team */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="heading-trading text-3xl font-bold mb-2">Meet the Team</h2>
            <p className="text-muted-foreground">Dedicated professionals working to serve you better</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="bg-gradient-to-br from-card to-card/50 border-border/40">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit">{member.role}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Important Note */}
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500" />
              Important Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We do not provide investment advice or portfolio management. Information and outputs from
              our tools are for educational and research purposes only. Trading involves risk of loss.
            </p>
          </CardContent>
        </Card>

        {/* Compliance & Contact */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/40">
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              For details on our Terms, Privacy Policy, Refunds/Cancellations, and Legal disclosures,
              please visit the respective pages available via the footer Quick Links.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Email</Badge>
                <span className="text-sm font-medium text-foreground">{COMPANY.CONTACT_EMAIL}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Phone</Badge>
                <span className="text-sm font-medium text-foreground">{COMPANY.CONTACT_PHONE}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
