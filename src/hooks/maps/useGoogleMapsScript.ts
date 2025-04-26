import { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useToast } from "@/components/ui/use-toast";
import { getGoogleMapsApiKey } from '@/services/googleApiService';

// Global variable to track if Google Maps API is loaded
let googleMapsApiLoaded = false;

export const useGoogleMapsScript = () => {
  const [apiKeyLoaded, setApiKeyLoaded] = useState(false);
  const loaderRef = useRef<Loader | null>(null);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If the API is already loaded globally, just set the state
    if (googleMapsApiLoaded || window.google?.maps) {
      console.log("API Google Maps déjà chargée - détectée par useGoogleMapsScript");
      googleMapsApiLoaded = true;
      setApiKeyLoaded(true);
      return;
    }

    const loadGoogleMapsApi = async () => {
      try {
        // Check if script is already loaded
        if (googleMapsApiLoaded) {
          console.log("Google Maps API already loaded globally");
          setApiKeyLoaded(true);
          return;
        }

        console.log("Tentative de récupération de la clé API Google Maps");
        const apiKey = await getGoogleMapsApiKey();
        
        if (!apiKey) {
          console.error("Aucune clé API retournée par getGoogleMapsApiKey");
          setError("Clé API Google Maps non disponible");
          toast({
            title: "Erreur",
            description: "Clé API Google Maps non disponible",
            variant: "destructive"
          });
          return;
        }

        // Create a new loader instance
        console.log("Création du loader Google Maps avec la clé API");
        loaderRef.current = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'marker'] // Added 'marker' for advanced markers
        });

        // Load the library
        await loaderRef.current.load();
        
        // Set global flag
        googleMapsApiLoaded = true;
        console.log("API Google Maps chargée avec succès");
        setApiKeyLoaded(true);
      } catch (error) {
        console.error("Erreur lors du chargement de l'API Google Maps:", error);
        setError("Erreur lors du chargement de l'API Google Maps");
        toast({
          title: "Erreur",
          description: "Impossible de charger l'API Google Maps",
          variant: "destructive"
        });
      }
    };

    loadGoogleMapsApi();

    return () => {
      loaderRef.current = null;
      // Do NOT reset googleMapsApiLoaded here, as we want to keep track of API loaded state globally
    };
  }, [toast]);

  return { apiKeyLoaded, error };
};
