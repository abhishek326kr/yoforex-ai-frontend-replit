import { useState } from "react";
import { TradingLayout } from "@/components/layout/TradingLayout";
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
  RefreshCw
} from "lucide-react";

export function Settings() {
  const [riskLevel, setRiskLevel] = useState([2]);
  const [maxPositions, setMaxPositions] = useState([5]);
  const [notifications, setNotifications] = useState({
    trades: true,
    signals: true,
    news: false,
    email: true,
    push: false,
    sms: true
  });

  return (
    <TradingLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold heading-trading">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure your trading preferences and account settings
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button className="btn-trading-primary">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="trading" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="api">API & Data</TabsTrigger>
          </TabsList>

          {/* Trading Settings */}
          <TabsContent value="trading">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Management */}
              <Card className="trading-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Risk Management</h3>
                    <p className="text-sm text-muted-foreground">Configure your risk parameters</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Risk Level: {riskLevel[0] === 1 ? 'Conservative' : riskLevel[0] === 2 ? 'Moderate' : 'Aggressive'}
                    </Label>
                    <Slider
                      value={riskLevel}
                      onValueChange={setRiskLevel}
                      max={3}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Conservative</span>
                      <span>Moderate</span>
                      <span>Aggressive</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Maximum Positions: {maxPositions[0]}
                    </Label>
                    <Slider
                      value={maxPositions}
                      onValueChange={setMaxPositions}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxLoss" className="text-sm font-medium text-foreground">Max Daily Loss</Label>
                      <Input id="maxLoss" defaultValue="$500" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="stopLoss" className="text-sm font-medium text-foreground">Default Stop Loss %</Label>
                      <Input id="stopLoss" defaultValue="2" className="mt-1" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Auto Risk Management</Label>
                      <p className="text-xs text-muted-foreground">Automatically adjust position sizes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>

              {/* Trading Preferences */}
              <Card className="trading-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Target className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Trading Preferences</h3>
                    <p className="text-sm text-muted-foreground">Customize your trading behavior</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="tradingHours" className="text-sm font-medium text-foreground">Trading Hours</Label>
                    <Select defaultValue="24/7">
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select trading hours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24/7">24/7 Trading</SelectItem>
                        <SelectItem value="london">London Session Only</SelectItem>
                        <SelectItem value="newyork">New York Session Only</SelectItem>
                        <SelectItem value="asian">Asian Session Only</SelectItem>
                        <SelectItem value="overlap">Major Session Overlaps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="currency" className="text-sm font-medium text-foreground">Base Currency</Label>
                    <Select defaultValue="USD">
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select base currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minConfidence" className="text-sm font-medium text-foreground">Min AI Confidence</Label>
                      <Input id="minConfidence" defaultValue="75" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="maxSpread" className="text-sm font-medium text-foreground">Max Spread (pips)</Label>
                      <Input id="maxSpread" defaultValue="3" className="mt-1" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium text-foreground">Auto Execute High Confidence</Label>
                        <p className="text-xs text-muted-foreground">Execute trades above 90% confidence</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium text-foreground">News Trading Filter</Label>
                        <p className="text-xs text-muted-foreground">Avoid trading during major news</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </Card>

              {/* AI Model Configuration */}
              <Card className="trading-card p-6 lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <Zap className="h-5 w-5 text-primary" />
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
                    <div key={model.name} className="p-4 rounded-lg bg-gradient-dark border border-border/20">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-foreground">{model.name}</span>
                        <Switch defaultChecked={model.enabled} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Accuracy:</span>
                          <span className="text-foreground">{model.accuracy}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Weight:</span>
                          <span className="text-foreground">{model.weight}%</span>
                        </div>
                        <Slider defaultValue={[model.weight]} max={50} min={10} step={5} className="mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="trading-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
                    <p className="text-sm text-muted-foreground">Choose how you want to receive alerts</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'trades', label: 'Trade Executions', desc: 'When trades are opened or closed' },
                    { key: 'signals', label: 'AI Trading Signals', desc: 'New AI-generated trading opportunities' },
                    { key: 'news', label: 'Market News', desc: 'Important economic announcements' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium text-foreground">{item.label}</Label>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch 
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({...prev, [item.key]: checked}))
                        }
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="trading-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Delivery Methods</h3>
                    <p className="text-sm text-muted-foreground">How to receive notifications</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium text-foreground">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">john@example.com</p>
                      </div>
                    </div>
                    <Switch checked={notifications.email} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium text-foreground">Push Notifications</Label>
                        <p className="text-xs text-muted-foreground">Browser & mobile app</p>
                      </div>
                    </div>
                    <Switch checked={notifications.push} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium text-foreground">SMS Alerts</Label>
                        <p className="text-xs text-muted-foreground">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <Switch checked={notifications.sms} />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/20">
                  <Label htmlFor="quiet" className="text-sm font-medium text-foreground">Quiet Hours</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <Input defaultValue="22:00" />
                    <Input defaultValue="08:00" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">No notifications during these hours</p>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="trading-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Lock className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Account Security</h3>
                    <p className="text-sm text-muted-foreground">Protect your trading account</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="currentPassword" className="text-sm font-medium text-foreground">Current Password</Label>
                    <Input id="currentPassword" type="password" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="newPassword" className="text-sm font-medium text-foreground">New Password</Label>
                    <Input id="newPassword" type="password" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" className="mt-1" />
                  </div>

                  <Button className="w-full btn-trading-primary">
                    Update Password
                  </Button>
                </div>
              </Card>

              <Card className="trading-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Key className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Authenticator App</Label>
                      <p className="text-xs text-muted-foreground">Google Authenticator, Authy</p>
                    </div>
                    <Badge className="bg-gradient-profit">Enabled</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">SMS Backup</Label>
                      <p className="text-xs text-muted-foreground">Backup verification method</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Login Notifications</Label>
                      <p className="text-xs text-muted-foreground">Alert on new device login</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/20">
                  <Button variant="outline" className="w-full">
                    View Login History
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* API & Data Settings */}
          <TabsContent value="api">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="trading-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Database className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">API Configuration</h3>
                    <p className="text-sm text-muted-foreground">Manage your API keys and integrations</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="apiKey" className="text-sm font-medium text-foreground">Trading API Key</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input id="apiKey" defaultValue="sk-proj-..." type="password" className="flex-1" />
                      <Button variant="outline" size="sm">Generate</Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="webhookUrl" className="text-sm font-medium text-foreground">Webhook URL</Label>
                    <Input id="webhookUrl" placeholder="https://your-server.com/webhook" className="mt-1" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">API Trading Enabled</Label>
                      <p className="text-xs text-muted-foreground">Allow external API trading</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </Card>

              <Card className="trading-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <SettingsIcon className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Data Preferences</h3>
                    <p className="text-sm text-muted-foreground">Configure data sources and quality</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dataProvider" className="text-sm font-medium text-foreground">Primary Data Provider</Label>
                    <Select defaultValue="premium">
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select data provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="premium">Premium Real-time</SelectItem>
                        <SelectItem value="standard">Standard Delayed</SelectItem>
                        <SelectItem value="free">Free Basic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Data Export</Label>
                      <p className="text-xs text-muted-foreground">Allow data export for analysis</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Anonymous Analytics</Label>
                      <p className="text-xs text-muted-foreground">Help improve our AI models</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TradingLayout>
  );
}