import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Video from "@/pages/video";
import Search from "@/pages/search";
import Category from "@/pages/category";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/video/:id" component={Video} />
      <Route path="/search" component={Search} />
      <Route path="/category/:slug" component={Category} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
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
            <Router />
          </main>
        </div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
