
import { useState, useEffect } from 'react';
import { getCurrentLocation } from '@/utils/mapUtils';
import { useToast } from "@/components/ui/use-toast";

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserLocation = async () => {
      setIsLoading(true);
      try {
        console.log("Tentative de récupération de la position...");
        const location = await getCurrentLocation();
        console.log("Position obtenue:", location);
        setUserLocation(location);
      } catch (error) {
        console.error('Erreur critique lors de la récupération de la position:', error);
        // Dans le cas improbable où getCurrentLocation échoue, utiliser Paris
        setUserLocation({ lat: 48.856614, lng: 2.3522219 });
        toast({
          title: "Erreur de localisation",
          description: "Impossible de déterminer votre position. Paris est utilisé par défaut.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserLocation();
  }, [toast]);

  return { userLocation, isLoading };
};
