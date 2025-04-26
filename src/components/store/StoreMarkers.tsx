import { useEffect, useState, useRef } from 'react';
import MarkerManager from './markers/MarkerManager';
import PlacesSearchService from './search/PlacesSearchService';
import { useStores } from '@/hooks/useStores';
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StoreMarkersProps {
  map: google.maps.Map | null;
  userLocation: google.maps.LatLngLiteral | null;
  onStoreSelect: (placeId: string) => void; 
}

const StoreMarkers = ({ map, userLocation, onStoreSelect }: StoreMarkersProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [searchService, setSearchService] = useState<ReturnType<typeof PlacesSearchService> | null>(null);
  const [markerManager, setMarkerManager] = useState<ReturnType<typeof MarkerManager> | null>(null);
  const { stores: supabaseStores, isLoading: isLoadingStores } = useStores();
  const serviceDivRef = useRef<HTMLDivElement | null>(null);
  
  const getServiceDiv = () => {
    if (!serviceDivRef.current) {
      serviceDivRef.current = document.createElement('div');
      serviceDivRef.current.style.width = '1px';
      serviceDivRef.current.style.height = '1px';
      serviceDivRef.current.style.position = 'absolute';
      serviceDivRef.current.style.visibility = 'hidden';
      document.body.appendChild(serviceDivRef.current);
    }
    return serviceDivRef.current;
  };
  
  useEffect(() => {
    const initializeMarkers = async () => {
      if (!map || !userLocation) {
        console.log("Map or user location not available for markers");
        return;
      }

      try {
        console.log("Initializing marker manager with map and user location:", userLocation);
        
        // Create an adapter that transforms placeResult to placeId for onStoreSelect
        const handleStoreSelect = (placeResult: google.maps.places.PlaceResult) => {
          if (placeResult.place_id) {
            onStoreSelect(placeResult.place_id);
          } else {
            console.error("Place has no place_id:", placeResult);
          }
        };
        
        const manager = MarkerManager({ 
          map, 
          userLocation, 
          onStoreSelect: handleStoreSelect,
          toast 
        });
        
        setMarkerManager(manager);
        
        // Clear existing markers
        manager.clearMarkers();
        
        // Add Supabase stores to the map
        if (supabaseStores.length > 0) {
          const serviceDiv = getServiceDiv();
          const service = new google.maps.places.PlacesService(serviceDiv);
          
          for (const store of supabaseStores) {
            const placeResult: google.maps.places.PlaceResult = {
              name: store.name,
              formatted_address: `${store.address}, ${store.city}`,
              geometry: {
                location: new google.maps.LatLng(store.latitude, store.longitude)
              },
              place_id: store.id
            };
            
            manager.addMarker(placeResult, service);
          }
        }
        
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

      } catch (error) {
        console.error('Error loading markers:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les établissements sur la carte",
          variant: "destructive"
        });
      }
    };

    if (!isLoadingStores) {
      initializeMarkers();
    }

    return () => {
      if (markerManager) {
        markerManager.cleanupServiceDiv();
      }
      if (serviceDivRef.current && serviceDivRef.current.parentNode) {
        serviceDivRef.current.parentNode.removeChild(serviceDivRef.current);
      }
      window.selectStore = undefined;
    };
  }, [map, userLocation, onStoreSelect, toast, supabaseStores, isLoadingStores]);

  const handleSearch = async () => {
    if (!searchService || !markerManager || !map) {
      console.error("Services not initialized for search", {
        searchService: !!searchService,
        markerManager: !!markerManager,
        map: !!map
      });
      toast({
        title: "Erreur",
        description: "Les services de recherche ne sont pas initialisés",
        variant: "destructive"
      });
      return;
    }
    
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
      console.log("Début de la recherche pour:", searchQuery);
      await searchService.textSearch(searchQuery);
      console.log("Recherche terminée");
    } catch (error) {
      console.error('Error searching for stores:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rechercher des établissements",
        variant: "destructive"
      });
    }
  };

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
