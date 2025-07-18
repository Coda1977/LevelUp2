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
import Tools from "@/pages/tools";
import Chapter from "@/pages/chapter";
import Analytics from "@/pages/analytics";
import Team from "@/pages/team";
import NotFound from "@/pages/not-found";

function Router() {
  // Temporarily disable authentication to show landing page
  const isAuthenticated = false;
  const isLoading = false;

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
        {!isAuthenticated ? (
          <>
            <Route path="/" component={Landing} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/team" component={Team} />
            <Route component={Landing} />
          </>
        ) : (
          <>
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/learn" component={Learn} />
            <Route path="/chat" component={Chat} />
            <Route path="/tools" component={Tools} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/team" component={Team} />
            <Route path="/chapter/:slug" component={Chapter} />
            <Route component={NotFound} />
          </>
        )}
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
