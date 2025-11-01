import { AlertTriangle, XCircle, RefreshCw, Home, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { navigate } from "wouter/use-browser-location";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  showSupportButton?: boolean;
  errorDetails?: string;
  variant?: 'warning' | 'error';
  fullPage?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error while loading this content. Please try again.",
  onRetry,
  showHomeButton = false,
  showSupportButton = false,
  errorDetails,
  variant = 'error',
  fullPage = false,
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const Icon = variant === 'warning' ? AlertTriangle : XCircle;
  const iconColor = variant === 'warning' ? 'text-yellow-500' : 'text-destructive';
  const gradientClass = variant === 'warning' 
    ? 'from-yellow-500/10 to-yellow-500/5' 
    : 'from-destructive/10 to-destructive/5';

  const content = (
    <Card className={`bg-gradient-to-br ${gradientClass} border-border/30`}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className={`p-4 rounded-full bg-background/50 mb-4`}>
          <Icon className={`h-12 w-12 ${iconColor}`} />
        </div>
        
        <h3 className="text-2xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
          {message}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <Button 
              onClick={onRetry}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          
          {showHomeButton && (
            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          )}
          
          {showSupportButton && (
            <Button 
              variant="outline"
              onClick={() => navigate('/help')}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          )}
        </div>

        {errorDetails && (
          <Collapsible
            open={showDetails}
            onOpenChange={setShowDetails}
            className="mt-6 w-full max-w-md"
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                {showDetails ? 'Hide' : 'Show'} error details
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="p-3 bg-muted/50 rounded-md text-left">
                <p className="text-xs font-mono text-muted-foreground break-all">
                  {errorDetails}
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        {content}
      </div>
    );
  }

  return content;
}

export function InlineErrorState({
  message = "Failed to load data",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center justify-center p-6 bg-destructive/5 rounded-lg border border-destructive/20">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <span className="text-sm text-foreground">{message}</span>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
