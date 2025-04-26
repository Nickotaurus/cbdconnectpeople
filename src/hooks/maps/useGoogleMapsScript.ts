
import { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useToast } from "@/components/ui/use-toast";
import { getGoogleMapsApiKey } from '@/services/googleApiService';

export const useGoogleMapsScript = () => {
  const [apiKeyLoaded, setApiKeyLoaded] = useState(false);
  const loaderRef = useRef<Loader | null>(null);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMapsApi = async () => {
      try {
        // Vérifier si le script existe déjà
        if (window.google?.maps) {
          console.log("API Google Maps déjà chargée");
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

        // Créer une nouvelle instance du loader
        console.log("Création du loader Google Maps avec la clé API");
        loaderRef.current = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'marker'] // Ajout de 'marker' pour les nouveaux marqueurs avancés
        });

        // Charger la bibliothèque
        await loaderRef.current.load();
        
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
    };
  }, [toast]);

  return { apiKeyLoaded, error };
};
