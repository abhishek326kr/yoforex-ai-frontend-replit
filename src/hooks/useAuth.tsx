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
  const [logoutTimerId, setLogoutTimerId] = useState<number | null>(null);

  // Decode JWT without external deps (assumes well-formed JWT)
  const parseJwt = (token: string): any | null => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded;
    } catch {
      return null;
    }
  };

  const scheduleAutoLogout = (token: string | null) => {
    if (logoutTimerId) {
      clearTimeout(logoutTimerId);
      setLogoutTimerId(null);
    }
    if (!token) return;
    const payload = parseJwt(token);
    const expSec = payload?.exp; // seconds since epoch
    if (!expSec) return;
    const nowMs = Date.now();
    const expMs = expSec * 1000;
    // Logout 5 seconds before expiry to avoid race
    const delay = Math.max(0, expMs - nowMs - 5000);
    const id = window.setTimeout(() => {
      // Broadcast cross-tab logout and perform local logout
      try { localStorage.setItem('auth:logout', String(Date.now())); } catch {}
      logout();
    }, delay);
    setLogoutTimerId(id);
    // Persist expiry for other tabs to optionally read/display
    try { localStorage.setItem('auth:exp', String(expMs)); } catch {}
  };

  // Cross-tab auth events
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'auth:logout') {
        // Another tab logged out; mirror locally without redirect thrash
        clearLocalAuthState(false);
      } else if (e.key === 'auth:token') {
        // Token rotated/updated in another tab; reschedule timer
        const t = localStorage.getItem('authToken') || localStorage.getItem('access_token');
        scheduleAutoLogout(t);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [logoutTimerId]);

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
      // Keep auto-logout aligned with backend exp if a token exists
      scheduleAutoLogout(token);
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
      clearLocalAuthState();
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
        clearLocalAuthState();
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
      clearLocalAuthState();
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string) => {
    localStorage.setItem('authToken', token);
    try { localStorage.setItem('auth:token', String(Date.now())); } catch {}
    setIsAuthenticated(true);
    scheduleAutoLogout(token);

    // Fetch and store profile data after successful login
    await fetchAndStoreProfile();
  };

  const clearLocalAuthState = (broadcast: boolean = false) => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('access_token');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userPreferences');
      localStorage.removeItem('userSecurity');
      localStorage.removeItem('auth:exp');
      if (broadcast) localStorage.setItem('auth:logout', String(Date.now()));
    } catch {}
    if (logoutTimerId) {
      clearTimeout(logoutTimerId);
    }
    setIsAuthenticated(false);
    setUser(null);
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
      // Clear local auth and cached profile data, and broadcast
      clearLocalAuthState(true);
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