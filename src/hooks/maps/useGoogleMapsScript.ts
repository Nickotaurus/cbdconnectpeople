
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { loadGoogleMapsAPI, isGoogleMapsLoaded } from '@/services/googleMapsService';

export const useGoogleMapsScript = () => {
  const [apiKeyLoaded, setApiKeyLoaded] = useState(isGoogleMapsLoaded());
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // If already loaded, no need to do anything
    if (apiKeyLoaded) {
      console.log("Google Maps API already loaded - detected by useGoogleMapsScript");
      return;
    }

    const initializeGoogleMaps = async () => {
      try {
        console.log("Initializing Google Maps API from useGoogleMapsScript");
        await loadGoogleMapsAPI(['places', 'marker']);
        setApiKeyLoaded(true);
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
        setError("Error loading Google Maps API");
        toast({
          title: "Erreur",
          description: "Impossible de charger l'API Google Maps",
          variant: "destructive"
        });
      }
    };

    initializeGoogleMaps();
  }, [toast]);

  return { apiKeyLoaded, error };
};
