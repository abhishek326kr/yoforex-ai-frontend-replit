import { useState, useEffect, createContext, useContext } from "react";
import { profileStorage } from "@/utils/profileStorage";
import axios from "axios";
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
    // Check for existing token on app load
    const token = localStorage.getItem('authToken');
    if (token) {
      // Validate token with backend (optional)
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAndStoreProfile = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        const profileData = response.data;
        
        // Store in profile management system
        await profileStorage.initializeTables();
        await profileStorage.saveProfile({
          name: profileData.name || 'User',
          email: profileData.email || 'user@example.com',
          phone: profileData.phone || '',
          bio: profileData.bio || '',
          location: profileData.location || '',
          timezone: profileData.timezone || 'America/New_York',
          language: profileData.language || 'English',
          currency: profileData.currency || 'USD',
          first_name: profileData.first_name || profileData.name?.split(' ')[0] || '',
          last_name: profileData.last_name || profileData.name?.split(' ').slice(1).join(' ') || '',
          avatar_url: profileData.avatar_url || '',
          website: profileData.website || '',
          trading_experience: profileData.trading_experience || '',
          preferred_pairs: profileData.preferred_pairs || '',
          risk_tolerance: profileData.risk_tolerance || ''
        });

        // Update user state
        setUser(profileData);
        console.log('Profile data fetched and stored successfully');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const validateToken = async (token: string) => {
    try {
      // You can add a token validation endpoint here
      // const response = await axios.get('/auth/validate', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // For now, we'll just check if token exists
      if (token) {
        setIsAuthenticated(true);
        // Fetch and store profile data after successful authentication
        await fetchAndStoreProfile();
      }
    } catch (error) {
      // Token is invalid, remove it
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

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/';
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