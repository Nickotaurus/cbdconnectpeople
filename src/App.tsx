
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Navbar from "./components/Navbar";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const MapView = lazy(() => import("./pages/MapView"));
const StoreDetail = lazy(() => import("./pages/StoreDetail"));
const CbdGuide = lazy(() => import("./pages/CbdGuide"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col w-full">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Chargement...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/store/:id" element={<StoreDetail />} />
                <Route path="/guide" element={<CbdGuide />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
