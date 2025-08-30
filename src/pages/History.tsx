import { TradingLayout } from "@/components/layout/TradingLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  History as HistoryIcon,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  BarChart3
} from "lucide-react";

const tradeHistory = [
  {
    id: "TXN-001",
    pair: "EUR/USD",
    direction: "BUY",
    entryPrice: "1.0820",
    exitPrice: "1.0847",
    lotSize: "0.1",
    profit: "+$27.00",
    profitable: true,
    openTime: "2024-01-15 09:30:00",
    closeTime: "2024-01-15 11:45:00",
    duration: "2h 15m",
    aiModel: "GPT-4.1",
    confidence: 89,
    strategy: "Breakout Strategy"
  },
  {
    id: "TXN-002",
    pair: "GBP/JPY",
    direction: "SELL",
    entryPrice: "189.45",
    exitPrice: "188.20",
    lotSize: "0.05",
    profit: "+$62.50",
    profitable: true,
    openTime: "2024-01-15 14:20:00",
    closeTime: "2024-01-15 16:30:00",
    duration: "2h 10m",
    aiModel: "Claude 3.5 Sonnet",
    confidence: 82,
    strategy: "SMC Strategy"
  },
  {
    id: "TXN-003",
    pair: "USD/JPY",
    direction: "BUY",
    entryPrice: "149.82",
    exitPrice: "149.45",
    lotSize: "0.1",
    profit: "-$37.00",
    profitable: false,
    openTime: "2024-01-14 10:15:00",
    closeTime: "2024-01-14 12:20:00",
    duration: "2h 5m",
    aiModel: "Gemini 1.5 Pro",
    confidence: 76,
    strategy: "Trend Following"
  },
  {
    id: "TXN-004",
    pair: "AUD/USD",
    direction: "SELL",
    entryPrice: "0.6542",
    exitPrice: "0.6515",
    lotSize: "0.2",
    profit: "+$54.00",
    profitable: true,
    openTime: "2024-01-14 08:00:00",
    closeTime: "2024-01-14 10:30:00",
    duration: "2h 30m",
    aiModel: "GPT-4.1",
    confidence: 91,
    strategy: "ICT Concept"
  }
];

const performanceStats = [
  { title: "Total Trades", value: "147", subtitle: "This month" },
  { title: "Win Rate", value: "73.4%", subtitle: "+2.1% vs last month" },
  { title: "Total P&L", value: "+$2,847.92", subtitle: "Net profit" },
  { title: "Best Trade", value: "+$184.50", subtitle: "EUR/GBP trade" }
];

export function History() {
  return (
    <TradingLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold heading-trading">Trading History</h1>
            <p className="text-muted-foreground mt-1">
              Complete record of your AI-powered trading activities
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button className="btn-trading-primary">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics Report
            </Button>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceStats.map((stat, index) => (
            <Card key={stat.title} className={`trading-card-hover p-6 fade-in-up`} style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-gradient-primary/10 flex items-center justify-center">
                  <HistoryIcon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="trading-card p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search trades..." className="pl-10 w-64" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pairs</SelectItem>
                  <SelectItem value="eur">EUR/USD</SelectItem>
                  <SelectItem value="gbp">GBP/USD</SelectItem>
                  <SelectItem value="usd">USD/JPY</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trades</SelectItem>
                  <SelectItem value="profit">Profitable</SelectItem>
                  <SelectItem value="loss">Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Trading History Table */}
        <Card className="trading-card">
          <div className="p-6">
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">All Trades</TabsTrigger>
                <TabsTrigger value="manual">Manual</TabsTrigger>
                <TabsTrigger value="automated">Automated</TabsTrigger>
                <TabsTrigger value="signals">Signal Copy</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Trade ID</TableHead>
                        <TableHead>Currency Pair</TableHead>
                        <TableHead>Direction</TableHead>
                        <TableHead>Entry/Exit</TableHead>
                        <TableHead>Lot Size</TableHead>
                        <TableHead>P&L</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>AI Model</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Strategy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tradeHistory.map((trade) => (
                        <TableRow key={trade.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{trade.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{trade.pair}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={trade.direction === 'BUY' ? 'default' : 'destructive'}
                              className={trade.direction === 'BUY' ? 'signal-buy' : 'signal-sell'}
                            >
                              {trade.direction}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{trade.entryPrice} → {trade.exitPrice}</div>
                            </div>
                          </TableCell>
                          <TableCell>{trade.lotSize}</TableCell>
                          <TableCell>
                            <span className={`font-semibold ${
                              trade.profitable ? 'text-profit' : 'text-loss'
                            }`}>
                              {trade.profit}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{trade.duration}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{trade.aiModel}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                              <span className="text-sm">{trade.confidence}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{trade.strategy}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>

        {/* Performance Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="trading-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Profit & Loss Trend</h3>
                <p className="text-sm text-muted-foreground">Daily P&L over the last 30 days</p>
              </div>
              <Badge variant="outline" className="bg-gradient-profit/20 text-trading-profit">
                +$2,847.92
              </Badge>
            </div>
            <div className="h-64 bg-gradient-dark rounded-lg border border-border/20 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">P&L Chart Visualization</p>
              </div>
            </div>
          </Card>

          <Card className="trading-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Win Rate Analysis</h3>
                <p className="text-sm text-muted-foreground">Success rate by currency pair</p>
              </div>
              <Badge variant="outline" className="bg-gradient-primary/20 text-primary">
                73.4% Overall
              </Badge>
            </div>
            <div className="space-y-4">
              {[
                { pair: "EUR/USD", winRate: 78, trades: 45 },
                { pair: "GBP/USD", winRate: 71, trades: 32 },
                { pair: "USD/JPY", winRate: 69, trades: 38 },
                { pair: "AUD/USD", winRate: 75, trades: 32 }
              ].map((item) => (
                <div key={item.pair} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-foreground w-20">{item.pair}</span>
                    <div className="flex-1 bg-muted/30 rounded-full h-2 w-32">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full" 
                        style={{ width: `${item.winRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-foreground">{item.winRate}%</span>
                    <p className="text-xs text-muted-foreground">{item.trades} trades</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </TradingLayout>
  );
}