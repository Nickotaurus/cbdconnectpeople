
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { getGoogleMapsApiKey } from '@/services/googleApiService';

export const useGooglePlacesApi = () => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadGoogleMapsApi = async () => {
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

        if (document.querySelector('script[src*="maps.googleapis.com"]')) {
          console.log("Google Maps script already exists");
          return;
        }

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
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement de l'API Google Maps",
          variant: "destructive"
        });
      }
    };

    loadGoogleMapsApi();

    return () => {
      if (window.initGoogleMapsCallback) {
        delete window.initGoogleMapsCallback;
      }
    };
  }, [toast]);

  return { isApiLoaded, isLoading };
};
