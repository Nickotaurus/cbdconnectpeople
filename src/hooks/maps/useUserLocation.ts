
import { useState, useEffect } from 'react';
import { getCurrentLocation } from '@/utils/mapUtils';
import { useToast } from "@/components/ui/use-toast";

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserLocation = async () => {
      setIsLoading(true);
      try {
        console.log("Tentative de récupération de la position...");
        const location = await getCurrentLocation();
        console.log("Position obtenue:", location);
        setUserLocation(location);
        setError(null);
      } catch (error: any) {
        console.error('Erreur critique lors de la récupération de la position:', error);
        setError(error.message || 'Erreur de géolocalisation');
        
        // Toujours utiliser Paris comme position par défaut en cas d'erreur
        const parisLocation = { lat: 48.856614, lng: 2.3522219 };
        setUserLocation(parisLocation);
        
        toast({
          title: "Localisation non disponible",
          description: "Position par défaut utilisée (Paris). Vérifiez vos paramètres de confidentialité.",
          variant: "default"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserLocation();
  }, [toast]);

  return { 
    userLocation, 
    isLoading,
    error 
  };
};
