// Future API implementation for PostgreSQL integration
// This file will be used when you set up a proper backend API

import { ProfileData, UserPreferences, SecuritySettings } from './profileStorage';

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export class ProfileStorageAPI {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async initializeTables(): Promise<void> {
    await this.makeRequest('/api/profile/init', { method: 'POST' });
  }

  async saveProfile(profileData: ProfileData): Promise<ProfileData> {
    return this.makeRequest('/api/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async getProfile(email: string): Promise<ProfileData | null> {
    try {
      return await this.makeRequest(`/api/profile?email=${encodeURIComponent(email)}`);
    } catch (error) {
      return null;
    }
  }

  async savePreferences(userId: number, preferences: UserPreferences): Promise<void> {
    await this.makeRequest(`/api/profile/${userId}/preferences`, {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }

  async getPreferences(userId: number): Promise<UserPreferences | null> {
    try {
      return await this.makeRequest(`/api/profile/${userId}/preferences`);
    } catch (error) {
      return null;
    }
  }

  async saveSecuritySettings(userId: number, settings: SecuritySettings): Promise<void> {
    await this.makeRequest(`/api/profile/${userId}/security`, {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  async getSecuritySettings(userId: number): Promise<SecuritySettings | null> {
    try {
      return await this.makeRequest(`/api/profile/${userId}/security`);
    } catch (error) {
      return null;
    }
  }

  async disconnect(): Promise<void> {
    // No persistent connection to close
  }
}

export const profileStorageAPI = new ProfileStorageAPI();
