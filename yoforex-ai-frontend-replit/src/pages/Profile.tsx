import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { TradingLayout } from "@/components/layout/TradingLayout";
import { toast, useToast } from "@/hooks/use-toast";
import { showApiError } from '@/lib/ui/errorToast';
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Save,
  Shield,
  Bell,
  Globe,
  Palette,
  CreditCard,
  Activity,
  Settings as SettingsIcon,
  TrendingUp,
  Target,
  DollarSign,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  ArrowRight,
  Info,
  Trash2,
  BarChart3,
  Crown,
  Calendar,
  Plus
} from "lucide-react";
import { profileStorage, ProfileData, UserPreferences, SecuritySettings } from "@/utils/profileStorage";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { useBillingSummary } from "@/hooks/useBillingSummary";
import { getPortfolioStats, getTopPerformingPairs, type PortfolioStats, type TopPerformingPair } from "@/lib/api/dashboard";
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface ExtendedProfileData extends ProfileData {
  trading_experience_level?: string;
  trading_style?: string;
  years_experience?: number;
  about_me?: string;
  favorite_pairs?: string[];
  preferred_timeframes?: string[];
  risk_tolerance_level?: number;
  default_lot_size?: number;
  trading_goals?: string;
  date_format?: string;
  number_format?: string;
  last_password_change?: string;
  account_created?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
}

const CURRENCY_PAIRS = [
  "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD",
  "USD/CHF", "NZD/USD", "EUR/GBP", "EUR/JPY", "GBP/JPY"
];

const TIMEFRAMES = [
  { value: "M1", label: "1 Minute" },
  { value: "M5", label: "5 Minutes" },
  { value: "M15", label: "15 Minutes" },
  { value: "M30", label: "30 Minutes" },
  { value: "H1", label: "1 Hour" },
  { value: "H4", label: "4 Hours" },
  { value: "D1", label: "1 Day" }
];

const RISK_LEVELS = ["Conservative", "Balanced", "Aggressive"];

export function Profile() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { data: billingData } = useBillingSummary();
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [topPairs, setTopPairs] = useState<TopPerformingPair[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const loadTradingStats = async () => {
      try {
        setLoadingStats(true);
        const [statsData, pairsData] = await Promise.all([
          getPortfolioStats(),
          getTopPerformingPairs(1)
        ]);
        setStats(statsData);
        setTopPairs(pairsData);
      } catch (error) {
        console.error('Failed to load trading stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };
    loadTradingStats();
  }, []);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const profile = await profileStorage.getProfile();
        if (profile) {
          setProfileData({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            bio: profile.bio || '',
            location: profile.location || '',
            timezone: profile.timezone || 'America/New_York',
            language: profile.language || 'English',
            currency: profile.currency || 'USD',
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            avatar_url: profile.avatar_url || '',
            website: profile.website || '',
            trading_experience: profile.trading_experience || '',
            preferred_pairs: profile.preferred_pairs || '',
            risk_tolerance: profile.risk_tolerance || '',
            trading_experience_level: (profile as ExtendedProfileData).trading_experience_level || 'Beginner',
            trading_style: (profile as ExtendedProfileData).trading_style || '',
            years_experience: (profile as ExtendedProfileData).years_experience || 0,
            about_me: (profile as ExtendedProfileData).about_me || '',
            favorite_pairs: (profile as ExtendedProfileData).favorite_pairs || [],
            preferred_timeframes: (profile as ExtendedProfileData).preferred_timeframes || [],
            risk_tolerance_level: (profile as ExtendedProfileData).risk_tolerance_level || 50,
            default_lot_size: (profile as ExtendedProfileData).default_lot_size || 0.01,
            trading_goals: (profile as ExtendedProfileData).trading_goals || '',
            date_format: (profile as ExtendedProfileData).date_format || 'MM/DD/YYYY',
            number_format: (profile as ExtendedProfileData).number_format || '1,000.00',
            last_password_change: (profile as ExtendedProfileData).last_password_change,
            account_created: (profile as ExtendedProfileData).account_created,
            email_verified: (profile as ExtendedProfileData).email_verified ?? true,
            phone_verified: (profile as ExtendedProfileData).phone_verified ?? false,
          });
        }

        const userPrefs = await profileStorage.getPreferences();
        if (userPrefs) {
          setPreferences({
            emailNotifications: userPrefs.email_notifications,
            pushNotifications: userPrefs.push_notifications,
            smsAlerts: userPrefs.sms_alerts,
            marketUpdates: userPrefs.market_updates,
            tradingAlerts: userPrefs.trading_alerts,
            newsDigest: userPrefs.news_digest,
            darkMode: userPrefs.dark_mode,
            compactView: userPrefs.compact_view,
            autoSave: userPrefs.auto_save
          });
          try {
            if (userPrefs.compact_view) {
              document.documentElement.classList.add('compact');
            } else {
              document.documentElement.classList.remove('compact');
            }
          } catch {
            showApiError(new Error('Failed to apply compact view preference'), { title: 'Error', defaultMessage: 'Failed to apply compact view preference' });
          }
        }

        const secSettings = await profileStorage.getSecuritySettings();
        if (secSettings) {
          setSecuritySettings({
            twoFactorEnabled: secSettings.twoFactorEnabled,
            loginAlerts: secSettings.loginAlerts,
            sessionTimeout: secSettings.sessionTimeout,
            allowApiAccess: secSettings.allowApiAccess
          });
        }
      } catch (error: unknown) {
        const err = error as { message?: string };
        if (err?.message === 'User not verified' || err?.message === 'Not authenticated') {
          showApiError(error as Error, { title: 'Authentication Required', defaultMessage: 'Please log in to access your profile settings.' });
          setTimeout(() => setLocation('/auth'), 1500);
          return;
        } else {
          console.error('Failed to load profile data:', error);
          showApiError(error as Error, { title: 'Error', defaultMessage: 'Failed to load profile data. Please try again.' });
        }
      }
    };

    loadProfileData();
  }, [user, toast, setLocation]);

  const [profileData, setProfileData] = useState<ExtendedProfileData>({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Professional forex trader with 5+ years of experience in AI-powered trading.',
    location: 'New York, USA',
    timezone: 'America/New_York',
    language: 'English',
    currency: 'USD',
    first_name: '',
    last_name: '',
    avatar_url: '',
    website: '',
    trading_experience: '',
    preferred_pairs: '',
    risk_tolerance: '',
    trading_experience_level: 'Beginner',
    trading_style: '',
    years_experience: 0,
    about_me: '',
    favorite_pairs: [],
    preferred_timeframes: [],
    risk_tolerance_level: 50,
    default_lot_size: 0.01,
    trading_goals: '',
    date_format: 'MM/DD/YYYY',
    number_format: '1,000.00',
    email_verified: true,
    phone_verified: false,
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsAlerts: true,
    marketUpdates: true,
    tradingAlerts: true,
    newsDigest: false,
    darkMode: true,
    compactView: false,
    autoSave: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    loginAlerts: true,
    sessionTimeout: '30',
    allowApiAccess: false
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const profileCompletion = useMemo(() => {
    const fields = [
      profileData.name,
      profileData.bio,
      profileData.location,
      profileData.avatar_url,
      profileData.trading_experience_level,
      profileData.trading_style,
      profileData.about_me,
      profileData.favorite_pairs?.length,
      profileData.trading_goals,
    ];
    const completed = fields.filter(f => f && (Array.isArray(f) ? f.length > 0 : true)).length;
    return Math.round((completed / fields.length) * 100);
  }, [profileData]);

  const passwordStrength = useMemo(() => {
    if (!newPassword) return { score: 0, label: '', color: '' };
    let score = 0;
    if (newPassword.length >= 8) score += 25;
    if (newPassword.length >= 12) score += 15;
    if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) score += 20;
    if (/\d/.test(newPassword)) score += 20;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 20;
    
    if (score < 40) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score < 70) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score < 90) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  }, [newPassword]);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill in all password fields.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords do not match',
        description: 'New password and confirmation must match.',
      });
      return;
    }
    if (newPassword.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Weak password',
        description: 'New password must be at least 8 characters.',
      });
      return;
    }
    if (newPassword === currentPassword) {
      toast({
        variant: 'destructive',
        title: 'No change detected',
        description: 'New password must be different from current password.',
      });
      return;
    }

    try {
      setChangingPassword(true);
      await profileStorage.changePassword(currentPassword, newPassword);
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const error = err as { message?: string };
      if (error?.message) {
        toast({ variant: 'destructive', title: 'Update failed', description: error.message });
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await profileStorage.initializeTables();
      await profileStorage.saveProfile({
        ...profileData,
        first_name: profileData.name.split(' ')[0],
        last_name: profileData.name.split(' ').slice(1).join(' ')
      } as ProfileData);
      
      setHasUnsavedChanges(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
      console.error('Profile save error:', error);
    }
  };

  const handleSavePreferences = async () => {
    try {
      const preferencesData = {
        email_notifications: preferences.emailNotifications,
        push_notifications: preferences.pushNotifications,
        sms_alerts: preferences.smsAlerts,
        market_updates: preferences.marketUpdates,
        trading_alerts: preferences.tradingAlerts,
        news_digest: preferences.newsDigest,
        dark_mode: preferences.darkMode,
        compact_view: preferences.compactView,
        auto_save: preferences.autoSave
      };
      
      await profileStorage.savePreferences(preferencesData);
      setHasUnsavedChanges(false);
      toast({
        title: "Preferences Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive"
      });
      console.error('Preferences save error:', error);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      await profileStorage.saveSecuritySettings(securitySettings);
      setHasUnsavedChanges(false);
      toast({
        title: "Security Settings Updated",
        description: "Your security settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save security settings. Please try again.",
        variant: "destructive"
      });
      console.error('Security save error:', error);
    }
  };

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setUploadingAvatar(true);
      const result = await uploadImageToCloudinary(file);
      const url = result.secure_url || result.url;
      if (!url) throw new Error("No URL returned from Cloudinary");

      setProfileData(prev => ({ ...prev, avatar_url: url }));
      await profileStorage.updateAvatar(url);

      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully.",
      });
      setAvatarPreview(null);
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('Avatar upload error:', err);
      toast({
        title: "Upload Failed",
        description: error?.message || "Could not upload avatar. Please try again.",
        variant: "destructive",
      });
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setProfileData(prev => ({ ...prev, avatar_url: '' }));
      await profileStorage.updateAvatar('');
      toast({
        title: "Avatar Removed",
        description: "Your profile picture has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove avatar. Please try again.",
        variant: "destructive"
      });
    }
  };

  const togglePair = (pair: string) => {
    setProfileData(prev => ({
      ...prev,
      favorite_pairs: prev.favorite_pairs?.includes(pair)
        ? prev.favorite_pairs.filter(p => p !== pair)
        : [...(prev.favorite_pairs || []), pair]
    }));
    setHasUnsavedChanges(true);
  };

  const toggleTimeframe = (timeframe: string) => {
    setProfileData(prev => ({
      ...prev,
      preferred_timeframes: prev.preferred_timeframes?.includes(timeframe)
        ? prev.preferred_timeframes.filter(t => t !== timeframe)
        : [...(prev.preferred_timeframes || []), timeframe]
    }));
    setHasUnsavedChanges(true);
  };

  const mockSparklineData = [
    { value: 100 }, { value: 120 }, { value: 110 }, { value: 140 }, { value: 130 },
    { value: 160 }, { value: 150 }, { value: 180 }, { value: 170 }, { value: 200 }
  ];

  return (
    <TradingLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold heading-trading">Profile Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Badge variant="secondary" className="bg-gradient-profit text-white">
              <Shield className="h-3 w-3 mr-1" />
              Verified Account
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="border-primary/50">
                    Profile {profileCompletion}% Complete
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Complete your profile to unlock all features</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 via-card to-card/50 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Trading Performance Summary
                </CardTitle>
                <CardDescription>Your trading statistics at a glance</CardDescription>
              </div>
              <Button 
                onClick={() => setLocation('/dashboard')}
                className="bg-gradient-primary hover:bg-primary-hover"
              >
                View Full Analytics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    Total Trades
                  </p>
                  <p className="text-3xl font-bold">{stats?.total_trades || 0}</p>
                  <p className="text-xs text-muted-foreground">All time</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    Win Rate
                  </p>
                  <p className="text-3xl font-bold text-trading-profit">{stats?.win_rate || 0}%</p>
                  <p className="text-xs text-muted-foreground">Success rate</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Total P/L
                  </p>
                  <p className="text-3xl font-bold text-trading-profit">
                    ${stats?.total_profit?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-muted-foreground">Lifetime</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Most Traded
                  </p>
                  <p className="text-2xl font-bold">{topPairs[0]?.pair || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">Top pair</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">30-Day Trend</p>
                  <ResponsiveContainer width="100%" height={60}>
                    <LineChart data={mockSparklineData}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--trading-profit))" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-trading-profit">+12.4% this month</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="space-y-6" onValueChange={() => {
          if (hasUnsavedChanges) {
            const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave this tab?');
            if (!confirmLeave) return;
          }
        }}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="p-1 bg-gradient-to-r from-primary to-purple-500 rounded-full">
                      <Avatar className="h-28 w-28 border-4 border-background">
                        <AvatarImage src={avatarPreview || profileData.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="text-xl font-semibold bg-gradient-primary text-white">
                          {profileData.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {uploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAvatarUpload}
                      disabled={uploadingAvatar}
                      className="flex-1"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {uploadingAvatar ? 'Uploading...' : 'Change'}
                    </Button>
                    {profileData.avatar_url && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRemoveAvatar}
                        className="flex-1 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                  <div className="text-center w-full">
                    <p className="font-medium text-foreground text-lg">{profileData.name}</p>
                    <p className="text-sm text-muted-foreground">{profileData.email}</p>
                    <div className="mt-3 pt-3 border-t border-border/20">
                      <Badge className="bg-gradient-to-r from-primary to-purple-500">
                        <Award className="h-3 w-3 mr-1" />
                        {profileData.trading_experience_level || 'Beginner'} Trader
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Profile Completion</span>
                      <span className="font-medium">{profileCompletion}%</span>
                    </div>
                    <Progress value={profileCompletion} className="h-2" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all p-6 lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                    <p className="text-sm text-muted-foreground">Update your personal details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => {
                        setProfileData(prev => ({...prev, name: e.target.value}));
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        readOnly
                        disabled
                      />
                      {profileData.email_verified && (
                        <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        value={profileData.phone}
                        readOnly
                        disabled
                      />
                      {profileData.phone_verified ? (
                        <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => {
                        setProfileData(prev => ({...prev, location: e.target.value}));
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience-level">Trading Experience Level</Label>
                    <Select 
                      value={profileData.trading_experience_level} 
                      onValueChange={(value) => {
                        setProfileData(prev => ({...prev, trading_experience_level: value}));
                        setHasUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trading-style">Preferred Trading Style</Label>
                    <Select 
                      value={profileData.trading_style} 
                      onValueChange={(value) => {
                        setProfileData(prev => ({...prev, trading_style: value}));
                        setHasUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scalping">Scalping</SelectItem>
                        <SelectItem value="Day Trading">Day Trading</SelectItem>
                        <SelectItem value="Swing Trading">Swing Trading</SelectItem>
                        <SelectItem value="Position Trading">Position Trading</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="years-experience">Years of Experience</Label>
                    <Input
                      id="years-experience"
                      type="number"
                      min="0"
                      value={profileData.years_experience}
                      onChange={(e) => {
                        setProfileData(prev => ({...prev, years_experience: parseInt(e.target.value) || 0}));
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      value={profileData.timezone} 
                      onValueChange={(value) => {
                        setProfileData(prev => ({...prev, timezone: value}));
                        setHasUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="about-me">About Me</Label>
                    <Textarea
                      id="about-me"
                      value={profileData.about_me}
                      onChange={(e) => {
                        setProfileData(prev => ({...prev, about_me: e.target.value}));
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="Tell us about your trading journey, goals, and experience..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {hasUnsavedChanges && (
                      <>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span>You have unsaved changes</span>
                      </>
                    )}
                  </div>
                  <Button onClick={handleSaveProfile} className="btn-trading-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all p-6 mt-6">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Trading Preferences</h3>
                  <p className="text-sm text-muted-foreground">Configure your trading preferences and goals</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Favorite Currency Pairs</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {CURRENCY_PAIRS.map(pair => (
                      <div key={pair} className="flex items-center space-x-2">
                        <Checkbox
                          id={`pair-${pair}`}
                          checked={profileData.favorite_pairs?.includes(pair)}
                          onCheckedChange={() => togglePair(pair)}
                        />
                        <Label htmlFor={`pair-${pair}`} className="text-sm cursor-pointer">
                          {pair}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Preferred Timeframes</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIMEFRAMES.map(tf => (
                      <div key={tf.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tf-${tf.value}`}
                          checked={profileData.preferred_timeframes?.includes(tf.value)}
                          onCheckedChange={() => toggleTimeframe(tf.value)}
                        />
                        <Label htmlFor={`tf-${tf.value}`} className="text-sm cursor-pointer">
                          {tf.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Risk Tolerance</Label>
                    <Badge variant="outline">
                      {RISK_LEVELS[Math.floor((profileData.risk_tolerance_level || 50) / 34)]}
                    </Badge>
                  </div>
                  <Slider
                    value={[profileData.risk_tolerance_level || 50]}
                    onValueChange={([value]) => {
                      setProfileData(prev => ({...prev, risk_tolerance_level: value}));
                      setHasUnsavedChanges(true);
                    }}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Conservative</span>
                    <span>Balanced</span>
                    <span>Aggressive</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="lot-size">Default Lot Size</Label>
                  <Input
                    id="lot-size"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={profileData.default_lot_size}
                    onChange={(e) => {
                      setProfileData(prev => ({...prev, default_lot_size: parseFloat(e.target.value) || 0.01}));
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="trading-goals">Trading Goals</Label>
                  <Textarea
                    id="trading-goals"
                    value={profileData.trading_goals}
                    onChange={(e) => {
                      setProfileData(prev => ({...prev, trading_goals: e.target.value}));
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="Describe your trading goals, targets, and aspirations..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/20 flex justify-end">
                <Button onClick={handleSaveProfile} className="btn-trading-primary">
                  <Save className="h-4 w-4 mr-2" />
                  Save Trading Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
                    <p className="text-sm text-muted-foreground">Configure your notification preferences</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                    { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Critical alerts via SMS' },
                    { key: 'marketUpdates', label: 'Market Updates', desc: 'Daily market summaries' },
                    { key: 'tradingAlerts', label: 'Trading Alerts', desc: 'AI trading signal notifications' },
                    { key: 'newsDigest', label: 'News Digest', desc: 'Weekly forex news digest' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                      <div>
                        <Label className="text-sm font-medium text-foreground cursor-pointer">{item.label}</Label>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch 
                        checked={preferences[item.key as keyof typeof preferences] as boolean}
                        onCheckedChange={(checked) => {
                          setPreferences(prev => ({...prev, [item.key]: checked}));
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Palette className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Display & Interface</h3>
                    <p className="text-sm text-muted-foreground">Customize your trading interface</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Dark Mode</Label>
                      <p className="text-xs text-muted-foreground">Use dark theme for better visibility</p>
                    </div>
                    <Switch 
                      checked={preferences.darkMode}
                      onCheckedChange={(checked) => {
                        setPreferences(prev => ({...prev, darkMode: checked}));
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Compact View</Label>
                      <p className="text-xs text-muted-foreground">Reduce spacing for more content</p>
                    </div>
                    <Switch 
                      checked={preferences.compactView}
                      onCheckedChange={(checked) => {
                        setPreferences(prev => ({...prev, compactView: checked}));
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Auto-Save</Label>
                      <p className="text-xs text-muted-foreground">Automatically save your changes</p>
                    </div>
                    <Switch 
                      checked={preferences.autoSave}
                      onCheckedChange={(checked) => {
                        setPreferences(prev => ({...prev, autoSave: checked}));
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Regional Settings</h3>
                    <p className="text-sm text-muted-foreground">Language and format preferences</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Language Preference</Label>
                    <Select 
                      value={profileData.language} 
                      onValueChange={(value) => {
                        setProfileData(prev => ({...prev, language: value}));
                        setHasUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="Chinese">Chinese (Simplified)</SelectItem>
                        <SelectItem value="Japanese">Japanese</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Arabic">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select 
                      value={profileData.date_format} 
                      onValueChange={(value) => {
                        setProfileData(prev => ({...prev, date_format: value}));
                        setHasUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Number Format</Label>
                    <Select 
                      value={profileData.number_format} 
                      onValueChange={(value) => {
                        setProfileData(prev => ({...prev, number_format: value}));
                        setHasUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1,000.00">1,000.00 (US/UK)</SelectItem>
                        <SelectItem value="1.000,00">1.000,00 (EU)</SelectItem>
                        <SelectItem value="1 000,00">1 000,00 (FR/RU)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Base Currency</Label>
                    <Select 
                      value={profileData.currency} 
                      onValueChange={(value) => {
                        setProfileData(prev => ({...prev, currency: value}));
                        setHasUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSavePreferences} className="btn-trading-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Lock className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Change Password</h3>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {newPassword && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Password Strength:</span>
                          <span className={`font-medium ${
                            passwordStrength.score < 40 ? 'text-red-500' :
                            passwordStrength.score < 70 ? 'text-yellow-500' :
                            passwordStrength.score < 90 ? 'text-blue-500' : 'text-green-500'
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${passwordStrength.color} transition-all`}
                            style={{ width: `${passwordStrength.score}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="w-full btn-trading-primary"
                  >
                    {changingPassword ? 'Updating...' : 'Update Password'}
                  </Button>

                  {profileData.last_password_change && (
                    <p className="text-xs text-muted-foreground text-center">
                      Last changed: {new Date(profileData.last_password_change).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Security Settings</h3>
                    <p className="text-sm text-muted-foreground">Manage your account security</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Two-Factor Authentication</Label>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch 
                      checked={securitySettings.twoFactorEnabled}
                      onCheckedChange={(checked) => {
                        setSecuritySettings(prev => ({...prev, twoFactorEnabled: checked}));
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Login Alerts</Label>
                      <p className="text-xs text-muted-foreground">Get notified of new logins</p>
                    </div>
                    <Switch 
                      checked={securitySettings.loginAlerts}
                      onCheckedChange={(checked) => {
                        setSecuritySettings(prev => ({...prev, loginAlerts: checked}));
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <Label className="text-sm font-medium text-foreground">API Access</Label>
                      <p className="text-xs text-muted-foreground">Allow third-party API access</p>
                    </div>
                    <Switch 
                      checked={securitySettings.allowApiAccess}
                      onCheckedChange={(checked) => {
                        setSecuritySettings(prev => ({...prev, allowApiAccess: checked}));
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Session Timeout</Label>
                    <Select 
                      value={securitySettings.sessionTimeout} 
                      onValueChange={(value) => {
                        setSecuritySettings(prev => ({...prev, sessionTimeout: value}));
                        setHasUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all p-6 lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Account Verification</h3>
                    <p className="text-sm text-muted-foreground">Verification status and account info</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30 border border-border/20">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email Verification</p>
                        <p className="text-xs text-muted-foreground">{profileData.email}</p>
                      </div>
                    </div>
                    {profileData.email_verified ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30 border border-border/20">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone Verification</p>
                        <p className="text-xs text-muted-foreground">{profileData.phone}</p>
                      </div>
                    </div>
                    {profileData.phone_verified ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-accent/30 border border-border/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm font-medium">Account Created</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {profileData.account_created 
                        ? new Date(profileData.account_created).toLocaleDateString()
                        : 'Not available'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveSecurity} className="btn-trading-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="billing">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-primary/10 via-card to-card/50 hover:shadow-lg transition-all p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Crown className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Subscription Plan</h3>
                    <p className="text-sm text-muted-foreground">Your current plan details</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Plan</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-base ${
                          billingData?.plan === 'max' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                          billingData?.plan === 'pro' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          'bg-gray-500'
                        }`}>
                          {billingData?.plan?.toUpperCase() || 'FREE'} Plan
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setLocation('/pricing')}
                      className="bg-gradient-primary hover:bg-primary-hover"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-border/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Credits Remaining</p>
                      <p className="text-2xl font-bold">
                        {billingData?.monthly_credits_remaining || 0}
                      </p>
                    </div>
                    <Progress 
                      value={
                        billingData?.monthly_credits_max 
                          ? ((billingData.monthly_credits_remaining / billingData.monthly_credits_max) * 100)
                          : 0
                      } 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {billingData?.monthly_credits_remaining || 0} of {billingData?.monthly_credits_max || 0} credits available
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/20">
                    <p className="text-sm text-muted-foreground mb-1">Subscription Renewal</p>
                    <p className="text-base font-medium">December 15, 2024</p>
                    <p className="text-xs text-muted-foreground mt-1">Auto-renewal enabled</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Payment Methods</h3>
                    <p className="text-sm text-muted-foreground">Manage your payment options</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-accent/30 border border-border/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Visa •••• 4242</p>
                          <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Default</Badge>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>

                  <div className="pt-4 border-t border-border/20">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setLocation('/billing')}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      View Billing History
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all p-6 lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <Info className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Plan Features</h3>
                    <p className="text-sm text-muted-foreground">What's included in your plan</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-accent/30 border border-border/20">
                    <CheckCircle className="h-5 w-5 text-green-500 mb-2" />
                    <p className="text-sm font-medium">AI Trading Signals</p>
                    <p className="text-xs text-muted-foreground mt-1">Unlimited access to AI analysis</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/30 border border-border/20">
                    <CheckCircle className="h-5 w-5 text-green-500 mb-2" />
                    <p className="text-sm font-medium">Advanced Charts</p>
                    <p className="text-xs text-muted-foreground mt-1">Professional trading tools</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/30 border border-border/20">
                    <CheckCircle className="h-5 w-5 text-green-500 mb-2" />
                    <p className="text-sm font-medium">Priority Support</p>
                    <p className="text-xs text-muted-foreground mt-1">24/7 customer assistance</p>
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
