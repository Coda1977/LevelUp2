import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Suspense, lazy } from "react";
import CategoryPage from "./pages/category";

const Landing = lazy(() => import("@/pages/landing"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Learn = lazy(() => import("@/pages/learn"));
const Chat = lazy(() => import("@/pages/chat"));
const Chapter = lazy(() => import("@/pages/chapter"));
const Analytics = lazy(() => import("@/pages/analytics"));
const Team = lazy(() => import("@/pages/team"));
const Admin = lazy(() => import("@/pages/admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--accent-yellow)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col md:px-0 px-1 md:py-0 py-1">
      <Navigation />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-12 h-12 border-4 border-[var(--accent-yellow)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div></div>}>
        <Switch>
          <Route path="/" component={!isAuthenticated ? Landing : Dashboard} />
          <Route path="/dashboard" component={isAuthenticated ? Dashboard : Landing} />
          <Route path="/learn" component={isAuthenticated ? Learn : Landing} />
          <Route path="/chat" component={isAuthenticated ? Chat : Landing} />
          <Route path="/analytics" component={isAuthenticated ? Analytics : Landing} />
          <Route path="/team" component={isAuthenticated ? Team : Landing} />
          <Route path="/admin" component={isAuthenticated ? Admin : Landing} />
          <Route path="/chapter/:slug" component={isAuthenticated ? Chapter : Landing} />
          <Route path="/category/:slug" component={CategoryPage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
