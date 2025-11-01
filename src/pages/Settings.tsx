import { useState, useEffect, useCallback } from "react";
import { TradingLayout } from "@/components/layout/TradingLayout";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Zap,
  Target,
  Smartphone,
  Mail,
  Database,
  Key,
  Lock,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Star,
  Globe,
  Clock,
  Volume2,
  Download,
  Upload,
  Trash2,
  Monitor,
  Activity,
  TrendingUp,
  DollarSign,
  Gauge,
  BarChart3,
  Calendar,
  Users,
  FileText,
  Link as LinkIcon,
  Info,
  Eye,
  EyeOff,
  XCircle,
} from "lucide-react";

interface NotificationSettings {
  trades: boolean;
  signals: boolean;
  news: boolean;
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface NotificationPriority {
  trades: 'high' | 'normal' | 'low';
  signals: 'high' | 'normal' | 'low';
  news: 'high' | 'normal' | 'low';
}

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface TrustedDevice {
  id: string;
  name: string;
  type: string;
  addedDate: string;
}

export function Settings() {
  const { toast } = useToast();
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [recentlyChanged, setRecentlyChanged] = useState<Set<string>>(new Set());
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [riskLevel, setRiskLevel] = useState([2]);
  const [maxPositions, setMaxPositions] = useState([5]);
  const [defaultPositionSize, setDefaultPositionSize] = useState("0.1");
  const [profitTarget, setProfitTarget] = useState("5");
  const [favoritePairs, setFavoritePairs] = useState<string[]>(["EUR/USD", "GBP/USD"]);
  const [sessionPreset, setSessionPreset] = useState("24/7");
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    trades: true,
    signals: true,
    news: false,
    email: true,
    push: false,
    sms: true
  });
  
  const [notificationPriority, setNotificationPriority] = useState<NotificationPriority>({
    trades: 'high',
    signals: 'high',
    news: 'normal'
  });
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundType, setSoundType] = useState("chime");
  const [weekdayNotifications, setWeekdayNotifications] = useState(true);
  const [weekendNotifications, setWeekendNotifications] = useState(false);
  
  const [securityScore, setSecurityScore] = useState(78);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [sessions, setSessions] = useState<Session[]>([
    { id: '1', device: 'Chrome on Windows', location: 'New York, USA', lastActive: '2 min ago', current: true },
    { id: '2', device: 'Safari on iPhone', location: 'New York, USA', lastActive: '2 hours ago', current: false },
    { id: '3', device: 'Firefox on MacBook', location: 'Boston, USA', lastActive: '1 day ago', current: false },
  ]);
  
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>([
    { id: '1', name: 'Personal Laptop', type: 'Windows PC', addedDate: 'Jan 15, 2024' },
    { id: '2', name: 'iPhone 15 Pro', type: 'Mobile', addedDate: 'Feb 20, 2024' },
  ]);
  
  const [apiCallsToday, setApiCallsToday] = useState(1247);
  const [apiLimit, setApiLimit] = useState(5000);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [rateLimit, setRateLimit] = useState([100]);

  const availablePairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "EUR/GBP", "GBP/JPY", "EUR/JPY"];

  const markAsChanged = (field: string) => {
    setHasUnsavedChanges(true);
    setRecentlyChanged(prev => new Set(prev).add(field));
    setTimeout(() => {
      setRecentlyChanged(prev => {
        const next = new Set(prev);
        next.delete(field);
        return next;
      });
    }, 3000);
  };

  const getRiskColor = (level: number) => {
    if (level === 1) return 'text-green-500';
    if (level === 2) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskBgColor = (level: number) => {
    if (level === 1) return 'bg-green-500/10 border-green-500/30';
    if (level === 2) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  const getPriorityColor = (priority: 'high' | 'normal' | 'low') => {
    if (priority === 'high') return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (priority === 'normal') return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
    return strength;
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const handleSaveSettings = () => {
    setHasUnsavedChanges(false);
    toast({
      title: "Settings Saved",
      description: "Your trading preferences have been updated successfully.",
    });
  };

  const handleResetDefaults = () => {
    setRiskLevel([2]);
    setMaxPositions([5]);
    setDefaultPositionSize("0.1");
    setProfitTarget("5");
    setFavoritePairs(["EUR/USD", "GBP/USD"]);
    setSessionPreset("24/7");
    setNotifications({
      trades: true,
      signals: true,
      news: false,
      email: true,
      push: false,
      sms: true
    });
    setNotificationPriority({
      trades: 'high',
      signals: 'high',
      news: 'normal'
    });
    setSoundEnabled(true);
    setSoundType("chime");
    setWeekdayNotifications(true);
    setWeekendNotifications(false);
    setRateLimit([100]);
    setHasUnsavedChanges(false);
    setShowResetDialog(false);
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  const handleUpdatePassword = () => {
    if (passwordStrength < 60) {
      toast({
        title: "Weak Password",
        description: "Please use a stronger password.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setPasswordStrength(0);
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your account data will be downloaded shortly.",
    });
  };

  const handleTestWebhook = () => {
    toast({
      title: "Testing Webhook",
      description: "Sending test payload to your webhook URL...",
    });
    setTimeout(() => {
      toast({
        title: "Webhook Test Successful",
        description: "Your webhook is configured correctly.",
      });
    }, 2000);
  };

  const handleRegenerateApiKey = () => {
    toast({
      title: "API Key Regenerated",
      description: "Your new API key has been generated. Please update your integrations.",
    });
    setShowApiKeyDialog(false);
  };

  const handleRemoveSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    toast({
      title: "Session Removed",
      description: "The session has been terminated.",
    });
  };

  const handleRemoveTrustedDevice = (deviceId: string) => {
    setTrustedDevices(prev => prev.filter(d => d.id !== deviceId));
    toast({
      title: "Device Removed",
      description: "The device has been removed from trusted devices.",
    });
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (hasUnsavedChanges) {
        handleSaveSettings();
      }
    }
  }, [hasUnsavedChanges]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const toggleFavoritePair = (pair: string) => {
    setFavoritePairs(prev => {
      const next = prev.includes(pair) ? prev.filter(p => p !== pair) : [...prev, pair];
      markAsChanged('favoritePairs');
      return next;
    });
  };

  return (
    <TradingLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold heading-trading">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure your trading preferences and account settings
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="border-yellow-500/50 bg-yellow-500/10 text-yellow-500">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowResetDialog(true)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button 
              className="btn-trading-primary" 
              onClick={handleSaveSettings}
              disabled={!hasUnsavedChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {hasUnsavedChanges && (
          <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">You have unsaved changes</p>
                  <p className="text-xs text-muted-foreground">Press Ctrl+S or click "Save Changes" to save</p>
                </div>
              </div>
              <Button size="sm" onClick={handleSaveSettings}>
                Save Now
              </Button>
            </div>
          </Card>
        )}

        <Tabs defaultValue="trading" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gradient-to-br from-card to-card/50">
            <TabsTrigger value="trading" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80">
              <Target className="h-4 w-4 mr-2" />
              Trading
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80">
              <Database className="h-4 w-4 mr-2" />
              API & Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trading">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getRiskBgColor(riskLevel[0])}`}>
                      <Shield className={`h-5 w-5 ${getRiskColor(riskLevel[0])}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Risk Management</h3>
                      <p className="text-sm text-muted-foreground">Configure your risk parameters</p>
                    </div>
                  </div>
                  {recentlyChanged.has('risk') && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Changed</Badge>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-medium text-foreground">
                        Risk Level: {riskLevel[0] === 1 ? 'Conservative' : riskLevel[0] === 2 ? 'Moderate' : 'Aggressive'}
                      </Label>
                      <Badge className={`${getRiskBgColor(riskLevel[0])} border`}>
                        {riskLevel[0] === 1 && <CheckCircle className="h-3 w-3 mr-1" />}
                        {riskLevel[0] === 2 && <Activity className="h-3 w-3 mr-1" />}
                        {riskLevel[0] === 3 && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {riskLevel[0] === 1 ? 'Low' : riskLevel[0] === 2 ? 'Medium' : 'High'}
                      </Badge>
                    </div>
                    <Slider
                      value={riskLevel}
                      onValueChange={(val) => {
                        setRiskLevel(val);
                        markAsChanged('risk');
                      }}
                      max={3}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span className="text-green-500">Conservative</span>
                      <span className="text-yellow-500">Moderate</span>
                      <span className="text-red-500">Aggressive</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Maximum Positions: {maxPositions[0]}
                    </Label>
                    <Slider
                      value={maxPositions}
                      onValueChange={(val) => {
                        setMaxPositions(val);
                        markAsChanged('maxPositions');
                      }}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1</span>
                      <span>10</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxLoss" className="text-sm font-medium text-foreground">Max Daily Loss</Label>
                      <Input 
                        id="maxLoss" 
                        defaultValue="$500" 
                        className="mt-1" 
                        onChange={() => markAsChanged('maxLoss')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stopLoss" className="text-sm font-medium text-foreground">Default Stop Loss %</Label>
                      <Input 
                        id="stopLoss" 
                        defaultValue="2" 
                        className="mt-1"
                        onChange={() => markAsChanged('stopLoss')}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Auto Risk Management</Label>
                      <p className="text-xs text-muted-foreground">Automatically adjust position sizes</p>
                    </div>
                    <Switch 
                      defaultChecked 
                      onCheckedChange={() => markAsChanged('autoRisk')}
                    />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <Target className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Trading Preferences</h3>
                      <p className="text-sm text-muted-foreground">Customize your trading behavior</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">Favorite Currency Pairs</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {availablePairs.map(pair => (
                        <Button
                          key={pair}
                          variant={favoritePairs.includes(pair) ? "default" : "outline"}
                          size="sm"
                          className={`text-xs ${favoritePairs.includes(pair) ? 'bg-gradient-to-r from-primary to-primary/80' : ''}`}
                          onClick={() => toggleFavoritePair(pair)}
                        >
                          <Star className={`h-3 w-3 mr-1 ${favoritePairs.includes(pair) ? 'fill-current' : ''}`} />
                          {pair}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sessionPreset" className="text-sm font-medium text-foreground">Trading Session Presets</Label>
                    <Select value={sessionPreset} onValueChange={(val) => { setSessionPreset(val); markAsChanged('session'); }}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select trading session" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24/7">
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-2" />
                            24/7 Trading
                          </div>
                        </SelectItem>
                        <SelectItem value="london">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            London Session (08:00-16:00 GMT)
                          </div>
                        </SelectItem>
                        <SelectItem value="newyork">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            New York Session (13:00-21:00 GMT)
                          </div>
                        </SelectItem>
                        <SelectItem value="asian">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Asian Session (00:00-08:00 GMT)
                          </div>
                        </SelectItem>
                        <SelectItem value="overlap">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Major Session Overlaps Only
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="positionSize" className="text-sm font-medium text-foreground">Default Position Size</Label>
                      <div className="relative mt-1">
                        <Input 
                          id="positionSize" 
                          value={defaultPositionSize}
                          onChange={(e) => { setDefaultPositionSize(e.target.value); markAsChanged('positionSize'); }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">lots</span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="profitTarget" className="text-sm font-medium text-foreground">Profit Target %</Label>
                      <div className="relative mt-1">
                        <Input 
                          id="profitTarget" 
                          value={profitTarget}
                          onChange={(e) => { setProfitTarget(e.target.value); markAsChanged('profitTarget'); }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minConfidence" className="text-sm font-medium text-foreground">Min AI Confidence</Label>
                      <Input 
                        id="minConfidence" 
                        defaultValue="75" 
                        className="mt-1"
                        onChange={() => markAsChanged('minConfidence')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxSpread" className="text-sm font-medium text-foreground">Max Spread (pips)</Label>
                      <Input 
                        id="maxSpread" 
                        defaultValue="3" 
                        className="mt-1"
                        onChange={() => markAsChanged('maxSpread')}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all p-6 lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <Zap className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">AI Model Configuration</h3>
                    <p className="text-sm text-muted-foreground">Configure AI model preferences and weightings</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: "GPT 4.1", accuracy: 89, weight: 40, enabled: true },
                    { name: "Claude 3.5 Sonnet", accuracy: 91, weight: 35, enabled: true },
                    { name: "Gemini 1.5 Pro", accuracy: 87, weight: 25, enabled: false }
                  ].map((model) => (
                    <div key={model.name} className="p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted/20 border border-border/20 hover:border-primary/30 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-foreground">{model.name}</span>
                        <Switch 
                          defaultChecked={model.enabled}
                          onCheckedChange={() => markAsChanged('aiModels')}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Accuracy:</span>
                          <span className="text-foreground font-medium">{model.accuracy}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Weight:</span>
                          <span className="text-foreground font-medium">{model.weight}%</span>
                        </div>
                        <Slider 
                          defaultValue={[model.weight]} 
                          max={50} 
                          min={10} 
                          step={5} 
                          className="mt-2"
                          onValueChange={() => markAsChanged('aiModels')}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <Bell className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
                    <p className="text-sm text-muted-foreground">Choose how you want to receive alerts</p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {[
                    { key: 'trades', label: 'Trade Executions', desc: 'When trades are opened or closed', icon: TrendingUp },
                    { key: 'signals', label: 'AI Trading Signals', desc: 'New AI-generated trading opportunities', icon: Zap },
                    { key: 'news', label: 'Market News', desc: 'Important economic announcements', icon: FileText }
                  ].map((item) => (
                    <AccordionItem key={item.key} value={item.key}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4 text-muted-foreground" />
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <Label className="text-sm font-medium text-foreground">{item.label}</Label>
                                <Badge className={`${getPriorityColor(notificationPriority[item.key as keyof NotificationPriority])} text-xs border`}>
                                  {notificationPriority[item.key as keyof NotificationPriority]}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                          </div>
                          <Switch 
                            checked={notifications[item.key as keyof NotificationSettings]}
                            onCheckedChange={(checked) => {
                              setNotifications(prev => ({...prev, [item.key]: checked}));
                              markAsChanged('notifications');
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-7 pt-3 space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">Priority Level</Label>
                            <Select 
                              value={notificationPriority[item.key as keyof NotificationPriority]}
                              onValueChange={(val: 'high' | 'normal' | 'low') => {
                                setNotificationPriority(prev => ({...prev, [item.key]: val}));
                                markAsChanged('priority');
                              }}
                            >
                              <SelectTrigger className="w-full h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                    High Priority
                                  </div>
                                </SelectItem>
                                <SelectItem value="normal">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    Normal Priority
                                  </div>
                                </SelectItem>
                                <SelectItem value="low">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-gray-500" />
                                    Low Priority
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                    <Smartphone className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Delivery Methods</h3>
                    <p className="text-sm text-muted-foreground">How to receive notifications</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium text-foreground">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">john@example.com</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => {
                        setNotifications(prev => ({...prev, email: checked}));
                        markAsChanged('delivery');
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium text-foreground">Push Notifications</Label>
                        <p className="text-xs text-muted-foreground">Browser & mobile app</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={(checked) => {
                        setNotifications(prev => ({...prev, push: checked}));
                        markAsChanged('delivery');
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium text-foreground">SMS Alerts</Label>
                        <p className="text-xs text-muted-foreground">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.sms}
                      onCheckedChange={(checked) => {
                        setNotifications(prev => ({...prev, sms: checked}));
                        markAsChanged('delivery');
                      }}
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-sm font-medium text-foreground">Sound Notifications</Label>
                      </div>
                      <Switch 
                        checked={soundEnabled}
                        onCheckedChange={(checked) => {
                          setSoundEnabled(checked);
                          markAsChanged('sound');
                        }}
                      />
                    </div>
                    {soundEnabled && (
                      <Select value={soundType} onValueChange={(val) => { setSoundType(val); markAsChanged('sound'); }}>
                        <SelectTrigger className="w-full h-8 text-xs mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chime">Chime</SelectItem>
                          <SelectItem value="bell">Bell</SelectItem>
                          <SelectItem value="ping">Ping</SelectItem>
                          <SelectItem value="alert">Alert</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all p-6 lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <Calendar className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Notification Schedule</h3>
                    <p className="text-sm text-muted-foreground">Configure when to receive notifications</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <Clock className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-foreground">Weekday Notifications</Label>
                          <p className="text-xs text-muted-foreground">Monday - Friday</p>
                        </div>
                      </div>
                      <Switch 
                        checked={weekdayNotifications}
                        onCheckedChange={(checked) => {
                          setWeekdayNotifications(checked);
                          markAsChanged('schedule');
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/10">
                          <Calendar className="h-4 w-4 text-orange-500" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-foreground">Weekend Notifications</Label>
                          <p className="text-xs text-muted-foreground">Saturday - Sunday</p>
                        </div>
                      </div>
                      <Switch 
                        checked={weekendNotifications}
                        onCheckedChange={(checked) => {
                          setWeekendNotifications(checked);
                          markAsChanged('schedule');
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Quiet Hours</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Start Time</Label>
                        <Input 
                          defaultValue="22:00" 
                          type="time"
                          className="h-9"
                          onChange={() => markAsChanged('quietHours')}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">End Time</Label>
                        <Input 
                          defaultValue="08:00" 
                          type="time"
                          className="h-9"
                          onChange={() => markAsChanged('quietHours')}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">No notifications during these hours</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                      <Shield className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Security Score</h3>
                      <p className="text-sm text-muted-foreground">Your account security health</p>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg px-4 py-2">
                    {securityScore}/100
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Security Health</span>
                      <span className="text-foreground font-medium">{securityScore}%</span>
                    </div>
                    <Progress value={securityScore} className="h-3" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs font-medium text-foreground">2FA Enabled</span>
                      </div>
                      <p className="text-xs text-muted-foreground">+25 points</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs font-medium text-foreground">Strong Password</span>
                      </div>
                      <p className="text-xs text-muted-foreground">+20 points</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs font-medium text-foreground">Email Verified</span>
                      </div>
                      <p className="text-xs text-muted-foreground">+15 points</p>
                    </div>
                    <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-xs font-medium text-foreground">Login History</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Review needed</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                    <Lock className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Account Security</h3>
                    <p className="text-sm text-muted-foreground">Protect your trading account</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-sm font-medium text-foreground">Current Password</Label>
                    <div className="relative mt-1">
                      <Input 
                        id="currentPassword" 
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="newPassword" className="text-sm font-medium text-foreground">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      value={newPassword}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className="mt-1"
                    />
                    {newPassword && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Password Strength</span>
                          <span className={`font-medium ${
                            passwordStrength < 40 ? 'text-red-500' : 
                            passwordStrength < 70 ? 'text-yellow-500' : 
                            'text-green-500'
                          }`}>
                            {passwordStrength < 40 ? 'Weak' : passwordStrength < 70 ? 'Medium' : 'Strong'}
                          </span>
                        </div>
                        <Progress 
                          value={passwordStrength} 
                          className={`h-2 ${
                            passwordStrength < 40 ? '[&>div]:bg-red-500' : 
                            passwordStrength < 70 ? '[&>div]:bg-yellow-500' : 
                            '[&>div]:bg-green-500'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" className="mt-1" />
                  </div>

                  <Button className="w-full btn-trading-primary" onClick={handleUpdatePassword}>
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <Key className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Authenticator App</Label>
                      <p className="text-xs text-muted-foreground">Google Authenticator, Authy</p>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">Enabled</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <Label className="text-sm font-medium text-foreground">SMS Backup</Label>
                      <p className="text-xs text-muted-foreground">Backup verification method</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Login Notifications</Label>
                      <p className="text-xs text-muted-foreground">Alert on new device login</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                      <Monitor className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Active Sessions</h3>
                      <p className="text-sm text-muted-foreground">Manage your login sessions</p>
                    </div>
                  </div>
                  <Badge variant="outline">{sessions.length} Active</Badge>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {sessions.map((session) => (
                    <div key={session.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Monitor className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{session.device}</span>
                            {session.current && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">Current</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{session.location}</p>
                          <p className="text-xs text-muted-foreground">Last active: {session.lastActive}</p>
                        </div>
                        {!session.current && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => handleRemoveSession(session.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                      <Smartphone className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Trusted Devices</h3>
                      <p className="text-sm text-muted-foreground">Manage trusted devices</p>
                    </div>
                  </div>
                  <Badge variant="outline">{trustedDevices.length} Devices</Badge>
                </div>

                <div className="space-y-3">
                  {trustedDevices.map((device) => (
                    <div key={device.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{device.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{device.type}</p>
                          <p className="text-xs text-muted-foreground">Added: {device.addedDate}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => handleRemoveTrustedDevice(device.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all p-6 lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
                    <FileText className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Data & Privacy</h3>
                    <p className="text-sm text-muted-foreground">Manage your personal data (GDPR compliant)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col items-start p-4 hover:bg-primary/5 hover:border-primary/50"
                    onClick={handleExportData}
                  >
                    <Download className="h-5 w-5 mb-2 text-primary" />
                    <span className="font-medium">Export Account Data</span>
                    <span className="text-xs text-muted-foreground mt-1">Download all your data</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-auto flex-col items-start p-4 hover:bg-primary/5 hover:border-primary/50"
                  >
                    <Eye className="h-5 w-5 mb-2 text-primary" />
                    <span className="font-medium">View Login History</span>
                    <span className="text-xs text-muted-foreground mt-1">See all account activity</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-auto flex-col items-start p-4 hover:bg-red-500/10 hover:border-red-500/50"
                  >
                    <Trash2 className="h-5 w-5 mb-2 text-red-500" />
                    <span className="font-medium text-red-500">Delete Account</span>
                    <span className="text-xs text-muted-foreground mt-1">Permanently delete data</span>
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">API Usage Statistics</h3>
                      <p className="text-sm text-muted-foreground">Monitor your API consumption</p>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white">
                    {apiCallsToday} / {apiLimit} calls
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Daily Usage</span>
                      <span className="text-foreground font-medium">{Math.round((apiCallsToday / apiLimit) * 100)}%</span>
                    </div>
                    <Progress value={(apiCallsToday / apiLimit) * 100} className="h-3" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span className="text-xs font-medium text-muted-foreground">Today</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{apiCallsToday}</p>
                      <p className="text-xs text-muted-foreground mt-1">API calls</p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-xs font-medium text-muted-foreground">This Week</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">8,234</p>
                      <p className="text-xs text-muted-foreground mt-1">API calls</p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-purple-500" />
                        <span className="text-xs font-medium text-muted-foreground">Cost</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">$12.45</p>
                      <p className="text-xs text-muted-foreground mt-1">This month</p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Gauge className="h-4 w-4 text-orange-500" />
                        <span className="text-xs font-medium text-muted-foreground">Rate Limit</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{rateLimit[0]}</p>
                      <p className="text-xs text-muted-foreground mt-1">per minute</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <Key className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">API Configuration</h3>
                    <p className="text-sm text-muted-foreground">Manage your API keys and integrations</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="apiKey" className="text-sm font-medium text-foreground">Trading API Key</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input id="apiKey" defaultValue="sk-proj-xxxxxxxxxxx" type="password" className="flex-1" />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowApiKeyDialog(true)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Keep your API key secret and secure</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="webhookUrl" className="text-sm font-medium text-foreground">Webhook URL</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input 
                        id="webhookUrl" 
                        placeholder="https://your-server.com/webhook"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleTestWebhook}
                        disabled={!webhookUrl}
                      >
                        Test
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <Label className="text-sm font-medium text-foreground">API Trading Enabled</Label>
                      <p className="text-xs text-muted-foreground">Allow external API trading</p>
                    </div>
                    <Switch onCheckedChange={() => markAsChanged('apiTrading')} />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Rate Limiting: {rateLimit[0]} requests/min
                    </Label>
                    <Slider
                      value={rateLimit}
                      onValueChange={(val) => {
                        setRateLimit(val);
                        markAsChanged('rateLimit');
                      }}
                      max={200}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>10/min</span>
                      <span>200/min</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                    <Database className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Data Management</h3>
                    <p className="text-sm text-muted-foreground">Export and import your trading data</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4 hover:bg-primary/5 hover:border-primary/50"
                  >
                    <div className="flex items-start gap-3">
                      <Upload className="h-5 w-5 text-primary mt-0.5" />
                      <div className="text-left">
                        <div className="font-medium">Import Trading Data</div>
                        <p className="text-xs text-muted-foreground mt-1">Upload CSV or JSON files</p>
                      </div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4 hover:bg-primary/5 hover:border-primary/50"
                  >
                    <div className="flex items-start gap-3">
                      <Download className="h-5 w-5 text-primary mt-0.5" />
                      <div className="text-left">
                        <div className="font-medium">Export Trading Data</div>
                        <p className="text-xs text-muted-foreground mt-1">Download in CSV or JSON format</p>
                      </div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4 hover:bg-primary/5 hover:border-primary/50"
                  >
                    <div className="flex items-start gap-3">
                      <Activity className="h-5 w-5 text-primary mt-0.5" />
                      <div className="text-left">
                        <div className="font-medium">Export Analysis History</div>
                        <p className="text-xs text-muted-foreground mt-1">All AI analysis results</p>
                      </div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4 hover:bg-primary/5 hover:border-primary/50"
                  >
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary mt-0.5" />
                      <div className="text-left">
                        <div className="font-medium">Backup Settings</div>
                        <p className="text-xs text-muted-foreground mt-1">Save current configuration</p>
                      </div>
                    </div>
                  </Button>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all p-6 lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                    <LinkIcon className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Third-Party Integrations</h3>
                    <p className="text-sm text-muted-foreground">Connect with external trading platforms</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'MetaTrader 4/5', status: 'connected', icon: Activity },
                    { name: 'TradingView', status: 'connected', icon: BarChart3 },
                    { name: 'Interactive Brokers', status: 'disconnected', icon: DollarSign },
                  ].map((integration) => (
                    <div key={integration.name} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all border border-border/20">
                      <div className="flex items-start justify-between mb-3">
                        <integration.icon className="h-5 w-5 text-primary" />
                        <Badge 
                          className={integration.status === 'connected' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                          }
                        >
                          {integration.status === 'connected' ? 'Connected' : 'Disconnected'}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-foreground mb-1">{integration.name}</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        {integration.status === 'connected' ? 'Syncing data...' : 'Not connected'}
                      </p>
                      <Button 
                        variant={integration.status === 'connected' ? 'outline' : 'default'} 
                        size="sm" 
                        className="w-full"
                      >
                        {integration.status === 'connected' ? 'Manage' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset All Settings?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all your settings to their default values. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetDefaults} className="bg-red-500 hover:bg-red-600">
              Reset Settings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This will generate a new API key and invalidate the current one. You'll need to update all your integrations with the new key.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRegenerateApiKey} className="bg-yellow-500 hover:bg-yellow-600">
              Regenerate Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TradingLayout>
  );
}
