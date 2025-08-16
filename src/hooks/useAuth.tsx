import { useState, useEffect, createContext, useContext } from "react";
// import { useLocation } from "wouter";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
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

  const validateToken = async (token: string) => {
    try {
      // You can add a token validation endpoint here
      // const response = await axios.get('/auth/validate', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // For now, we'll just check if token exists
      if (token) {
        setIsAuthenticated(true);
        // Set basic user data - you can enhance this with actual token decoding
        setUser({
          name: 'User',
          email: 'user@example.com'
        });
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

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    // Set basic user data - you can enhance this with actual token decoding
    setUser({
      name: 'User',
      email: 'user@example.com'
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
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