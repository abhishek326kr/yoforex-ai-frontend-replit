import { Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, BookOpen, AlertCircle } from "lucide-react";
import { TradingLayout } from "./layout/TradingLayout";

export default function HelpSupport() {
  const supportItems = [
    {
      title: "Contact Support",
      description: "Get in touch with our support team for immediate assistance.",
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      buttonText: "Start Chat",
    },
    {
      title: "Email Us",
      description: "Send us an email and we'll get back to you within 24 hours.",
      icon: <Mail className="h-6 w-6 text-primary" />,
      buttonText: "Send Email",
    },
    {
      title: "Knowledge Base",
      description: "Browse our comprehensive guides and documentation.",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      buttonText: "View Articles",
    },
  ];

  return (
    <TradingLayout>
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground mb-3">How can we help you?</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We're here to help you get the most out of YoForex AI. Choose an option below or search our knowledge base.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {supportItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground mb-4">{item.description}</p>
              <Button variant="outline" className="w-full">
                {item.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4 md:mb-0 md:mr-6">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-1">Need urgent help?</h3>
              <p className="text-muted-foreground mb-4 md:mb-0">
                Our support team is available 24/7 to assist you with any urgent issues.
              </p>
            </div>
            <Button className="w-full md:w-auto mt-4 md:mt-0 md:ml-auto bg-gradient-primary hover:bg-primary-hover">
              Emergency Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </TradingLayout>
  );
}