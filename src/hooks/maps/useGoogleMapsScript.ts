
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { getGoogleMapsApiKey } from '@/services/googleApiService';

export const useGoogleMapsScript = () => {
  const [apiKeyLoaded, setApiKeyLoaded] = useState(false);
  const scriptLoadingRef = useRef(false);
  const apiLoadAttemptsRef = useRef(0);
  const { toast } = useToast();

  useEffect(() => {
    const loadGoogleMapsApi = async () => {
      if (window.google?.maps?.Map && window.google.maps.places?.PlacesService) {
        console.log("Google Maps API already loaded with Map and Places");
        setApiKeyLoaded(true);
        return;
      }
      
      if (window.google?.maps) {
        console.log("Google Maps API partially loaded, checking for full functionality");
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
      apiLoadAttemptsRef.current++;
      
      try {
        console.log(`Fetching Google Maps API key... (attempt ${apiLoadAttemptsRef.current})`);
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

        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          existingScript.remove();
          console.log("Removed existing Google Maps script");
        }

        const script = document.createElement('script');
        const currentUrl = window.location.origin;
        console.log("Current URL for Maps API authorization:", currentUrl);
        
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsCallback`;
        script.async = true;
        script.defer = true;
        
        window.initGoogleMapsCallback = () => {
          console.log("Google Maps API loaded successfully via callback");
          setApiKeyLoaded(true);
          scriptLoadingRef.current = false;
        };
        
        script.onerror = (e) => {
          console.error("Failed to load Google Maps API:", e);
          
          if (apiLoadAttemptsRef.current < 3) {
            console.log(`Will retry loading API in 2 seconds (attempt ${apiLoadAttemptsRef.current}/3)`);
            setTimeout(() => {
              scriptLoadingRef.current = false;
              loadGoogleMapsApi();
            }, 2000);
          } else {
            toast({
              title: "Erreur",
              description: "Impossible de charger l'API Google Maps après plusieurs tentatives",
              variant: "destructive"
            });
            scriptLoadingRef.current = false;
          }
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
    
    return () => {
      if (window.initGoogleMapsCallback) {
        delete window.initGoogleMapsCallback;
      }
    };
  }, [toast]);

  return { apiKeyLoaded };
};
