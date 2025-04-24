
import { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useToast } from "@/components/ui/use-toast";
import { getGoogleMapsApiKey } from '@/services/googleApiService';

export const useGoogleMapsScript = () => {
  const [apiKeyLoaded, setApiKeyLoaded] = useState(false);
  const loaderRef = useRef<Loader | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadGoogleMapsApi = async () => {
      try {
        const apiKey = await getGoogleMapsApiKey();
        if (!apiKey) {
          console.error("No API key returned from getGoogleMapsApiKey");
          toast({
            title: "Erreur",
            description: "Clé API Google Maps non disponible",
            variant: "destructive"
          });
          return;
        }

        // Create a new loader instance
        loaderRef.current = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        // Load the library
        await loaderRef.current.load();
        
        console.log("Google Maps API loaded successfully");
        setApiKeyLoaded(true);
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'API Google Maps",
          variant: "destructive"
        });
      }
    };

    loadGoogleMapsApi();

    return () => {
      // Clean up if needed
      loaderRef.current = null;
    };
  }, [toast]);

  return { apiKeyLoaded };
};
