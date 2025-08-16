// Browser-compatible profile storage using REST API approach
// Since pg library doesn't work in browsers, we'll use fetch API to communicate with a serverless function

const POSTGRES_URL = import.meta.env.VITE_POSTGRES_URL || 'postgres://3281df3e88ae226e981142c771c78bd21841173823c036ae4367b6cbabfe3232:sk_zLNaVCo36sVFxg1ouSESV@db.prisma.io:5432/?sslmode=require'

export interface ProfileData {
  id?: number;
  name: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  timezone: string;
  language: string;
  currency: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  website?: string;
  trading_experience?: string;
  preferred_pairs?: string;
  risk_tolerance?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  marketUpdates: boolean;
  tradingAlerts: boolean;
  newsDigest: boolean;
  darkMode: boolean;
  compactView: boolean;
  autoSave: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: string;
  allowApiAccess: boolean;
}

class ProfileStorageService {
  private baseUrl = '/api/profile'; // This would be your API endpoint
  
  // For now, we'll use localStorage as a fallback until proper API is set up
  private getStorageKey(email: string, type: string = 'profile'): string {
    return `yoforex_${type}_${email}`;
  }

  async initializeTables(): Promise<void> {
    // For browser compatibility, we'll initialize localStorage structure
    // In a real implementation, this would call your backend API
    console.log('Profile storage initialized for browser environment');
  }

  async saveProfile(profileData: ProfileData): Promise<ProfileData> {
    try {
      // For now, save to localStorage (in production, this would be an API call)
      const profileWithTimestamp = {
        ...profileData,
        id: Date.now(), // Simple ID generation
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem(
        this.getStorageKey(profileData.email, 'profile'),
        JSON.stringify(profileWithTimestamp)
      );
      
      // In production, you would make an API call like:
      // const response = await fetch('/api/profile', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profileData)
      // });
      // return response.json();
      
      return profileWithTimestamp;
    } catch (error) {
      console.error('Failed to save profile:', error);
      throw error;
    }
  }

  async getProfile(email: string): Promise<ProfileData | null> {
    try {
      // For now, get from localStorage (in production, this would be an API call)
      const stored = localStorage.getItem(this.getStorageKey(email, 'profile'));
      
      if (stored) {
        return JSON.parse(stored);
      }
      
      // In production, you would make an API call like:
      // const response = await fetch(`/api/profile?email=${encodeURIComponent(email)}`);
      // return response.ok ? response.json() : null;
      
      return null;
    } catch (error) {
      console.error('Failed to get profile:', error);
      return null;
    }
  }

  async savePreferences(userId: number, preferences: UserPreferences): Promise<void> {
    try {
      // For now, save to localStorage using userId as key
      localStorage.setItem(
        `yoforex_preferences_${userId}`,
        JSON.stringify({
          ...preferences,
          updated_at: new Date().toISOString()
        })
      );
      
      // In production: API call to save preferences
    } catch (error) {
      console.error('Failed to save preferences:', error);
      throw error;
    }
  }

  async getPreferences(userId: number): Promise<UserPreferences | null> {
    try {
      const stored = localStorage.getItem(`yoforex_preferences_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get preferences:', error);
      return null;
    }
  }

  async saveSecuritySettings(userId: number, settings: SecuritySettings): Promise<void> {
    try {
      localStorage.setItem(
        `yoforex_security_${userId}`,
        JSON.stringify({
          ...settings,
          updated_at: new Date().toISOString()
        })
      );
    } catch (error) {
      console.error('Failed to save security settings:', error);
      throw error;
    }
  }

  async getSecuritySettings(userId: number): Promise<SecuritySettings | null> {
    try {
      const stored = localStorage.getItem(`yoforex_security_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get security settings:', error);
      return null;
    }
  }

  async disconnect(): Promise<void> {
    // No connection to close in browser environment
    console.log('Profile storage disconnected');
  }
}

export const profileStorage = new ProfileStorageService();
