
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { loadGoogleMapsAPI, isGoogleMapsLoaded } from '@/services/googleMapsService';

export const useGooglePlacesApi = () => {
  const [isApiLoaded, setIsApiLoaded] = useState(isGoogleMapsLoaded());
  const [isLoading, setIsLoading] = useState(!isGoogleMapsLoaded());
  const { toast } = useToast();

  useEffect(() => {
    // If API is already loaded, just update the state
    if (isGoogleMapsLoaded()) {
      console.log("Google Maps Places API already available");
      setIsApiLoaded(true);
      setIsLoading(false);
      return;
    }
    
    const loadPlacesApi = async () => {
      try {
        console.log("Loading Google Places API from useGooglePlacesApi");
        await loadGoogleMapsAPI(['places', 'marker']);
        setIsApiLoaded(true);
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement de l'API Google Maps",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPlacesApi();
  }, [toast]);

  return { isApiLoaded, isLoading };
};
