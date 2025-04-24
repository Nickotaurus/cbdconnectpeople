
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Default location (Paris)
    const defaultLocation = { lat: 48.8566, lng: 2.3522 };

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            setLocationError(null);
          },
          (error) => {
            console.error("Error getting geolocation:", error);
            
            let errorMessage = "Accès à votre position refusé";
            switch(error.code) {
              case 1:
                errorMessage = "Vous avez refusé l'accès à votre position";
                break;
              case 2:
                errorMessage = "Position indisponible actuellement";
                break;
              case 3:
                errorMessage = "Délai d'attente dépassé";
                break;
            }
            
            setLocationError(errorMessage);
            setUserLocation(defaultLocation);
            
            toast({
              title: "Accès à la position impossible",
              description: "Nous utilisons une position approximative. Pour une meilleure expérience, autorisez la géolocalisation.",
              variant: "default",
            });
          },
          { 
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        setLocationError("La géolocalisation n'est pas supportée par votre navigateur.");
        setUserLocation(defaultLocation);
      }
    } catch (e) {
      console.error("Unexpected geolocation error:", e);
      setUserLocation(defaultLocation);
      setLocationError("Une erreur inattendue est survenue lors de l'accès à votre position.");
    }
  }, [toast]);

  return { 
    userLocation: userLocation || { lat: 48.8566, lng: 2.3522 }, 
    locationError 
  };
};
