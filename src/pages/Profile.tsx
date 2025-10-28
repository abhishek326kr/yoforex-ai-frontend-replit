import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { TradingLayout } from "@/components/layout/TradingLayout";
import { toast, useToast } from "@/hooks/use-toast";
import { showApiError } from '@/lib/ui/errorToast';
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Settings as SettingsIcon
} from "lucide-react";
import { profileStorage, ProfileData, UserPreferences, SecuritySettings } from "@/utils/profileStorage";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export function Profile() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  // Load profile data from backend API on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Load profile data
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
            risk_tolerance: profile.risk_tolerance || ''
          });
        }

        // Load preferences
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
          // Apply compact class immediately based on loaded prefs
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

        // Load security settings
        const secSettings = await profileStorage.getSecuritySettings();
        if (secSettings) {
          setSecuritySettings({
            twoFactorEnabled: secSettings.twoFactorEnabled,
            loginAlerts: secSettings.loginAlerts,
            sessionTimeout: secSettings.sessionTimeout,
            allowApiAccess: secSettings.allowApiAccess
          });
        }
      } catch (error: any) {
        if (error?.message === 'User not verified' || error?.message === 'Not authenticated') {
          // Show message and redirect to auth page
          showApiError(error, { title: 'Authentication Required', defaultMessage: 'Please log in to access your profile settings.' });
          setTimeout(() => setLocation('/auth'), 1500);
          return;
        } else {
          console.error('Failed to load profile data:', error);
          showApiError(error, { title: 'Error', defaultMessage: 'Failed to load profile data. Please try again.' });
        }
      }
    };

    loadProfileData();
  }, [user, toast]);

  
  
  const [profileData, setProfileData] = useState({
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
    risk_tolerance: ''
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

  // Password change form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    // Basic validation
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
      // Clear fields after success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      // Errors are surfaced via toast in service, but ensure UI feedback as fallback
      if (err?.message) {
        toast({ variant: 'destructive', title: 'Update failed', description: err.message });
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await profileStorage.initializeTables();
      const savedProfile = await profileStorage.saveProfile({
        ...profileData,
        first_name: profileData.name.split(' ')[0],
        last_name: profileData.name.split(' ').slice(1).join(' ')
      });
      
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
    try {
      setUploadingAvatar(true);
      const result = await uploadImageToCloudinary(file);
      const url = result.secure_url || result.url;
      if (!url) throw new Error("No URL returned from Cloudinary");

      // Update UI state immediately
      setProfileData(prev => ({ ...prev, avatar_url: url }));

      // Persist avatar_url to backend only (PATCH)
      await profileStorage.updateAvatar(url);

      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      toast({
        title: "Upload Failed",
        description: err?.message || "Could not upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
      // reset input value to allow same file re-selection
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <TradingLayout>
      <div className="space-y-6">
        {/* Header */}
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
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Picture Card */}
              <Card className="trading-card p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg font-semibold bg-gradient-primary text-white">
                      {profileData.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAvatarUpload}
                    className="w-full"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                  <div className="text-center">
                    <p className="font-medium text-foreground">{profileData.name}</p>
                    <p className="text-sm text-muted-foreground">{profileData.email}</p>
                  </div>
                </div>
              </Card>

              {/* Personal Details */}
              <Card className="trading-card p-6 lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                    <p className="text-sm text-muted-foreground">Update your personal details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      readOnly
                      disabled
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      readOnly
                      disabled
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-foreground">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({...prev, location: e.target.value}))}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-foreground">Bio</Label>
                    <Input
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                      className="w-full"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-sm font-medium text-foreground">Timezone</Label>
                    <Select value={profileData.timezone} onValueChange={(value) => setProfileData(prev => ({...prev, timezone: value}))}>
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

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium text-foreground">Base Currency</Label>
                    <Select value={profileData.currency} onValueChange={(value) => setProfileData(prev => ({...prev, currency: value}))}>
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

                <div className="mt-6 pt-4 border-t border-border/20">
                  <Button onClick={handleSaveProfile} className="btn-trading-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Notification Preferences */}
              <Card className="trading-card p-6">
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
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium text-foreground">{item.label}</Label>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch 
                        checked={preferences[item.key as keyof typeof preferences]}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({...prev, [item.key]: checked}))
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border/20">
                  <Button onClick={handleSavePreferences} className="btn-trading-primary w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </Card>

              {/* Display Preferences */}
              <Card className="trading-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Palette className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Display & Interface</h3>
                    <p className="text-sm text-muted-foreground">Customize your trading interface</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Dark Mode</Label>
                      <p className="text-xs text-muted-foreground">Use dark theme for better visibility</p>
                    </div>
                    <Switch 
                      checked={preferences.darkMode}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({...prev, darkMode: checked}))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Compact View</Label>
                      <p className="text-xs text-muted-foreground">Reduce spacing for more content</p>
                    </div>
                    <Switch 
                      checked={preferences.compactView}
                      onCheckedChange={(checked) => {
                        setPreferences(prev => ({...prev, compactView: checked}));
                        // Update localStorage cache so layout reacts immediately
                        try {
                          const cached = localStorage.getItem('userPreferences');
                          const prefs = cached ? JSON.parse(cached) : {};
                          const updated = { ...prefs, compact_view: checked };
                          localStorage.setItem('userPreferences', JSON.stringify(updated));
                        } catch {
                          toast({
                            variant: 'destructive',
                            title: 'Error',
                            description: 'Failed to update compact view preference in localStorage',
                          });
                        }
                        // Toggle global class for immediate UI change
                        if (checked) {
                          document.documentElement.classList.add('compact');
                        } else {
                          document.documentElement.classList.remove('compact');
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Auto-Save</Label>
                      <p className="text-xs text-muted-foreground">Automatically save your work</p>
                    </div>
                    <Switch 
                      checked={preferences.autoSave}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({...prev, autoSave: checked}))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Language</Label>
                    <Select value={profileData.language} onValueChange={(value) => setProfileData(prev => ({...prev, language: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Español</SelectItem>
                        <SelectItem value="French">Français</SelectItem>
                        <SelectItem value="German">Deutsch</SelectItem>
                        <SelectItem value="Japanese">日本語</SelectItem>
                        <SelectItem value="Chinese">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/20">
                  <Button onClick={handleSavePreferences} className="btn-trading-primary w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Settings */}
              <Card className="trading-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Security Settings</h3>
                    <p className="text-sm text-muted-foreground">Manage your account security</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Two-Factor Authentication</Label>
                      <p className="text-xs text-muted-foreground">Add extra security to your account</p>
                    </div>
                    <Switch 
                      checked={securitySettings.twoFactorEnabled}
                      onCheckedChange={(checked) => 
                        setSecuritySettings(prev => ({...prev, twoFactorEnabled: checked}))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Login Alerts</Label>
                      <p className="text-xs text-muted-foreground">Get notified of new device logins</p>
                    </div>
                    <Switch 
                      checked={securitySettings.loginAlerts}
                      onCheckedChange={(checked) => 
                        setSecuritySettings(prev => ({...prev, loginAlerts: checked}))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">API Access</Label>
                      <p className="text-xs text-muted-foreground">Allow third-party API access</p>
                    </div>
                    <Switch 
                      checked={securitySettings.allowApiAccess}
                      onCheckedChange={(checked) => 
                        setSecuritySettings(prev => ({...prev, allowApiAccess: checked}))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Session Timeout</Label>
                    <Select value={securitySettings.sessionTimeout} onValueChange={(value) => setSecuritySettings(prev => ({...prev, sessionTimeout: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/20">
                  <Button onClick={handleSaveSecurity} className="btn-trading-primary w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Security Settings
                  </Button>
                </div>
              </Card>

              {/* Password Change */}
              <Card className="trading-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Lock className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Change Password</h3>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium text-foreground">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium text-foreground">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/20">
                  <Button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="btn-trading-primary w-full"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {changingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card className="trading-card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Billing Information</h3>
                  <p className="text-sm text-muted-foreground">Manage your subscription and billing details</p>
                </div>
              </div>

              <div className="text-center py-12">
                <div className="p-4 bg-muted/20 rounded-full mx-auto w-fit mb-4">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-medium mb-2">Billing Management</h4>
                <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                  Billing information and subscription management will be integrated with the existing billing page.
                </p>
                <Button variant="outline" onClick={() => setLocation('/billing')}>
                  Go to Billing Page
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TradingLayout>
  );
}
