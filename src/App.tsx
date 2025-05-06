
import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home"; // Updated import path
import MapView from "./pages/MapView";
import AddStore from "./pages/AddStore";

function App() {
  // Effet pour nettoyer les données de CBD Histoire de Chanvre dans le localStorage a été supprimé
  // puisque la nouvelle implémentation utilise directement Supabase

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/add-store" element={<AddStore />} />
    </Routes>
  );
}

export default App;
