import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Learn from "@/pages/learn";
import Chat from "@/pages/chat";
import Chapter from "@/pages/chapter";
import Analytics from "@/pages/analytics";
import Team from "@/pages/team";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Debug logging
  console.log('Router render - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navigation />
      <Switch>
        <Route path="/" component={!isAuthenticated ? Landing : Dashboard} />
        <Route path="/dashboard" component={isAuthenticated ? Dashboard : Landing} />
        <Route path="/learn" component={isAuthenticated ? Learn : Landing} />
        <Route path="/chat" component={isAuthenticated ? Chat : Landing} />
        <Route path="/analytics" component={isAuthenticated ? Analytics : Landing} />
        <Route path="/team" component={isAuthenticated ? Team : Landing} />
        <Route path="/admin" component={isAuthenticated ? Admin : Landing} />
        <Route path="/chapter/:slug" component={isAuthenticated ? Chapter : Landing} />
        <Route component={NotFound} />
      </Switch>
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
