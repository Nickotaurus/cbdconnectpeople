import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";

import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const MapView = lazy(() => import("./pages/MapView"));
const StoreDetail = lazy(() => import("./pages/StoreDetail"));
const CbdGuide = lazy(() => import("./pages/CbdGuide"));
const Ranking = lazy(() => import("./pages/Ranking"));
const StoreAdmin = lazy(() => import("./pages/StoreAdmin"));
const AddStore = lazy(() => import("./pages/AddStore"));
const ImportStores = lazy(() => import("./pages/ImportStores"));
const Producers = lazy(() => import("./pages/Producers"));
const ProducerProfile = lazy(() => import("./pages/ProducerProfile"));
const AddProducer = lazy(() => import("./pages/AddProducer"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Forum = lazy(() => import("./pages/Forum"));
const Partners = lazy(() => import("./pages/Partners")); // Nouvelle page
const NotFound = lazy(() => import("./pages/NotFound"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
                  <Route path="/ranking" element={<Ranking />} />
                  <Route path="/store/:id/admin" element={<StoreAdmin />} />
                  <Route path="/add-store" element={<AddStore />} />
                  <Route path="/import-stores" element={<ImportStores />} />
                  <Route path="/producers" element={<Producers />} />
                  <Route path="/producer/:id" element={<ProducerProfile />} />
                  <Route path="/add-producer" element={<AddProducer />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forum" element={<Forum />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Chatbot />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
