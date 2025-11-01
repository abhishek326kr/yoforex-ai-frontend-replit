import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Home,
  ArrowLeft,
  TrendingDown,
  LayoutDashboard,
  LineChart,
  CreditCard,
  HelpCircle,
  MessageSquare,
  Search,
  DollarSign,
  Mail,
  FileText,
  Shield,
  Info,
} from "lucide-react";

const NotFound = () => {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location
    );
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/dashboard");
    }
  };

  const navigationCards = [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      description: "View your trading overview",
      href: "/dashboard",
      gradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      icon: LineChart,
      title: "Live Trading",
      description: "Start analyzing markets",
      href: "/trading",
      gradient: "from-green-500/10 to-emerald-500/10",
    },
    {
      icon: CreditCard,
      title: "Pricing",
      description: "View our plans",
      href: "/pricing",
      gradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      description: "Get assistance",
      href: "/help",
      gradient: "from-orange-500/10 to-yellow-500/10",
    },
    {
      icon: MessageSquare,
      title: "Community Forum",
      description: "Connect with traders",
      href: "/forum",
      gradient: "from-indigo-500/10 to-purple-500/10",
    },
    {
      icon: ArrowLeft,
      title: "Go Back",
      description: "Return to previous page",
      onClick: () => window.history.back(),
      gradient: "from-gray-500/10 to-slate-500/10",
    },
  ];

  const quickLinks = [
    { name: "Pricing", href: "/pricing", icon: CreditCard },
    { name: "Contact Us", href: "/contact", icon: Mail },
    { name: "Terms & Conditions", href: "/terms", icon: FileText },
    { name: "Privacy Policy", href: "/privacy", icon: Shield },
    { name: "About Us", href: "/about", icon: Info },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-muted/20 px-4 py-12 overflow-hidden">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.1 
            }}
            className="inline-flex items-center justify-center mb-6"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/30"
            >
              <TrendingDown className="h-12 w-12 text-red-500" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-8xl md:text-9xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-semibold text-foreground mb-4"
          >
            This Trade Went Wrong
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            The page you're looking for doesn't exist or has been moved. Don't worry, even the best traders take wrong turns sometimes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-md mx-auto mb-12"
          >
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for pages, features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              Looking for something specific? Try searching above
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {navigationCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {card.href ? (
                <Link href={card.href}>
                  <Card className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg bg-gradient-to-br ${card.gradient} border-2 border-transparent hover:border-primary/20 h-full`}>
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <card.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {card.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              ) : (
                <Card
                  onClick={card.onClick}
                  className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg bg-gradient-to-br ${card.gradient} border-2 border-transparent hover:border-primary/20 h-full`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <card.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </Card>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="border-t border-border pt-8"
        >
          <p className="text-sm text-muted-foreground text-center mb-6">
            Quick Links
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {quickLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-primary/10"
                >
                  <link.icon className="h-3 w-3" />
                  {link.name}
                </Button>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <DollarSign className="h-3 w-3" />
            Remember: Every loss is a lesson in the market
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
