import { TradingLayout } from "@/components/layout/TradingLayout";
import { Brain, Zap, TrendingUp, TrendingDown, DollarSign, Target, Activity, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
<<<<<<< HEAD
import PortfolioStatCard from "@/components/PortfolioStatCard";
import TradingTips from "@/components/TradingTips";

import ForexCrossRatesWidget from "@/components/charts/ForexCrossRatesWidget";
import { useTheme } from "@/hooks/useTheme";
=======
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import TradingTips from "@/components/TradingTips";
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
import { useAuth } from "@/hooks/useAuth";
import { profileStorage } from "@/utils/profileStorage";
import { useState, useEffect } from "react";
import { navigate } from "wouter/use-browser-location";
<<<<<<< HEAD
import RecentAISignals from "@/components/RecentAISignals";
import { API_BASE_URL } from "@/config/api";


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

const recentSignals = [
	{
		pair: "EUR/USD",
		direction: "BUY",
		confidence: 89,
		entry: "1.0847",
		target: "1.0875",
		time: "2 min ago",
		aiModel: "GPT-4.1",
	},
	{
		pair: "GBP/JPY",
		direction: "SELL",
		confidence: 82,
		entry: "189.45",
		target: "188.20",
		time: "8 min ago",
		aiModel: "Claude 4 Sonnet",
	},
	{
		pair: "USD/CAD",
		direction: "BUY",
		confidence: 76,
		entry: "1.3612",
		target: "1.3648",
		time: "15 min ago",
		aiModel: "Gemini 2.5 Pro",
	},
];



export function Dashboard() {
	const { user } = useAuth();
	const [userProfile, setUserProfile] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadUserProfile = async () => {
			if (user?.email) {
				try {
					await profileStorage.initializeTables();
					const profile = await profileStorage.getProfile();
					if (profile) {
						setUserProfile(profile);
					} else {
						// If no profile in storage, use the user data from auth context
						setUserProfile(user);
					}
				} catch (error) {
					console.error("Failed to load user profile:", error);
					// Fallback to auth context user data
					setUserProfile(user);
				}
			} else {
				setUserProfile(null);
			}
			setLoading(false);
		};

		loadUserProfile();
	}, [user]);

	// Prioritize fetched profile data over auth context data
	const displayName = userProfile?.name || user?.name || "Trader";
	const firstName = displayName.split(" ")[0];

	// Derive effective theme once at component scope to avoid calling hooks inside callbacks
	const themeHook = useTheme();
	const effectiveTheme =
		themeHook.theme === "system"
			? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light"
			: themeHook.theme || "light";

	return (
		<TradingLayout>
			<div className="space-y-6">
				{/* Welcome Header */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-5">
					<div>
						<h1 className="text-3xl font-bold text-foreground">
							Welcome back, {firstName}!
						</h1>
						<p className="text-muted-foreground mt-1">
							"Here's your AI-powered trading overview."
						</p>
					</div>
					<div className="flex items-center space-x-3 mt-4 sm:mt-0">
						{userProfile && (
							<div className="hidden flex-col items-end mr-3">
								<span className="text-sm font-medium text-foreground">
									{userProfile.name}
								</span>
								<div className="flex items-center space-x-2 text-xs text-muted-foreground">
									{userProfile.location && <span>{userProfile.location}</span>}
									{userProfile.preferred_pairs && (
										<span className="text-primary">
											{
												userProfile.preferred_pairs.split(",")[0]?.trim()
											}
										</span>
									)}
								</div>
							</div>
						)}
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

				{/* Portfolio Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{portfolioStats.map((stat, index) => {
						const Icon = stat.icon;
						// Example apiUrl mapping (replace with real endpoints)
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

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Recent AI Signals - use backend pagination/live data */}
					<div className="lg:col-span-2">
						<RecentAISignals forceFetch={true} />
					</div>

					{/*  leteest news */}
                       <TradingTips/>

					
				</div>

				{/* Market Overview (Forex cross rates widget) */}
				<div className="hidden md:block">
					<ForexCrossRatesWidget theme={effectiveTheme} height={600} />
				</div>

				
			</div>
		</TradingLayout>
	);
=======

const portfolioStats = [
  {
    title: "Portfolio Value",
    value: "$12,847.92",
    change: "+$1,247.83",
    changePercent: "+10.8%",
    positive: true,
    icon: DollarSign
  },
  {
    title: "Active Trades",
    value: "7",
    change: "+3",
    changePercent: "Today",
    positive: true,
    icon: Activity
  },
  {
    title: "Win Rate",
    value: "73.4%",
    change: "+2.1%",
    changePercent: "This month",
    positive: true,
    icon: Target
  },
  {
    title: "AI Signals",
    value: "156",
    change: "+23",
    changePercent: "24h",
    positive: true,
    icon: Brain
  }
];

const recentSignals = [
  {
    pair: "EUR/USD",
    direction: "BUY",
    confidence: 89,
    entry: "1.0847",
    target: "1.0875",
    time: "2 min ago",
    aiModel: "GPT-4.1"
  },
  {
    pair: "GBP/JPY",
    direction: "SELL",
    confidence: 82,
    entry: "189.45",
    target: "188.20",
    time: "8 min ago",
    aiModel: "Claude 4 Sonnet"
  },
  {
    pair: "USD/CAD",
    direction: "BUY",
    confidence: 76,
    entry: "1.3612",
    target: "1.3648",
    time: "15 min ago",
    aiModel: "Gemini 2.5 Pro"
  }
];

const aiModels = [
  { name: "GPT-4.1", status: "active", accuracy: "89%", signals: "12" },
  { name: "Claude 4 Sonnet", status: "active", accuracy: "91%", signals: "8" },
  { name: "Gemini 2.5 Pro", status: "standby", accuracy: "87%", signals: "5" },
  { name: "Mistral 7B", status: "active", accuracy: "72%", signals: "15" }
];

export function Dashboard() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user?.email) {
        try {
          await profileStorage.initializeTables();
          const profile = await profileStorage.getProfile();
          if (profile) {
            setUserProfile(profile);
          } else {
            // If no profile in storage, use the user data from auth context
            setUserProfile(user);
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
          // Fallback to auth context user data
          setUserProfile(user);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    };

    loadUserProfile();
  }, [user]);

  // Prioritize fetched profile data over auth context data
  const displayName = userProfile?.name || user?.name || 'Trader';
  const firstName = displayName.split(' ')[0];

  return (
    <TradingLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-5">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {firstName}!</h1>
            <p className="text-muted-foreground mt-1">
              {userProfile ? (
                <span>
                  Here's your AI-powered trading overview.
                  {userProfile.trading_experience && (
                    <span className="ml-2 text-primary font-medium">
                      Experience: {userProfile.trading_experience}
                    </span>
                  )}
                </span>
              ) : (
                "Here's your AI-powered trading overview."
              )}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {userProfile && (
              <div className="hidden flex-col items-end mr-3">
                <span className="text-sm font-medium text-foreground">{userProfile.name}</span>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  {userProfile.location && <span>{userProfile.location}</span>}
                  {userProfile.preferred_pairs && (
                    <span className="text-primary">
                      {userProfile.preferred_pairs.split(',')[0]?.trim()}
                    </span>
                  )}
                </div>
              </div>
            )}
            <Badge variant="secondary" className="bg-gradient-profit text-white">
              <div className="h-2 w-2 rounded-full bg-white mr-2 animate-pulse" />
              Live Trading Active
            </Badge>
            <Button className="bg-gradient-primary hover:bg-primary-hover" onClick={()=>navigate('')}>
              <Zap className="h-4 w-4 mr-2" />
              Start AI Analysis
            </Button>
          </div>
        </div>

        {/* Portfolio Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className={`trading-card-hover p-6 fade-in-up`} style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                    <div className={`flex items-center mt-2 text-sm ${
                      stat.positive ? 'text-trading-profit' : 'text-trading-loss'
                    }`}>
                      {stat.positive ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span className="font-medium">{stat.change}</span>
                      <span className="text-muted-foreground ml-1">{stat.changePercent}</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent AI Signals */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Recent AI Signals</h3>
                  <p className="text-sm text-muted-foreground">Latest trading opportunities from AI analysis</p>
                </div>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {recentSignals.map((signal, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/10 hover:border-border/30 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        signal.direction === 'BUY' 
                          ? 'bg-trading-profit/20 text-trading-profit' 
                          : 'bg-trading-loss/20 text-trading-loss'
                      }`}>
                        {signal.direction}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{signal.pair}</p>
                        <p className="text-xs text-muted-foreground">{signal.aiModel}</p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{signal.entry}</p>
                      <p className="text-xs text-muted-foreground">Entry</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{signal.target}</p>
                      <p className="text-xs text-muted-foreground">Target</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm font-medium text-foreground">{signal.confidence}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{signal.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* AI Models Status */}
          <div>
            <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">AI Models</h3>
                  <p className="text-sm text-muted-foreground">Active analysis engines</p>
                </div>
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              
              <div className="space-y-4">
                {aiModels.map((model, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-border/10">
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${
                        model.status === 'active' ? 'bg-trading-profit animate-pulse' : 'bg-muted'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{model.name}</p>
                        <p className="text-xs text-muted-foreground">{model.signals} signals today</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{model.accuracy}</p>
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4 bg-gradient-primary hover:bg-primary-hover">
                <Brain className="h-4 w-4 mr-2" />
                Configure Models
              </Button>
            </Card>
          </div>
        </div>

        {/* Market Overview */}
        <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/20 ">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Market Overview</h3>
              <p className="text-sm text-muted-foreground">Key forex pairs and market sentiment</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-trading-profit animate-pulse" />
              <span className="text-sm text-foreground">Markets Open</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { pair: "EUR/USD", price: "1.0847", change: "+0.23%", sentiment: "Bullish" },
              { pair: "GBP/USD", price: "1.2634", change: "-0.15%", sentiment: "Bearish" },
              { pair: "USD/JPY", price: "149.82", change: "+0.34%", sentiment: "Bullish" },
              { pair: "AUD/USD", price: "0.6542", change: "-0.08%", sentiment: "Neutral" }
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-lg bg-card/30 border border-border/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{item.pair}</span>
                  <Badge variant={item.sentiment === 'Bullish' ? 'default' : item.sentiment === 'Bearish' ? 'destructive' : 'secondary'} className="text-xs">
                    {item.sentiment}
                  </Badge>
                </div>
                <p className="text-xl font-bold text-foreground">{item.price}</p>
                <p className={`text-sm ${
                  item.change.startsWith('+') ? 'text-trading-profit' : 'text-trading-loss'
                }`}>
                  {item.change}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/20">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-lg font-semibold">Market News & Insights</CardTitle>
          </CardHeader>
          <div className="relative">
            <div className="overflow-x-auto pb-4 -mx-2">
              <TradingTips horizontalLayout={true} />
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
          </div>
        </Card>
      </div>
    </TradingLayout>
  );
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
}