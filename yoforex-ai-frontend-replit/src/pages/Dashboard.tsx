import { TradingLayout } from "@/components/layout/TradingLayout";
import { 
  Brain, Zap, TrendingUp, TrendingDown, DollarSign, Target, Activity, 
  BarChart3, ArrowRight, CreditCard, Plus, Upload, Award, Shield,
  AlertTriangle, CheckCircle, Clock, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import PortfolioStatCard from "@/components/PortfolioStatCard";
import TradingTips from "@/components/TradingTips";
import ForexCrossRatesWidget from "@/components/charts/ForexCrossRatesWidget";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { profileStorage } from "@/utils/profileStorage";
import { useState, useEffect } from "react";
import { navigate } from "wouter/use-browser-location";
import RecentAISignals from "@/components/RecentAISignals";
import { API_BASE_URL } from "@/config/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";

const portfolioStats = [
  {
    title: "Active Trades",
    value: "7",
    change: "+3",
    changePercent: "Today",
    positive: true,
    icon: Activity,
  },
  {
    title: "Win Rate",
    value: "73.4%",
    change: "+2.1%",
    changePercent: "This month",
    positive: true,
    icon: Target,
  },
  {
    title: "AI Signals",
    value: "156",
    change: "+23",
    changePercent: "24h",
    positive: true,
    icon: Brain,
  },
];

const weeklyPnLData = [
  { day: 'Mon', pnl: 125 },
  { day: 'Tue', pnl: 245 },
  { day: 'Wed', pnl: 180 },
  { day: 'Thu', pnl: 320 },
  { day: 'Fri', pnl: 285 },
  { day: 'Sat', pnl: 410 },
  { day: 'Sun', pnl: 365 },
];

const topPerformingPairs = [
  { pair: 'EUR/USD', winRate: 78.5, totalTrades: 45, avgProfit: '+$125.40' },
  { pair: 'GBP/JPY', winRate: 75.2, totalTrades: 38, avgProfit: '+$98.30' },
  { pair: 'USD/JPY', winRate: 72.1, totalTrades: 52, avgProfit: '+$87.65' },
  { pair: 'AUD/USD', winRate: 68.9, totalTrades: 29, avgProfit: '+$76.20' },
  { pair: 'EUR/GBP', winRate: 65.3, totalTrades: 34, avgProfit: '+$65.80' },
];

const marketMovers = [
  { pair: 'GBP/USD', change: +2.45, direction: 'up' as const },
  { pair: 'EUR/JPY', change: +1.87, direction: 'up' as const },
  { pair: 'USD/CAD', change: -1.34, direction: 'down' as const },
  { pair: 'AUD/NZD', change: +0.98, direction: 'up' as const },
  { pair: 'EUR/CHF', change: -2.12, direction: 'down' as const },
];

const recentActivities = [
  { type: 'trade', text: 'Opened BUY position on EUR/USD', time: '2 min ago', icon: TrendingUp },
  { type: 'analysis', text: 'AI Analysis completed for GBP/JPY', time: '15 min ago', icon: Brain },
  { type: 'trade', text: 'Closed position on USD/JPY (+$45.20)', time: '1 hour ago', icon: DollarSign },
  { type: 'upgrade', text: 'Monthly credits refreshed', time: '3 hours ago', icon: Award },
  { type: 'analysis', text: 'New AI signal for AUD/USD', time: '5 hours ago', icon: Zap },
];

export function Dashboard() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    
    if (user?.email) {
      try {
        await profileStorage.initializeTables();
        const profile = await profileStorage.getProfile();
        if (profile) {
          setUserProfile(profile);
        } else {
          setUserProfile(user);
        }
      } catch (err: any) {
        console.error("Failed to load user profile:", err);
        setError(err?.message || "Failed to load dashboard data");
        setUserProfile(user);
      }
    } else {
      setUserProfile(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const displayName = userProfile?.name || user?.name || "Trader";
  const firstName = displayName.split(" ")[0];

  const themeHook = useTheme();
  const effectiveTheme =
    themeHook.theme === "system"
      ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : themeHook.theme || "light";

  if (loading) {
    return (
      <TradingLayout>
        <DashboardSkeleton />
      </TradingLayout>
    );
  }

  if (error) {
    return (
      <TradingLayout>
        <ErrorState
          title="Failed to Load Dashboard"
          message={error}
          onRetry={loadDashboard}
          showHomeButton={false}
          showSupportButton={true}
          fullPage={true}
        />
      </TradingLayout>
    );
  }

  return (
    <TradingLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-5">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {firstName}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your AI-powered trading overview.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Badge
              variant="secondary"
              className="bg-gradient-profit text-white"
            >
              <div className="h-2 w-2 rounded-full bg-white mr-2 animate-pulse" />
              Live Trading Active
            </Badge>
            <Button
              className="bg-gradient-primary hover:bg-primary-hover"
              onClick={() => navigate("/trading")}
            >
              <Zap className="h-4 w-4 mr-2" />
              Start AI Analysis
            </Button>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-primary/20 via-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Account Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Account Balance</p>
                <p className="text-3xl font-bold text-foreground">$10,250.00</p>
                <div className="flex items-center gap-2 text-sm text-trading-profit">
                  <TrendingUp className="h-4 w-4" />
                  <span>+5.2% this month</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Available Credits</p>
                <p className="text-3xl font-bold text-foreground">1,450</p>
                <p className="text-sm text-muted-foreground">credits remaining</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Subscription Plan</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white text-base px-3 py-1">
                    Pro Plan
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Renews on Dec 15</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Monthly P&L</p>
                <p className="text-3xl font-bold text-trading-profit">+12.4%</p>
                <p className="text-sm text-muted-foreground">$1,125.80 profit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioStats.map((stat, index) => {
            const Icon = stat.icon;
            const apiUrlMap: Record<string, string | undefined> = {
              "Portfolio Value": undefined,
              "Active Trades": `${API_BASE_URL}/analysis/trade/summary/active-trades/me?window_hours=24`,
              "Win Rate": `${API_BASE_URL}/analysis/trade/summary/winrate/overall?window_hours=24`,
              "AI Signals": `${API_BASE_URL}/analysis/trade/summary/ai-signals/all?window_hours=24`,
            };

            return (
              <div key={stat.title} style={{ animationDelay: `${index * 100}ms` }}>
                <PortfolioStatCard
                  title={stat.title}
                  icon={Icon}
                  apiUrl={apiUrlMap[stat.title]}
                  fallback={{ value: stat.value, change: stat.change, changePercent: stat.changePercent, positive: stat.positive }}
                />
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RecentAISignals forceFetch={true} />

            <Card className="bg-gradient-glass backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Weekly P&L Performance
                </CardTitle>
                <CardDescription>Your profit/loss trend for the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weeklyPnLData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '0.75rem' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '0.75rem' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pnl" 
                      stroke="hsl(var(--trading-profit))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--trading-profit))', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary"
                    onClick={() => navigate("/trading")}
                  >
                    <Brain className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">New Analysis</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary"
                    onClick={() => navigate("/active-trades")}
                  >
                    <Activity className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">View Trades</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary"
                    onClick={() => navigate("/billing")}
                  >
                    <CreditCard className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Add Funds</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-gradient-profit hover:text-white hover:border-transparent"
                    onClick={() => navigate("/pricing")}
                  >
                    <Award className="h-6 w-6" />
                    <span className="text-sm font-medium">Upgrade Plan</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-glass backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Top Performing Pairs
                </CardTitle>
                <CardDescription>Best currency pairs by win rate</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pair</TableHead>
                      <TableHead className="text-right">Win Rate</TableHead>
                      <TableHead className="text-right">Trades</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topPerformingPairs.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.pair}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-trading-profit font-semibold">
                            {item.winRate}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {item.totalTrades}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-glass backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Market Movers (24h)
              </CardTitle>
              <CardDescription>Biggest price movements today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketMovers.map((mover, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-border/10"
                  >
                    <div className="flex items-center gap-2">
                      {mover.direction === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-trading-profit" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-trading-loss" />
                      )}
                      <span className="font-medium">{mover.pair}</span>
                    </div>
                    <span 
                      className={`font-semibold ${
                        mover.direction === 'up' ? 'text-trading-profit' : 'text-trading-loss'
                      }`}
                    >
                      {mover.change > 0 ? '+' : ''}{mover.change}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-glass backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest trading activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-glass backdrop-blur-sm border-border/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Risk Metrics
              </CardTitle>
              <CardDescription>Current risk exposure analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Max Drawdown</span>
                    <span className="font-semibold text-trading-loss">-8.2%</span>
                  </div>
                  <Progress value={8.2} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Risk/Reward Ratio</span>
                    <span className="font-semibold text-trading-profit">1:2.3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-trading-profit" />
                    <span className="text-xs text-muted-foreground">Optimal range</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Open Positions Risk</span>
                    <span className="font-semibold text-foreground">$450.00</span>
                  </div>
                  <Progress value={18} className="h-2" />
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs text-muted-foreground">18% of account balance</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <TradingTips />

        <div className="hidden md:block">
          <ForexCrossRatesWidget theme={effectiveTheme} height={600} />
        </div>
      </div>
    </TradingLayout>
  );
}
