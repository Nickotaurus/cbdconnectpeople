
import { useEffect, useState } from 'react';
import MarkerManager from './markers/MarkerManager';
import PlacesSearchService from './search/PlacesSearchService';
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StoreMarkersProps {
  map: google.maps.Map | null;
  userLocation: google.maps.LatLngLiteral | null;
  onStoreSelect: (store: google.maps.places.PlaceResult) => void;
}

const StoreMarkers = ({ map, userLocation, onStoreSelect }: StoreMarkersProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [searchService, setSearchService] = useState<ReturnType<typeof PlacesSearchService> | null>(null);
  
  // État pour stocker les marqueurs
  const [markerManager, setMarkerManager] = useState<ReturnType<typeof MarkerManager> | null>(null);
  
  useEffect(() => {
    const initializeMarkers = async () => {
      if (!map || !userLocation) {
        console.log("Map or user location not available for markers");
        return;
      }

      if (!google?.maps?.places) {
        console.error("Google Places API not loaded");
        toast({
          title: "Erreur",
          description: "API Google Places non disponible",
          variant: "destructive"
        });
        return;
      }

      // Pass toast to MarkerManager
      const manager = MarkerManager({ 
        map, 
        userLocation, 
        onStoreSelect, 
        toast 
      });
      
      setMarkerManager(manager);
      
      const placesService = PlacesSearchService({
        map,
        userLocation,
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

      // Nettoyer les marqueurs existants
      manager.clearMarkers();
      
      try {
        // Recherche automatique au chargement de la carte
        await placesService.searchStores();
      } catch (error) {
        console.error('Error loading markers:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les établissements sur la carte",
          variant: "destructive"
        });
      }
    };

    initializeMarkers();

    return () => {
      window.selectStore = undefined;
    };
  }, [map, userLocation, onStoreSelect, toast]);

  // Fonction pour gérer la recherche manuelle
  const handleSearch = async () => {
    if (!searchService || !markerManager) return;
    
    if (!searchQuery.trim()) {
      toast({
        title: "Champ vide",
        description: "Veuillez saisir un terme de recherche",
        variant: "default"
      });
      return;
    }
    
    // Nettoyer les marqueurs existants avant une nouvelle recherche
    markerManager.clearMarkers();
    setNoResults(false);
    
    try {
      await searchService.textSearch(searchQuery);
    } catch (error) {
      console.error('Error searching for stores:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rechercher des établissements",
        variant: "destructive"
      });
    }
  };

  // Rendu du composant de recherche
  return (
    <div className="absolute left-0 right-0 top-0 p-4 z-20">
      <div className="bg-white rounded-md shadow-md p-3">
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Rechercher une boutique CBD..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            disabled={isSearching}
          />
          <Button 
            onClick={handleSearch} 
            disabled={isSearching}
            variant="default"
          >
            {isSearching ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Rechercher
          </Button>
        </div>
        
        {noResults && (
          <div className="p-2 bg-amber-50 text-amber-800 rounded-md flex items-center text-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>Aucune boutique CBD trouvée. Utilisez des termes différents ou ajoutez votre boutique manuellement.</span>
          </div>
        )}
      </div>
    </div>
  );
};

declare global {
  interface Window {
    selectStore?: (placeId: string) => void;
  }
}

export default StoreMarkers;
