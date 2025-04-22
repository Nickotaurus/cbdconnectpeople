
import { useEffect, useRef, useState } from 'react';
import { getCurrentLocation, initializeGoogleMap } from '@/utils/mapUtils';
import { toast } from "@/components/ui/use-toast";
import { getGoogleMapsApiKey } from '@/utils/googlePlacesService';

export const useGoogleMap = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [apiKeyLoaded, setApiKeyLoaded] = useState(false);

  // Load the Google Maps API script
  useEffect(() => {
    const loadGoogleMapsApi = async () => {
      if (window.google?.maps) {
        setApiKeyLoaded(true);
        return;
      }

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

        // Create and load the Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log("Google Maps API loaded successfully");
          setApiKeyLoaded(true);
        };
        
        script.onerror = () => {
          console.error("Failed to load Google Maps API");
          toast({
            title: "Erreur",
            description: "Impossible de charger l'API Google Maps",
            variant: "destructive"
          });
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement de l'API Google Maps",
          variant: "destructive"
        });
      }
    };

    loadGoogleMapsApi();
  }, []);

  const initializeMap = async (mapElement: HTMLElement | null) => {
    if (!mapElement) return null;
    if (!apiKeyLoaded) {
      toast({
        title: "Chargement",
        description: "En attente du chargement de l'API Google Maps...",
        variant: "default"
      });
      return null;
    }

    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
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
  };

  return {
    map: mapRef.current,
    isLoading,
    userLocation,
    initializeMap,
    apiKeyLoaded
  };
};
