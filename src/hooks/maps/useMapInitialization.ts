
import { useCallback, useRef, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { initializeGoogleMap } from '@/utils/mapUtils';

export const useMapInitialization = (apiKeyLoaded: boolean) => {
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const { toast } = useToast();
  const initializationAttemptsRef = useRef(0);

  const initializeMap = useCallback(async (mapElement: HTMLElement) => {
    if (!mapElement) {
      console.error("Map element not found");
      return null;
    }
    
    if (!apiKeyLoaded) {
      console.log("API not loaded yet, waiting");
      return null;
    }
    
    if (!window.google?.maps?.Map) {
      console.error("Google Maps API not fully loaded");
      initializationAttemptsRef.current += 1;
      
      if (initializationAttemptsRef.current > 3) {
        toast({
          title: "Erreur",
          description: "L'API Google Maps n'est pas correctement chargée",
          variant: "destructive"
        });
        return null;
      }
      
      return null;
    }

    console.log("Initializing map with element:", mapElement);
    setIsLoading(true);
    
    try {
      const location = { lat: 48.856614, lng: 2.3522219 }; // Default to Paris until we get user location
      const map = initializeGoogleMap(mapElement, location);
      mapRef.current = map;
      console.log("Map initialized successfully");
      initializationAttemptsRef.current = 0;
      return map;
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser la carte",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiKeyLoaded, toast]);

  return {
    map: mapRef.current,
    isLoading,
    initializeMap
  };
};
