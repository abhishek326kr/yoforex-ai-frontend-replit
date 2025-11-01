// Add these imports if they're missing:
import { ToastContainer } from 'react-toastify';

import { CashfreePlanCheckout } from "@/components/billing/CashfreePlanCheckout";
import { CoinPaymentsPlanCheckout } from "@/components/billing/CoinPaymentsPlanCheckout";
import { About } from "@/pages/About";
import 'react-toastify/dist/ReactToastify.css';

import { History as HistoryPage } from "@/pages/History";
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
import  NotFound from "@/pages/NotFound";
import HelpSupport from "./components/HelpSupport";
import Help from "@/pages/Help";
import { Journal } from "./components/Journal";
import UpgradeModal from "@/components/billing/UpgradeModal";
import TicketView from "@/pages/TicketView";
import Footer from "@/components/layout/Footer";
import { Terms } from "@/pages/Terms";
import { Privacy } from "@/pages/Privacy";
import { Refunds } from "@/pages/Refunds";
import { Contact } from "@/pages/Contact";
import { Legal } from "@/pages/Legal";
import { TradingLayout } from "@/components/layout/TradingLayout";
import Forum from "@/pages/Forum";
import ForumPostDetail from "@/pages/ForumPostDetail";
import ForumNewPost from "@/pages/ForumNewPost";

const queryClient = new QueryClient();

// Component to handle Cashfree route with plan parameter
const CashfreeRouteHandler = () => {
  // wouter's location may not include the query string reliably, so use
  // window.location.search which contains the full query string for the current URL.
  const params = new URLSearchParams(window.location.search || '');
  const plan = (params.get('plan') || null) as 'pro' | 'max' | null;

  if (!plan) {
    return <div>Invalid plan selected</div>;
  }

  return <CashfreePlanCheckout plan={plan} />;
};

// Component to handle CoinPayments route with plan parameter
const CoinPaymentsRouteHandler = () => {
  const params = new URLSearchParams(window.location.search || '');
  const plan = (params.get('plan') || null) as 'pro' | 'max' | null;
  const currency = (params.get('currency') || undefined) as string | undefined;

  if (!plan) {
    return <div>Invalid plan selected</div>;
  }

  return <CoinPaymentsPlanCheckout plan={plan} currency={currency} />;
};

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

              {/* Public legal/info routes */}
              <Route path="/about">
                <TradingLayout>
                  <About />
                </TradingLayout>
              </Route>
              
              {/* Forum routes */}
              <Route path="/forum">
                <TradingLayout>
                  <Forum />
                </TradingLayout>
              </Route>
              <Route path="/forum/post/:postId">
                <TradingLayout>
                  <ForumPostDetail />
                </TradingLayout>
              </Route>
              <Route path="/forum/new-post">
                <ProtectedRoute>
                  <TradingLayout>
                    <ForumNewPost />
                  </TradingLayout>
                </ProtectedRoute>
              </Route>
              <Route path="/terms">
                <TradingLayout>
                  <Terms />
                </TradingLayout>
              </Route>
              <Route path="/privacy">
                <TradingLayout>
                  <Privacy />
                </TradingLayout>
              </Route>
              <Route path="/refunds">
                <TradingLayout>
                  <Refunds />
                </TradingLayout>
              </Route>
              <Route path="/contact">
                <TradingLayout>
                  <Contact />
                </TradingLayout>
              </Route>
              <Route path="/legal">
                <TradingLayout>
                  <Legal />
                </TradingLayout>
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
                  <HistoryPage />
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
              <Route path="/billing/cashfree">
                <ProtectedRoute>
                  <CashfreeRouteHandler />
                </ProtectedRoute>
              </Route>
              <Route path="/billing/coinpayments">
                <ProtectedRoute>
                  <CoinPaymentsRouteHandler />
                </ProtectedRoute>
              </Route>
              <Route path="/help">
                <ProtectedRoute>
                  <Help />
                </ProtectedRoute>
              </Route>
              <Route path="/help/submit">
                <ProtectedRoute>
                  <HelpSupport />
                </ProtectedRoute>
              </Route>
              <Route path="/help/tickets/:id">
                <ProtectedRoute>
                  <TicketView />
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
        <Footer />
       
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;


