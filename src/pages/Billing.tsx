import { useState } from "react";
import { TradingLayout } from "@/components/layout/TradingLayout";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Plus,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Search
} from "lucide-react";

const currentPlan = {
  name: "Pro",
  price: 69,
  period: "month",
  creditsRemaining: 1847,
  creditsTotal: 2500,
  renewalDate: "2024-02-15",
  status: "active"
};

const transactionHistory = [
  {
    id: "TXN-2024-001",
    type: "subscription",
    description: "Pro Plan - Monthly Subscription",
    amount: -69.00,
    currency: "USD",
    date: "2024-01-15",
    status: "completed",
    paymentMethod: "Cashfree - UPI",
    invoice: "INV-2024-001"
  },
  {
    id: "TXN-2024-002", 
    type: "credits",
    description: "Additional Credits Purchase",
    amount: -25.00,
    currency: "USD",
    date: "2024-01-20",
    status: "completed",
    paymentMethod: "Cashfree - Card",
    credits: 1000
  },
  {
    id: "TXN-2024-003",
    type: "deposit",
    description: "Account Deposit",
    amount: 500.00,
    currency: "USD",
    date: "2024-01-10",
    status: "completed",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "TXN-2024-004",
    type: "withdrawal",
    description: "Profit Withdrawal",
    amount: -150.00,
    currency: "USD",
    date: "2024-01-08",
    status: "processing",
    paymentMethod: "Bank Transfer"
  }
];

const creditUsage = [
  { date: "2024-01-22", single: 12, multiAI: 2, total: 3300 },
  { date: "2024-01-21", single: 8, multiAI: 1, total: 1950 },
  { date: "2024-01-20", single: 15, multiAI: 0, total: 2250 },
  { date: "2024-01-19", single: 6, multiAI: 3, total: 3150 },
  { date: "2024-01-18", single: 10, multiAI: 1, total: 2250 }
];

export function Billing() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [creditAmount, setCreditAmount] = useState(1000);

  const getCreditCost = (credits: number) => {
    const baseRate = currentPlan.name === "Max" ? 20 : 25;
    return (credits / 1000) * baseRate;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-trading-profit";
      case "processing": return "text-yellow-500";
      case "failed": return "text-trading-loss";
      default: return "text-muted-foreground";
    }
  };



  return (
    <TradingLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold heading-trading">Billing & Payments</h1>
            <p className="text-muted-foreground mt-1">
              Manage your subscription, credits, and payment history
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Dialog open={showAddCredits} onOpenChange={setShowAddCredits}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Buy Credits
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Purchase Additional Credits</DialogTitle>
                  <DialogDescription>
                    Add more credits to your account for additional AI analyses
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="credits">Number of Credits</Label>
                    <Select onValueChange={(value) => setCreditAmount(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select credit amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000">1,000 credits - ${getCreditCost(1000)}</SelectItem>
                        <SelectItem value="2500">2,500 credits - ${getCreditCost(2500)}</SelectItem>
                        <SelectItem value="5000">5,000 credits - ${getCreditCost(5000)}</SelectItem>
                        <SelectItem value="10000">10,000 credits - ${getCreditCost(10000)}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-dark rounded-lg">
                    <span>Total Cost:</span>
                    <span className="text-xl font-bold text-foreground">${getCreditCost(creditAmount)}</span>
                  </div>
                  <Button className="w-full btn-trading-primary">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Purchase Credits
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button className="btn-trading-primary">
              <Download className="h-4 w-4 mr-2" />
              Download Statement
            </Button>
          </div>
        </div>

        {/* Current Plan Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="trading-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Current Plan</h3>
                <p className="text-sm text-muted-foreground">Active subscription</p>
              </div>
              <Badge className="bg-gradient-primary">
                {currentPlan.name}
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Monthly Cost:</span>
                <span className="font-medium text-foreground">${currentPlan.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Next Billing:</span>
                <span className="font-medium text-foreground">{currentPlan.renewalDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3 text-trading-profit" />
                  <span className="text-sm font-medium text-trading-profit">Active</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            </div>
          </Card>

          <Card className="trading-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Credits Remaining</h3>
                <p className="text-sm text-muted-foreground">Today's allowance</p>
              </div>
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{currentPlan.creditsRemaining.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">of {currentPlan.creditsTotal.toLocaleString()} credits</p>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full" 
                  style={{ width: `${(currentPlan.creditsRemaining / currentPlan.creditsTotal) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Resets in 6h 23m</span>
                <span>{Math.round((currentPlan.creditsRemaining / currentPlan.creditsTotal) * 100)}%</span>
              </div>
            </div>
          </Card>

          <Card className="trading-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Account Balance</h3>
                <p className="text-sm text-muted-foreground">Available funds</p>
              </div>
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">$2,847.92</p>
                <p className="text-sm text-trading-profit">+$124.50 today</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" className="btn-trading-primary">
                  <Plus className="h-3 w-3 mr-1" />
                  Deposit
                </Button>
                <Button size="sm" variant="outline">
                  <ArrowDownLeft className="h-3 w-3 mr-1" />
                  Withdraw
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Billing Tabs */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="credits">Credit Usage</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          {/* Transaction History */}
          <TabsContent value="transactions">
            <Card className="trading-card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
                    <p className="text-sm text-muted-foreground">All account transactions and payments</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search transactions..." className="pl-10 w-64" />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="subscription">Subscriptions</SelectItem>
                        <SelectItem value="credits">Credits</SelectItem>
                        <SelectItem value="deposit">Deposits</SelectItem>
                        <SelectItem value="withdrawal">Withdrawals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {transactionHistory.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-dark border border-border/20">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-primary/10 flex items-center justify-center">
                          {transaction.type === 'subscription' && <Calendar className="h-5 w-5 text-primary" />}
                          {transaction.type === 'credits' && <Wallet className="h-5 w-5 text-secondary" />}
                          {transaction.type === 'deposit' && <ArrowUpRight className="h-5 w-5 text-trading-profit" />}
                          {transaction.type === 'withdrawal' && <ArrowDownLeft className="h-5 w-5 text-trading-loss" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{transaction.description}</p>
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <span>{transaction.date}</span>
                            <span>•</span>
                            <span>{transaction.paymentMethod}</span>
                            {transaction.credits && (
                              <>
                                <span>•</span>
                                <span>{transaction.credits.toLocaleString()} credits</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className={`font-semibold ${
                          transaction.amount > 0 ? 'text-trading-profit' : 'text-foreground'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <div className={`flex items-center space-x-1 ${getStatusColor(transaction.status)}`}>
                          {transaction.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                          {transaction.status === 'processing' && <Loader2 className="h-3 w-3 animate-spin" />}
                          {transaction.status === 'failed' && <AlertTriangle className="h-3 w-3" />}
                          <span className="text-sm font-medium capitalize">{transaction.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Credit Usage */}
          <TabsContent value="credits">
            <Card className="trading-card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Credit Usage Analytics</h3>
                    <p className="text-sm text-muted-foreground">Daily credit consumption breakdown</p>
                  </div>
                  <Select defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">7 Days</SelectItem>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="90days">90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {creditUsage.map((usage, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-dark border border-border/20">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-secondary/10 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{usage.date}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{usage.single} single analyses</span>
                            <span>•</span>
                            <span>{usage.multiAI} multi-AI analyses</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{usage.total.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">credits used</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Invoices */}
          <TabsContent value="invoices">
            <Card className="trading-card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Invoices & Receipts</h3>
                    <p className="text-sm text-muted-foreground">Download your billing documents</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>

                <div className="space-y-4">
                  {transactionHistory.filter(t => t.invoice).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-dark border border-border/20">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-primary/10 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{invoice.invoice}</p>
                          <p className="text-sm text-muted-foreground">{invoice.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium text-foreground">${Math.abs(invoice.amount).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">{invoice.date}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TradingLayout>
  );
}