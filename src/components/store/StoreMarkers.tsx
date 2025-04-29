
import { useEffect, useState, useRef } from 'react';
import MarkerManager from './markers/MarkerManager';
import PlacesSearchService from './search/PlacesSearchService';
import { useStores } from '@/hooks/useStores';
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

        // Pas de recherche automatique 
        console.log("Aucune recherche automatique n'est lancée");

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
      return; // Ne rien faire si la recherche est vide
    }
    
    // Nettoyer les marqueurs existants avant une nouvelle recherche
    markerManager.clearMarkers();
    setNoResults(false);
    
    try {
      console.log("Début de la recherche pour:", searchQuery);
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

  return (
    <>
      <StoreSearchBar 
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={handleSearch}
        isSearching={isSearching}
        noResults={noResults}
      />
    </>
  );
};

export default StoreMarkers;
