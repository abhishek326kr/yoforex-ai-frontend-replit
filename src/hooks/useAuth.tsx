import React, { createContext, useContext, useState, useEffect} from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { profileStorage } from "@/utils/profileStorage";
// import { useLocation } from "wouter";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  fetchAndStoreProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // const navigate = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load using cookie-based auth
    validateSession();
  }, []);

  const validateSession = async () => {
    try {
      const token =
        typeof window !== 'undefined'
          ? (localStorage.getItem('authToken') || localStorage.getItem('access_token'))
          : null;
      // Try to fetch profile using cookie-based authentication
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
      });
      
      if (response.data) {
        setIsAuthenticated(true);
        setUser(response.data);
        // Fetch and store complete profile data
        await fetchAndStoreProfile();
      }
    } catch (error) {
      // No valid session, clear any stale auth state
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAndStoreProfile = async () => {
    try {
      const token =
        typeof window !== 'undefined'
          ? (localStorage.getItem('authToken') || localStorage.getItem('access_token'))
          : null;
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        withCredentials: true, // Use cookie-based authentication
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
      });

      if (response.data) {
        const profileData = response.data;
        
        // Initialize storage and cache locally without writing back to API
        await profileStorage.initializeTables();
        localStorage.setItem('userProfile', JSON.stringify(profileData));

        // Update user state
        setUser(profileData);
        console.log('Profile data fetched and cached successfully');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // If we get 401, user is not authenticated
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('authToken');
      }
    }
  };

  const validateToken = async (token: string) => {
    try {
      // Try to fetch profile using cookie-based authentication
      // This will validate if the user session is still valid
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
      });
      
      if (response.data) {
        setIsAuthenticated(true);
        setUser(response.data);
        // Fetch and store complete profile data
        await fetchAndStoreProfile();
      }
    } catch (error) {
      // Session is invalid, clear auth state
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    
    // Fetch and store profile data after successful login
    await fetchAndStoreProfile();
  };

  const logout = async () => {
    try {
      // Attempt to clear server-side session cookie
      const token =
        typeof window !== 'undefined'
          ? (localStorage.getItem('authToken') || localStorage.getItem('access_token'))
          : null;
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
    } catch (e) {
      // Ignore network errors here; we'll still clear local state
      console.warn('Logout request failed, proceeding to clear local state');
    } finally {
      // Clear local auth and cached profile data
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('access_token');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userPreferences');
        localStorage.removeItem('userSecurity');
      } catch (e) {
        // ignore localStorage clearing errors (e.g., browser restrictions or quotas)
      }
      setIsAuthenticated(false);
      setUser(null);
      // Redirect to landing/login
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, fetchAndStoreProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 