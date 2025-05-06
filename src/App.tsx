
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home"; // Updated import path
import MapView from "./pages/MapView";
import AddStore from "./pages/AddStore";

function App() {
  // Effet pour nettoyer les données de CBD Histoire de Chanvre dans le localStorage
  useEffect(() => {
    try {
      // Récupérer les boutiques du localStorage
      const savedStores = localStorage.getItem('cbd-stores');
      if (savedStores) {
        const stores = JSON.parse(savedStores);
        
        // Filtrer pour supprimer CBD Histoire de Chanvre
        const filteredStores = stores.filter((store: any) => 
          !store.name.toLowerCase().includes("histoire de chanvre")
        );
        
        // Sauvegarder les données mises à jour
        localStorage.setItem('cbd-stores', JSON.stringify(filteredStores));
        console.log("Nettoyage des données de CBD Histoire de Chanvre terminé");
      }
      
      // Supprimer les IDs stockés des boutiques
      if (localStorage.getItem('userStoreId')) {
        const storeId = localStorage.getItem('userStoreId');
        // Vérifier si c'est l'ID d'une boutique Histoire de Chanvre avant de supprimer
        const isHistoireDeChanvre = sessionStorage.getItem('isHistoireDeChanvre') === 'true';
        if (isHistoireDeChanvre) {
          localStorage.removeItem('userStoreId');
          sessionStorage.removeItem('userStoreId');
          sessionStorage.removeItem('isHistoireDeChanvre');
        }
      }
    } catch (e) {
      console.error('Erreur lors du nettoyage des données:', e);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/add-store" element={<AddStore />} />
    </Routes>
  );
}

export default App;
