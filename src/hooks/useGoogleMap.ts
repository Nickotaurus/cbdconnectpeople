
import { useEffect, useRef, useState, useCallback } from 'react';
import { getCurrentLocation, initializeGoogleMap } from '@/utils/mapUtils';
import { useToast } from "@/components/ui/use-toast";
import { getGoogleMapsApiKey } from '@/utils/googlePlacesService';

export const useGoogleMap = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [apiKeyLoaded, setApiKeyLoaded] = useState(false);
  const { toast } = useToast();
  const scriptLoadingRef = useRef(false);

  // Load the Google Maps API script
  useEffect(() => {
    const loadGoogleMapsApi = async () => {
      // If Google Maps API is already loaded or currently loading
      if (window.google?.maps || scriptLoadingRef.current) {
        if (window.google?.maps) {
          console.log("Google Maps API already loaded");
          setApiKeyLoaded(true);
        }
        return;
      }

      scriptLoadingRef.current = true;
      
      try {
        const apiKey = await getGoogleMapsApiKey();
        if (!apiKey) {
          toast({
            title: "Erreur",
            description: "Clé API Google Maps non disponible",
            variant: "destructive"
          });
          return;
        }

        console.log("Fetched Google Maps API key, loading script");

        // Create and load the Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log("Google Maps API loaded successfully");
          setApiKeyLoaded(true);
          scriptLoadingRef.current = false;
        };
        
        script.onerror = () => {
          console.error("Failed to load Google Maps API");
          toast({
            title: "Erreur",
            description: "Impossible de charger l'API Google Maps",
            variant: "destructive"
          });
          scriptLoadingRef.current = false;
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement de l'API Google Maps",
          variant: "destructive"
        });
        scriptLoadingRef.current = false;
      }
    };

    loadGoogleMapsApi();
  }, [toast]);

  const initializeMap = useCallback(async (mapElement: HTMLElement | null) => {
    if (!mapElement) {
      console.error("Map element not found");
      return null;
    }
    
    if (!apiKeyLoaded) {
      console.log("API not loaded yet, waiting");
      return null;
    }

    setIsLoading(true);
    try {
      console.log("Initializing map with element:", mapElement);
      const location = await getCurrentLocation();
      console.log("Got user location:", location);
      setUserLocation(location);
      const map = initializeGoogleMap(mapElement, location);
      mapRef.current = map;
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
    userLocation,
    initializeMap,
    apiKeyLoaded
  };
};
