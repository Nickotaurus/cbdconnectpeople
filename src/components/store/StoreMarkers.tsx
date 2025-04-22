
import { useEffect } from 'react';
import MarkerManager from './markers/MarkerManager';
import PlacesSearchService from './search/PlacesSearchService';
import { useToast } from "@/components/ui/use-toast";

interface StoreMarkersProps {
  map: google.maps.Map | null;
  userLocation: google.maps.LatLngLiteral | null;
  onStoreSelect: (store: google.maps.places.PlaceResult) => void;
}

const StoreMarkers = ({ map, userLocation, onStoreSelect }: StoreMarkersProps) => {
  const { toast } = useToast();
  
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

      const markerManager = MarkerManager({ map, userLocation, onStoreSelect });
      const placesService = PlacesSearchService({
        map,
        userLocation,
        onAddMarker: markerManager.addMarker,
        setIsSearching: markerManager.setIsSearching,
        setHasResults: markerManager.setHasResults
      });

      // Clear existing markers
      markerManager.clearMarkers();
      
      try {
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

  return null;
};

declare global {
  interface Window {
    selectStore?: (placeId: string) => void;
  }
}

export default StoreMarkers;
