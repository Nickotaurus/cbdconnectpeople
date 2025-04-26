
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { getGoogleMapsApiKey } from '@/services/googleApiService';

// Global flag to track script loading
let placesApiLoadStarted = false;

export const useGooglePlacesApi = () => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // If Google Maps is already loaded, just update the state
    if (window.google?.maps?.places) {
      console.log("Google Maps Places API already available");
      setIsApiLoaded(true);
      setIsLoading(false);
      return;
    }
    
    // If the API loading has already been initiated, don't start it again
    if (placesApiLoadStarted) {
      console.log("Places API load already initiated, waiting...");
      
      // Set up a check interval to detect when it's loaded
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          console.log("Places API detected as loaded in check interval");
          setIsApiLoaded(true);
          setIsLoading(false);
          clearInterval(checkInterval);
        }
      }, 500);
      
      return () => clearInterval(checkInterval);
    }

    const loadGoogleMapsApi = async () => {
      try {
        placesApiLoadStarted = true;
        
        const apiKey = await getGoogleMapsApiKey();
        if (!apiKey) {
          toast({
            title: "Erreur",
            description: "Clé API Google Maps non disponible",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        // Check if script already exists to avoid duplicates
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          console.log("Google Maps script already exists, waiting for it to load");
          
          // If the script exists but isn't fully loaded, set up a wait mechanism
          const waitForLoad = setInterval(() => {
            if (window.google?.maps?.places) {
              console.log("Existing Google Maps script loaded successfully");
              clearInterval(waitForLoad);
              setIsApiLoaded(true);
              setIsLoading(false);
            }
          }, 500);
          
          return;
        }

        console.log("Creating new Google Maps script element");
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsCallback`;
        script.async = true;
        script.defer = true;

        window.initGoogleMapsCallback = () => {
          console.log("Google Maps API loaded successfully");
          setIsApiLoaded(true);
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
        setIsLoading(false);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement de l'API Google Maps",
          variant: "destructive"
        });
      }
    };

    loadGoogleMapsApi();

    return () => {
      // We're intentionally NOT removing global callbacks or flags here
      // as they need to persist throughout the application
      if (window.initGoogleMapsCallback) {
        // Just replace it with a no-op to avoid errors if it's called again
        window.initGoogleMapsCallback = () => {
          console.log("Callback called after component unmount - ignored");
        };
      }
    };
  }, [toast]);

  return { isApiLoaded, isLoading };
};
