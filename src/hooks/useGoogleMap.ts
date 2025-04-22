
import { useEffect, useRef, useState, useCallback } from 'react';
import { getCurrentLocation, initializeGoogleMap } from '@/utils/mapUtils';
import { useToast } from "@/components/ui/use-toast";
import { getGoogleMapsApiKey } from '@/services/googleApiService';

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
        console.log("Fetching Google Maps API key...");
        const apiKey = await getGoogleMapsApiKey();
        if (!apiKey) {
          console.error("No API key returned from getGoogleMapsApiKey");
          toast({
            title: "Erreur",
            description: "Clé API Google Maps non disponible",
            variant: "destructive"
          });
          scriptLoadingRef.current = false;
          return;
        }

        console.log("Fetched Google Maps API key, loading script");

        // Create and load the Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsCallback`;
        script.async = true;
        script.defer = true;
        
        // Define a global callback function that will be called when the script is loaded
        window.initGoogleMapsCallback = () => {
          console.log("Google Maps API loaded successfully via callback");
          setApiKeyLoaded(true);
          scriptLoadingRef.current = false;
        };
        
        script.onerror = (e) => {
          console.error("Failed to load Google Maps API:", e);
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
    
    // Handle global callback definition for TypeScript
    return () => {
      // Clean up the global callback
      if (window.initGoogleMapsCallback) {
        delete window.initGoogleMapsCallback;
      }
    };
  }, [toast]);

  // Get user location
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);
      } catch (error) {
        console.error('Error getting location:', error);
        // Use a default location if geolocation fails
        setUserLocation({ lat: 48.856614, lng: 2.3522219 }); // Default to Paris, France
      }
    };

    fetchUserLocation();
  }, []);

  const initializeMap = useCallback(async (mapElement: HTMLElement) => {
    if (!mapElement) {
      console.error("Map element not found");
      return null;
    }
    
    if (!apiKeyLoaded) {
      console.log("API not loaded yet, waiting");
      return null;
    }

    console.log("Initializing map with element:", mapElement);
    setIsLoading(true);
    
    try {
      // Make sure we have a user location
      let location = userLocation;
      if (!location) {
        try {
          location = await getCurrentLocation();
          setUserLocation(location);
        } catch (error) {
          console.error('Error getting location for map:', error);
          // Use default location
          location = { lat: 48.856614, lng: 2.3522219 }; // Paris, France
        }
      }

      console.log("Using location for map:", location);
      const map = initializeGoogleMap(mapElement, location);
      mapRef.current = map;
      console.log("Map initialized successfully");
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
  }, [apiKeyLoaded, toast, userLocation]);

  return {
    map: mapRef.current,
    isLoading,
    userLocation,
    initializeMap,
    apiKeyLoaded
  };
};

// Add global callback type definition
declare global {
  interface Window {
    initGoogleMapsCallback?: () => void;
  }
}
