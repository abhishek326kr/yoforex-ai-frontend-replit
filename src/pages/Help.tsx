import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { TradingLayout } from "@/components/layout/TradingLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { showApiError } from "@/lib/ui/errorToast";
import { fetchMyTickets, type TicketDTO } from "@/lib/api/support";
import {
  Search,
  MessageSquare,
  FileText,
  CreditCard,
  TrendingUp,
  Wrench,
  Phone,
  Mail,
  Clock,
  Ticket,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  Zap,
} from "lucide-react";

function getTimeAgo(dateString?: string): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

function StatusBadge({ status }: { status?: string }) {
  const s = String(status || 'open').toLowerCase();
  let label = 'Open';
  let className = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  
  if (s === 'closed') {
    label = 'Closed';
    className = 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  } else if (s.includes('progress')) {
    label = 'In Progress';
    className = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  } else if (s === 'resolved') {
    label = 'Resolved';
    className = 'bg-green-500/10 text-green-500 border-green-500/20';
  }
  
  return <Badge variant="outline" className={className}>{label}</Badge>;
}

function Help() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentTickets, setRecentTickets] = useState<TicketDTO[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingTickets(true);
        const tickets = await fetchMyTickets();
        if (!active) return;
        setRecentTickets(tickets.slice(0, 3));
      } catch (e: any) {
        console.error('Failed to load recent tickets:', e);
      } finally {
        if (active) setLoadingTickets(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const quickLinks = [
    {
      icon: MessageSquare,
      title: "Submit a Ticket",
      description: "Get help from our support team",
      gradient: "from-blue-600 to-cyan-600",
      action: () => navigate('/help/submit'),
    },
    {
      icon: FileText,
      title: "View My Tickets",
      description: "Check status of your requests",
      gradient: "from-purple-600 to-pink-600",
      action: () => navigate('/help/submit'),
    },
    {
      icon: CreditCard,
      title: "Billing Help",
      description: "Manage subscriptions & payments",
      gradient: "from-green-600 to-emerald-600",
      action: () => navigate('/billing'),
    },
    {
      icon: TrendingUp,
      title: "Trading Guide",
      description: "Learn about AI trading features",
      gradient: "from-orange-600 to-red-600",
      action: () => navigate('/dashboard'),
    },
    {
      icon: Wrench,
      title: "Technical Support",
      description: "Fix technical issues & bugs",
      gradient: "from-yellow-600 to-orange-600",
      action: () => navigate('/help/submit'),
    },
    {
      icon: Phone,
      title: "Contact Us",
      description: "Reach out to our team directly",
      gradient: "from-indigo-600 to-purple-600",
      action: () => navigate('/contact'),
    },
  ];

  const faqs = {
    general: [
      {
        question: "What is YoForex AI?",
        answer: "YoForex AI is an advanced AI-powered trading platform that provides real-time market analysis, trading signals, and automated trading capabilities for forex markets. Our platform uses cutting-edge machine learning algorithms to help you make informed trading decisions."
      },
      {
        question: "How do I get started?",
        answer: "Getting started is easy! Simply sign up for an account, choose your subscription plan, and complete the onboarding process. You'll have access to our trading dashboard, AI analysis tools, and educational resources to help you begin trading."
      },
      {
        question: "Is my data secure?",
        answer: "Yes, we take security very seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and comply with data protection regulations to ensure your information is safe."
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer: "Absolutely! You can cancel your subscription at any time from your billing settings. Your access will continue until the end of your current billing period."
      },
      {
        question: "Do you offer a free trial?",
        answer: "Yes, we offer a free trial period for new users. You can explore our features and see how our AI trading tools can benefit your trading strategy before committing to a paid plan."
      },
    ],
    billing: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept major credit cards (Visa, MasterCard, American Express), cryptocurrency payments, and bank transfers for enterprise plans. All transactions are processed securely through our payment partners."
      },
      {
        question: "How does billing work?",
        answer: "Billing is automatic and occurs monthly or annually based on your chosen plan. You'll receive an invoice via email before each billing cycle. You can view all your invoices in the billing section of your account."
      },
      {
        question: "Can I upgrade or downgrade my plan?",
        answer: "Yes! You can change your plan at any time. Upgrades take effect immediately, while downgrades will apply at the start of your next billing cycle. Any prorated amounts will be credited to your account."
      },
      {
        question: "What is your refund policy?",
        answer: "We offer a 30-day money-back guarantee for new subscriptions. If you're not satisfied within the first 30 days, contact our support team for a full refund. For detailed terms, please see our refund policy page."
      },
      {
        question: "Are there any hidden fees?",
        answer: "No, we believe in transparent pricing. The price you see is the price you pay. There are no setup fees, hidden charges, or surprise costs. Any additional features or services will be clearly communicated before purchase."
      },
    ],
    trading: [
      {
        question: "How accurate are the AI predictions?",
        answer: "Our AI models are trained on extensive historical data and continuously updated. While past performance doesn't guarantee future results, our signals have shown strong historical accuracy. We recommend using AI signals as part of a broader trading strategy."
      },
      {
        question: "Can I use automated trading?",
        answer: "Yes, our platform offers automated trading features that can execute trades based on AI signals. You maintain full control and can set parameters, stop losses, and risk limits to match your trading strategy."
      },
      {
        question: "What markets are supported?",
        answer: "We support major forex pairs, cryptocurrencies, commodities, and indices. Our coverage includes EUR/USD, GBP/USD, USD/JPY, BTC/USD, gold, oil, and many more trading instruments."
      },
      {
        question: "How do I set up stop losses?",
        answer: "Stop losses can be configured in your trade settings. You can set fixed stop losses, trailing stops, or use our AI-recommended stop loss levels. We recommend always using stop losses to manage risk."
      },
      {
        question: "Can I backtest strategies?",
        answer: "Yes! Our platform includes backtesting tools that allow you to test trading strategies against historical data. This helps you understand how a strategy would have performed before risking real capital."
      },
    ],
    technical: [
      {
        question: "What browsers are supported?",
        answer: "Our platform works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated to the latest version for optimal performance and security."
      },
      {
        question: "Is there a mobile app?",
        answer: "Yes, our web application is fully responsive and works great on mobile devices. We're also developing native iOS and Android apps that will be released soon. Stay tuned for updates!"
      },
      {
        question: "How do I reset my password?",
        answer: "Click on 'Forgot Password' on the login page. Enter your email address, and we'll send you a secure link to reset your password. If you don't receive the email, check your spam folder or contact support."
      },
      {
        question: "Why am I experiencing slow loading times?",
        answer: "Slow loading can be caused by internet connection issues, browser cache, or high server load. Try clearing your browser cache, using a different browser, or checking your internet connection. If issues persist, contact our technical support."
      },
      {
        question: "How do I enable two-factor authentication?",
        answer: "Go to Settings > Security > Two-Factor Authentication. Follow the prompts to scan the QR code with your authenticator app. We highly recommend enabling 2FA for enhanced account security."
      },
    ],
  };

  const formatTicketId = (id: number | string) => {
    const n = typeof id === 'number' ? id : parseInt(String(id).replace(/\D/g, ''), 10);
    return isNaN(n) ? `TKT-${String(id)}` : `TKT-${String(n).padStart(4, '0')}`;
  };

  return (
    <TradingLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-600/20 mb-4">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Support Center
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            How can we help you?
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search our knowledge base, browse FAQs, or submit a support ticket
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                className="pl-12 h-14 text-base border-2 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => navigate('/help/submit')}
              >
                <MessageSquare className="h-4 w-4" />
                Submit Ticket
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.scrollTo({ top: document.getElementById('faq-section')?.offsetTop || 0, behavior: 'smooth' })}
              >
                <FileText className="h-4 w-4" />
                Browse FAQ
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => navigate('/contact')}
              >
                <Phone className="h-4 w-4" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {quickLinks.map((link, index) => (
            <Card
              key={index}
              className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 overflow-hidden"
              onClick={link.action}
            >
              <div className={`h-1 bg-gradient-to-r ${link.gradient}`} />
              <CardHeader>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${link.gradient} mb-4`}>
                  <link.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">{link.title}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-primary font-medium">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!loadingTickets && recentTickets.length > 0 && (
          <Card className="mb-12 shadow-lg border-border/50">
            <CardHeader className="border-b bg-gradient-to-r from-card to-card/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary" />
                  <CardTitle>Your Recent Tickets</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/help/submit')}
                  className="text-primary"
                >
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/help/tickets/${ticket.id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="text-xs font-mono bg-gradient-to-r from-blue-600 to-purple-600">
                          {formatTicketId(ticket.id)}
                        </Badge>
                        <StatusBadge status={ticket.status} />
                      </div>
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                        {ticket.subject}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated {getTimeAgo(ticket.created_at)}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1 flex-shrink-0 ml-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {!loadingTickets && recentTickets.length === 0 && (
          <Card className="mb-12 shadow-lg border-border/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 px-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-6">
                <Ticket className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No Support Tickets Yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Haven't submitted any support requests yet. If you need help, our team is here to assist you!
              </p>
              <Button 
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                onClick={() => navigate('/help/submit')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Submit Your First Ticket
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12" id="faq-section">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-border/50">
              <CardHeader className="border-b bg-gradient-to-r from-card to-card/50">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      General Questions
                    </h3>
                    {faqs.general.map((faq, index) => (
                      <AccordionItem key={`general-${index}`} value={`general-${index}`}>
                        <AccordionTrigger className="text-left hover:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      Billing & Payments
                    </h3>
                    {faqs.billing.map((faq, index) => (
                      <AccordionItem key={`billing-${index}`} value={`billing-${index}`}>
                        <AccordionTrigger className="text-left hover:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      Trading Features
                    </h3>
                    {faqs.trading.map((faq, index) => (
                      <AccordionItem key={`trading-${index}`} value={`trading-${index}`}>
                        <AccordionTrigger className="text-left hover:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-purple-600" />
                      Technical Issues
                    </h3>
                    {faqs.technical.map((faq, index) => (
                      <AccordionItem key={`technical-${index}`} value={`technical-${index}`}>
                        <AccordionTrigger className="text-left hover:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </div>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg border-border/50 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
              <CardHeader className="border-b bg-gradient-to-r from-card to-card/50">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <CardTitle>Contact Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600/10 flex-shrink-0">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">Email Support</p>
                      <a
                        href="mailto:support@yoforexai.com"
                        className="text-sm text-primary hover:underline break-all"
                      >
                        support@yoforexai.com
                      </a>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-600/10 flex-shrink-0">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Phone Support</p>
                      <p className="text-sm text-foreground">Available for premium plans</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-600/10 flex-shrink-0">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Business Hours</p>
                      <p className="text-sm text-foreground">Mon-Fri: 9AM - 6PM EST</p>
                      <p className="text-sm text-muted-foreground">Weekend: Limited support</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-600/10 flex-shrink-0">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                      <p className="text-sm text-foreground">Average: 4-6 hours</p>
                      <p className="text-sm text-muted-foreground">Priority tickets: 1-2 hours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-border/50 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-green-600 to-emerald-600" />
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 mb-4">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Still need help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  onClick={() => navigate('/help/submit')}
                >
                  Submit a Ticket
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TradingLayout>
  );
}

export default Help;
