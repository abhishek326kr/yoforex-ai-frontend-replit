// Profile storage service that communicates with the backend API
// Handles profile data, preferences, and security settings

import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config/api';

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
  is_verified?: boolean;
  attempts?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_alerts: boolean;
  market_updates: boolean;
  trading_alerts: boolean;
  news_digest: boolean;
  dark_mode: boolean;
  compact_view: boolean;
  auto_save: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: string;
  allowApiAccess: boolean;
}

class ProfileStorageService {
  private baseUrl = `${API_BASE_URL}`;
  
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const token =
      typeof window !== 'undefined'
        ? (localStorage.getItem('authToken') || localStorage.getItem('access_token'))
        : null;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Always include cookies for HTTP-only cookie authentication
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Clear any stale auth state and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userPreferences');
        localStorage.removeItem('userSecurity');
        throw new Error('Not authenticated');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  // --- Phone change with WATI OTP ---
  async requestPhoneChange(newPhone: string): Promise<{ status: string }> {
    try {
      const response = await this.makeRequest('/auth/profile/change-phone/request', {
        method: 'POST',
        body: JSON.stringify({ new_phone: newPhone })
      });
      return await response.json();
    } catch (error: any) {
      console.error('Failed to request phone change:', error.message);
      toast.error(error.message);
      throw error;
    }
  }

  async verifyPhoneChange(otp: string): Promise<{ status: string; phone?: string }> {
    try {
      const response = await this.makeRequest('/auth/profile/change-phone/verify', {
        method: 'POST',
        body: JSON.stringify({ otp })
      });
      const data = await response.json();
      // update cached profile if phone returned
      if (data?.phone) {
        try {
          const cached = localStorage.getItem('userProfile');
          if (cached) {
            const parsed = JSON.parse(cached);
            parsed.phone = data.phone;
            localStorage.setItem('userProfile', JSON.stringify(parsed));
          }
        } catch {
          toast.error("No phone number found!")
        }
      }
      return data;
    } catch (error: any) {
      console.error('Failed to verify phone change:', error.message);
      toast.error(error.message);
      throw error;
    }
  }

  // --- Email change with Email OTP ---
  async requestEmailChange(newEmail: string): Promise<{ status: string }> {
    try {
      const response = await this.makeRequest('/auth/profile/change-email/request', {
        method: 'POST',
        body: JSON.stringify({ new_email: newEmail })
      });
      return await response.json();
    } catch (error: any) {
      console.error('Failed to request email change:', error.message);
      toast.error(error.message);
      throw error;
    }
  }

  async verifyEmailChange(otp: string): Promise<{ status: string; email?: string }> {
    try {
      const response = await this.makeRequest('/auth/profile/change-email/verify', {
        method: 'POST',
        body: JSON.stringify({ otp })
      });
      const data = await response.json();
      if (data?.email) {
        try {
          const cached = localStorage.getItem('userProfile');
          if (cached) {
            const parsed = JSON.parse(cached);
            parsed.email = data.email;
            localStorage.setItem('userProfile', JSON.stringify(parsed));
          }
        } catch {
          toast.error("No email is found!")
        }
      }
      return data;
    } catch (error: any) {
      console.error('Failed to verify email change:', error.message);
      toast.error(error.message);
      throw error;
    }
  }

  // Build a payload with only defined, non-empty values to avoid overwriting with blanks
  private buildPayload(data: Record<string, any>): Record<string, any> {
    const payload: Record<string, any> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (typeof value === 'string' && value.trim() === '') return;
      payload[key] = value;
    });
    return payload;
  }

  private async checkUserVerification(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/auth/profile', {
        method: 'GET'
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.is_verified === true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  async initializeTables(): Promise<void> {
    // No initialization needed for API-based storage
    console.log('Profile storage initialized for API communication');
  }

  async saveProfile(profileData: ProfileData): Promise<ProfileData> {
    try {
      const payload = this.buildPayload({
        name: profileData.name,
        bio: profileData.bio,
        location: profileData.location,
        timezone: profileData.timezone,
        language: profileData.language,
        currency: profileData.currency,
        avatar_url: profileData.avatar_url,
        website: profileData.website,
        trading_experience: profileData.trading_experience,
        preferred_pairs: profileData.preferred_pairs,
        risk_tolerance: profileData.risk_tolerance
      });

      const response = await this.makeRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      
      const updatedProfile = await response.json();
      const normalized = {
        name: updatedProfile.name,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        bio: updatedProfile.bio,
        location: updatedProfile.location,
        timezone: updatedProfile.timezone,
        language: updatedProfile.language,
        currency: updatedProfile.currency,
        first_name: updatedProfile.first_name,
        last_name: updatedProfile.last_name,
        avatar_url: updatedProfile.avatar_url,
        website: updatedProfile.website,
        trading_experience: updatedProfile.trading_experience,
        preferred_pairs: updatedProfile.preferred_pairs,
        risk_tolerance: updatedProfile.risk_tolerance
      };
      // Update local cache so future loads reflect latest data
      try {
        localStorage.setItem('userProfile', JSON.stringify({
          ...updatedProfile,
          ...normalized,
        }));
      } catch {
        toast.error('Failed to update local cache after saving profile');
      }
      return normalized;
    } catch (error:any) {
      console.error('Failed to save profile:', error.message);
      toast.error(error.message)
      throw error;
    }
  }

  // Update only the avatar URL without touching other fields
  async updateAvatar(avatarUrl: string): Promise<void> {
    try {
      await this.makeRequest('/auth/profile/avatar', {
        method: 'PATCH',
        body: JSON.stringify({ avatar_url: avatarUrl })
      });
      // Update local cache avatar_url if present
      try {
        const cached = localStorage.getItem('userProfile');
        if (cached) {
          const parsed = JSON.parse(cached);
          parsed.avatar_url = avatarUrl;
          localStorage.setItem('userProfile', JSON.stringify(parsed));
        }
      } catch (e) {
        // ignore localStorage caching errors (quota, privacy mode, etc.)
      }
    } catch (error:any) {
      console.error('Failed to update avatar:', error.message);
      toast.error(error.message);
      throw error;
    }
  }

  async getProfile(): Promise<ProfileData | null> {
    try {
      // First try to get cached data from localStorage
      const cachedProfile = localStorage.getItem('userProfile');
      if (cachedProfile) {
        console.log('Using cached profile data from localStorage');
        return JSON.parse(cachedProfile);
      }
      
      // Fallback to API call if no cached data
      console.log('No cached data, getting profile from backend API...');
      const response = await this.makeRequest('/auth/profile', {
        credentials: 'include',
        method: 'GET'
      });
      
      const data = await response.json();
      
      // Cache the response for future use
      localStorage.setItem('userProfile', JSON.stringify(data));
      
      return data;
    } catch (error) {
      console.error('Failed to get profile:', error);
      return null;
    }
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      await this.makeRequest('/auth/preferences', {
        method: 'PUT',
        body: JSON.stringify(preferences)
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
      throw error;
    }
  }

  async getPreferences(): Promise<UserPreferences | null> {
    try {
      // First try to get cached data from localStorage
      const cachedPreferences = localStorage.getItem('userPreferences');
      if (cachedPreferences) {
        console.log('Using cached preferences data from localStorage');
        return JSON.parse(cachedPreferences);
      }
      
      // Fallback to API call if no cached data
      console.log('No cached preferences, getting from backend API...');
      const response = await this.makeRequest('/auth/preferences', {
        method: 'GET'
      });
      
      const data = await response.json();
      
      // Cache the response for future use
      localStorage.setItem('userPreferences', JSON.stringify(data));
      
      return data;
    } catch (error) {
      console.error('Failed to get preferences:', error);
      return null;
    }
  }

  async saveSecuritySettings(settings: SecuritySettings): Promise<void> {
    try {
      await this.makeRequest('/auth/security', {
        method: 'PUT',
        body: JSON.stringify({
          two_factor_enabled: settings.twoFactorEnabled,
          login_alerts: settings.loginAlerts,
          session_timeout: settings.sessionTimeout,
          allow_api_access: settings.allowApiAccess
        })
      });
    } catch (error) {
      console.error('Failed to save security settings:', error);
      throw error;
    }
  }

  async getSecuritySettings(): Promise<SecuritySettings | null> {
    try {
      // First try to get cached data from localStorage
      const cachedSecurity = localStorage.getItem('userSecurity');
      if (cachedSecurity) {
        console.log('Using cached security data from localStorage');
        const data = JSON.parse(cachedSecurity);
        return {
          twoFactorEnabled: data.two_factor_enabled,
          loginAlerts: data.login_alerts,
          sessionTimeout: data.session_timeout,
          allowApiAccess: data.allow_api_access
        };
      }
      
      // Fallback to API call if no cached data
      console.log('No cached security settings, getting from backend API...');
      const response = await this.makeRequest('/auth/security', {
        method: 'GET'
      });
      
      const data = await response.json();
      
      // Cache the response for future use
      localStorage.setItem('userSecurity', JSON.stringify(data));
      
      // Transform backend response to frontend format
      return {
        twoFactorEnabled: data.two_factor_enabled,
        loginAlerts: data.login_alerts,
        sessionTimeout: data.session_timeout,
        allowApiAccess: data.allow_api_access
      };
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
