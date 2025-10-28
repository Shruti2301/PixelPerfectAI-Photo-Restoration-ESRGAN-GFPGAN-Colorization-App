// client/src/hooks/useAuth.ts
// =============================================================
// Hook: useAuth & Provider: AuthProvider
// -------------------------------------------------------------
// Manages the application's authentication state, including
// user session data, login/logout functions, and loading state.
// It leverages React Query for session fetching and caching.
// =============================================================
// Author: Shruti Mandaokar
// Date: October 2025

import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth, AuthProvider } from "@/hooks/useAuth"; 

// Pages
import Landing from "@/pages/Landing";
import HowItWorks from "@/pages/HowItWorks";
import Gallery from "@/pages/Gallery";
import FeaturesPage from "@/pages/Features";
import Architecture from "@/pages/Architecture";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import DocumentationPage from "@/pages/DocumentationPage";
import Dashboard from "@/pages/Dashboard"; 
import Admin from "@/pages/Admin";
import Login from "@/pages/Login"; 
import Signup from "@/pages/Signup"; 
import NotFound from "@/pages/not-found";

// -------------------------------------------------------------------
// Component: ProtectedRoute
// -------------------------------------------------------------------
const ProtectedRoute: React.FC<{ component: React.ComponentType<any>; path: string }> = ({ component: Component, ...rest }) => {
  // This hook relies on AuthProvider being available
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-xl">Checking session...</div>; 
  }

  // Admin route protection
  if (rest.path === '/admin') {
    if (!isAuthenticated || !user?.isAdmin) {
      return <Redirect to="/" />;
    }
  }

  // General protected route protection
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Route {...rest} component={Component} />;
};

// -------------------------------------------------------------------
// AppRouter: Defines all routes in the application
// -------------------------------------------------------------------
function AppRouter() {
  // This hook relies on AuthProvider being available
  const { isAuthenticated, isLoading } = useAuth(); 

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading Application...
      </div>
    );
  }

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Landing} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/architecture" component={Architecture} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/documentation" component={DocumentationPage} />
      
      {/* Auth Routes */}
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <Login />}
      </Route>
      <Route path="/signup">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <Signup />}
      </Route>

      {/* Protected Routes */}
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/admin" component={Admin} />

      {/* Fallback Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// -------------------------------------------------------------------
// App Component: Wraps AppRouter with all providers
// -------------------------------------------------------------------
function App() {
  return (
    // 1. QueryClientProvider MUST be the top-level wrapper here
    <QueryClientProvider client={queryClient}> 
        
      {/* 2. AuthProvider MUST be inside QueryClientProvider since it uses useQueryClient() */}
      <AuthProvider> 
        <TooltipProvider> 
          <Toaster /> 
          <AppRouter /> 
        </TooltipProvider>
      </AuthProvider>

    </QueryClientProvider>
  );
}

export default App;