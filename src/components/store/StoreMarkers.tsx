
import { useEffect, useState, useRef } from 'react';
import MarkerManager from './markers/MarkerManager';
import PlacesSearchService from './search/PlacesSearchService';
import { useToast } from "@/components/ui/use-toast";
import StoreSearchBar from './search/StoreSearchBar';

interface StoreMarkersProps {
  map: google.maps.Map | null;
  userLocation: google.maps.LatLngLiteral | null;
  onStoreSelect: (placeId: string) => void;
  isRegistration?: boolean;
}

const StoreMarkers = ({ map, userLocation, onStoreSelect, isRegistration = false }: StoreMarkersProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [searchService, setSearchService] = useState<ReturnType<typeof PlacesSearchService> | null>(null);
  const [markerManager, setMarkerManager] = useState<ReturnType<typeof MarkerManager> | null>(null);
  
  // Initialiser les marqueurs et services
  useEffect(() => {
    if (!map) {
      console.log("Map non disponible");
      return;
    }

    // Utiliser une position par défaut si l'utilisateur a refusé la géolocalisation
    const position = userLocation || { lat: 48.8566, lng: 2.3522 };

    try {
      console.log("Initialisation du gestionnaire de marqueurs");
      
      const handleStoreSelect = (placeResult: google.maps.places.PlaceResult) => {
        if (placeResult.place_id) {
          onStoreSelect(placeResult.place_id);
        }
      };
      
      const manager = MarkerManager({ 
        map, 
        userLocation: position, 
        onStoreSelect: handleStoreSelect,
        toast 
      });
      
      setMarkerManager(manager);
      
      const placesService = PlacesSearchService({
        map,
        userLocation: position,
        onAddMarker: manager.addMarker,
        setIsSearching: (value) => {
          manager.setIsSearching(value);
          setIsSearching(value);
        },
        setHasResults: (value) => {
          manager.setHasResults(value);
          setNoResults(!value);
        }
      });
      
      setSearchService(placesService);
      console.log("Services initialisés avec succès");
    } catch (error) {
      console.error('Erreur d\'initialisation:', error);
    }
  }, [map, userLocation, onStoreSelect, toast]);

  // Fonction de recherche simplifiée
  const handleSearch = async () => {
    if (!searchService || !markerManager) {
      console.log("Services non initialisés");
      
      toast({
        title: "Erreur",
        description: "La carte n'est pas encore initialisée. Veuillez patienter.",
      });
      return;
    }
    
    if (!searchQuery.trim()) {
      toast({
        title: "Champ vide",
        description: "Veuillez saisir un terme de recherche",
      });
      return;
    }
    
    markerManager.clearMarkers();
    await searchService.textSearch(searchQuery);
  };

  return (
    <StoreSearchBar 
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      onSearch={handleSearch}
      isSearching={isSearching}
      noResults={noResults}
    />
  );
};

export default StoreMarkers;
