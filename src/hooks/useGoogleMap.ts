
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
  const initializationAttemptsRef = useRef(0);

  // Load the Google Maps API script
  useEffect(() => {
    const loadGoogleMapsApi = async () => {
      // If Google Maps API is already loaded or currently loading
      if (window.google?.maps?.Map) {
        console.log("Google Maps API already loaded with Map constructor");
        setApiKeyLoaded(true);
        return;
      }
      
      if (window.google?.maps) {
        console.log("Google Maps API partially loaded, checking for full functionality");
        // Check if the Maps object is fully loaded with all required functionality
        if (window.google.maps.places?.PlacesService) {
          console.log("Places API is available");
          setApiKeyLoaded(true);
          return;
        }
      }
      
      if (scriptLoadingRef.current) {
        console.log("Script is already being loaded");
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

        // Remove any existing script to prevent duplicate loading
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          existingScript.remove();
          console.log("Removed existing Google Maps script");
        }

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
        console.log("User location obtained:", location);
        setUserLocation(location);
      } catch (error) {
        console.error('Error getting location:', error);
        // Use a default location if geolocation fails
        console.log("Using default location (Paris)");
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
    
    if (!window.google?.maps?.Map) {
      console.error("Google Maps API not fully loaded");
      // Increment attempts counter
      initializationAttemptsRef.current += 1;
      
      // If we've tried too many times, show error
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
      // Make sure we have a user location
      let location = userLocation;
      if (!location) {
        try {
          location = await getCurrentLocation();
          console.log("Got user location for map:", location);
          setUserLocation(location);
        } catch (error) {
          console.error('Error getting location for map:', error);
          // Use default location
          location = { lat: 48.856614, lng: 2.3522219 }; // Paris, France
          console.log("Using default location for map:", location);
        }
      }

      console.log("Using location for map:", location);
      const map = initializeGoogleMap(mapElement, location);
      mapRef.current = map;
      console.log("Map initialized successfully");
      // Reset attempts counter on success
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
