import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Video from "@/pages/video";
import Search from "@/pages/search";
import Category from "@/pages/category";
import AuthPage from "@/pages/auth-page";
import CodeUpdates from "@/pages/code-updates";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import { useState } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route>
        <MainLayout>
          <Switch>
            <ProtectedRoute path="/" component={Home} />
            <ProtectedRoute path="/video/:id" component={Video} />
            <ProtectedRoute path="/search" component={Search} />
            <ProtectedRoute path="/category/:slug" component={Category} />
            <ProtectedRoute path="/code-updates" component={CodeUpdates} />
            <Route component={NotFound} />
          </Switch>
        </MainLayout>
      </Route>
    </Switch>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Header 
        onMenuClick={() => setIsMobileSidebarOpen(true)} 
        onSearchToggle={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
        isMobileSearchOpen={isMobileSearchOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MobileSidebar 
          isOpen={isMobileSidebarOpen} 
          onClose={() => setIsMobileSidebarOpen(false)} 
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
