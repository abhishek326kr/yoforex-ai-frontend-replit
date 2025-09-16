import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { Dashboard } from "@/pages/Dashboard";
import { LiveTrading } from "@/pages/LiveTrading";
import { History } from "@/pages/History";
import { ActiveTrades } from "@/pages/ActiveTrades";
import { Settings } from "@/pages/Settings";
import { Pricing } from "@/pages/Pricing";
import { Billing } from "@/pages/Billing";
import BillingSuccess from "@/pages/BillingSuccess";
import BillingFailure from "@/pages/BillingFailure";
import { Profile } from "@/pages/Profile";
import { Auth } from "@/pages/Auth";
// import { Landing } from "@/pages/Landing";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import NotFound from "@/pages/NotFound";
import HelpSupport from "./components/HelpSupport";
import { Journal } from "./components/Journal";
import UpgradeModal from "@/components/billing/UpgradeModal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="yoforex-ui-theme">
      <TooltipProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        {/* Global modals */}
        <UpgradeModal />
        <Router>
          <AuthProvider>
          <Switch>
            {/* Public routes */}
            <Route path="/auth">
              <PublicRoute>
                <Auth />
              </PublicRoute>
            </Route>

            {/* Protected routes */}
            <Route path="/dashboard">
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Route>
            <Route path="/trading">
              <ProtectedRoute>
                <LiveTrading />
              </ProtectedRoute>
            </Route>
            <Route path="/history">
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            </Route>
            <Route path="/active">
              <ProtectedRoute>
                <ActiveTrades />
              </ProtectedRoute>
            </Route>
            <Route path="/settings">
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            </Route>
            <Route path="/profile">
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Route>
            <Route path="/pricing">
              <ProtectedRoute>
                <Pricing />
              </ProtectedRoute>
            </Route>
            <Route path="/billing">
              <ProtectedRoute>
                <Billing />
              </ProtectedRoute>
            </Route>
            <Route path="/billing/success">
              <ProtectedRoute>
                <BillingSuccess />
              </ProtectedRoute>
            </Route>
            <Route path="/billing/failure">
              <ProtectedRoute>
                <BillingFailure />
              </ProtectedRoute>
            </Route>
            <Route path="/help">
              <ProtectedRoute>
                <HelpSupport />
              </ProtectedRoute>
            </Route>
            <Route path="/journal">
              <ProtectedRoute>
                <Journal />
              </ProtectedRoute>
            </Route>
            
            {/* Catch-all route - redirects based on auth status */}
            <Route path="/">
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Route>
            <Route component={NotFound} />
          </Switch>
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
