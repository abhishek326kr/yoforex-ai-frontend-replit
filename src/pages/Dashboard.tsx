import { TradingLayout } from "@/components/layout/TradingLayout";
import { Brain, Zap, TrendingUp, TrendingDown, DollarSign, Target, Activity, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
							"Active Trades": `${API_BASE_URL}/analysis/trade/active/count`,
							"Win Rate": `${API_BASE_URL}/analysis/history/winrate/overall`,
							"AI Signals": "https://backend.axiontrust.com/analysis/history/all?page=1",
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
				<ForexCrossRatesWidget theme={effectiveTheme} height={600} />

				
			</div>
		</TradingLayout>
	);
}