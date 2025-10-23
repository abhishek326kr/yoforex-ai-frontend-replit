import { useLocation, Link } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const [location] = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location
    );
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <div className="max-w-4xl w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <AlertTriangle className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-foreground mb-4">Page Not Found</h2>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-gradient-primary hover:bg-primary-hover gap-2">
              <Home className="h-4 w-4" />
              Go to Homepage
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/trading">
              <Button variant="ghost" size="sm">Trading</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link href="/history">
              <Button variant="ghost" size="sm">History</Button>
            </Link>
            <Link href="/help">
              <Button variant="ghost" size="sm">Help Center</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
