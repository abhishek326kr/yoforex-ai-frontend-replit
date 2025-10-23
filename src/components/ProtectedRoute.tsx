import { ReactNode, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

// ==============================================
// 1. Type Definitions
// ==============================================
interface ProtectedRouteProps {
  children: ReactNode;
}

// ==============================================
// 2. Main Component
// ==============================================
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Hooks & State
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [matches] = useRoute("/auth");

// ============================================
// 3. Authentication & Routing Logic
// ============================================
  useEffect(() => {
    // Skip if still loading auth state
    if (loading) return;

    const accessToken = localStorage.getItem('access_token');
    const currentPath = window.location.pathname;

    // Wait for auth state to sync if token exists but not yet authenticated
    if (accessToken && !isAuthenticated) return;

    // ------------------------------------------
    // Unauthenticated User Flow
    // ------------------------------------------
    if (!isAuthenticated && !accessToken) {
      // Store intended path if not already on auth or root
      if (currentPath !== '/auth' && currentPath !== '/') {
        sessionStorage.setItem('intendedPath', currentPath);
      }
      
      // Redirect to auth if not already there
      if (currentPath !== '/auth') {
        setLocation("/auth", { replace: true });
      }
      return;
    }

    // ------------------------------------------
    // Authenticated User Flow
    // ------------------------------------------
    
    // Handle root path redirection
    if (currentPath === '/') {
      const intendedPath = sessionStorage.getItem('intendedPath') || '/dashboard';
      sessionStorage.removeItem('intendedPath');
      setLocation(intendedPath, { replace: true });
      return;
    }

    // Redirect away from auth page if already authenticated
    if (currentPath === '/auth') {
      const intendedPath = sessionStorage.getItem('intendedPath') || '/dashboard';
      sessionStorage.removeItem('intendedPath');
      setLocation(intendedPath, { replace: true });
    }
  }, [isAuthenticated, loading, setLocation, matches]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/auth", { replace: true });
    return null;
  }

  return <>{children}</>;
}