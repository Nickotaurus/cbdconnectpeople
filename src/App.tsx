
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/auth";

import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import Index from "./pages/Index"; 
import Register from "./pages/Register";
import Login from "./pages/Login";

// Lazy load pages for better performance
const MapView = lazy(() => import("./pages/MapView"));
const StoreDetail = lazy(() => import("./pages/StoreDetail"));
const CbdGuide = lazy(() => import("./pages/CbdGuide"));
const Ranking = lazy(() => import("./pages/Ranking"));
const StoreAdmin = lazy(() => import("./pages/StoreAdmin"));
const AddStore = lazy(() => import("./pages/AddStore"));
const ImportStores = lazy(() => import("./pages/ImportStores"));
const Partners = lazy(() => import("./pages/Partners"));
const PartnersSubscriptionPage = lazy(() => import("./pages/PartnersSubscriptionPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const ClassifiedsPage = lazy(() => import("./pages/ClassifiedsPage"));
const EcommercePage = lazy(() => import("./pages/EcommercePage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const EcommerceSubscriptionPage = lazy(() => import("./pages/EcommerceSubscriptionPage"));
const Profile = lazy(() => import("./pages/Profile"));
const PublishClassifiedPage = lazy(() => import("./pages/PublishClassifiedPage"));
const AdminClassifiedsPage = lazy(() => import("./pages/AdminClassifiedsPage"));

// Nouveaux ajouts - client interface pages
const MyFavorites = lazy(() => import("./pages/MyFavorites"));
const MyProducts = lazy(() => import("./pages/MyProducts"));
const Lottery = lazy(() => import("./pages/Lottery"));
const Quests = lazy(() => import("./pages/Quests"));

const AddPartner = lazy(() => import("./pages/AddPartner"));
const PartnerProfile = lazy(() => import("./pages/PartnerProfile"));

const PartnersAdmin = lazy(() => import("./pages/PartnersAdmin"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/">
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/partners/subscription" element={<PartnersSubscriptionPage />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  <Route path="/classifieds" element={<ClassifiedsPage />} />
                  <Route path="/classifieds/publish" element={<PublishClassifiedPage />} />
                  <Route path="/admin/classifieds" element={<AdminClassifiedsPage />} />
                  <Route path="/e-commerce" element={<EcommercePage />} />
                  <Route path="/e-commerce/subscription" element={<EcommerceSubscriptionPage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/store-dashboard" element={<StoreAdmin />} />
                  
                  {/* Nouvelles routes pour l'interface client */}
                  <Route path="/my-favorites" element={<MyFavorites />} />
                  <Route path="/my-products" element={<MyProducts />} />
                  <Route path="/lottery" element={<Lottery />} />
                  <Route path="/quests" element={<Quests />} />
                  <Route path="/add-partner" element={<AddPartner />} />
                  <Route path="/partner/profile" element={<PartnerProfile />} />
                  
                  <Route path="/partners/admin" element={<PartnersAdmin />} />
                  
                  <Route path="*" element={<Navigate to="/" replace />} />
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
