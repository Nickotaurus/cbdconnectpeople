
import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import MapView from "./pages/MapView";
import AddStore from "./pages/AddStore";
import StoreAdmin from "./pages/StoreAdmin";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Navbar from "./components/Navbar";
import NewsPage from "./pages/NewsPage";
import Partners from "./pages/Partners";
import ClassifiedsPage from "./pages/ClassifiedsPage";
import PublishClassifiedPage from "./pages/PublishClassifiedPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import StoreDashboard from "./pages/StoreDashboard";
import EcommercePage from "./pages/EcommercePage";
import AdminClassifiedsPage from "./pages/AdminClassifiedsPage";
import PartnersAdmin from "./pages/PartnersAdmin";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/ecommerce" element={<EcommercePage />} />
        <Route path="/classifieds" element={<ClassifiedsPage />} />
        <Route path="/classifieds/publish" element={<PublishClassifiedPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/store-dashboard" element={<StoreDashboard />} />
        <Route path="/add-store" element={<AddStore />} />
        <Route path="/store/:id" element={<StoreAdmin />} />
        <Route path="/store/:id/admin" element={<StoreAdmin />} />
        <Route path="/admin/classifieds" element={<AdminClassifiedsPage />} />
        <Route path="/admin/partners" element={<PartnersAdmin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
