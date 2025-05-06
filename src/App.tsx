
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
import Ranking from "./pages/Ranking";
import ClassifiedsPage from "./pages/ClassifiedsPage";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/classifieds" element={<ClassifiedsPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-store" element={<AddStore />} />
        <Route path="/store/:id" element={<StoreAdmin />} />
        <Route path="/store/:id/admin" element={<StoreAdmin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
