
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Default location (Paris)
    const defaultLocation = { lat: 48.8566, lng: 2.3522 };

    const handleGeolocationError = (error: GeolocationPositionError) => {
      let errorMessage = "Accès à votre position refusé";
      switch(error.code) {
        case 1: // PERMISSION_DENIED
          errorMessage = "Vous avez bloqué l'accès à la géolocalisation. Veuillez l'autoriser dans les paramètres de votre navigateur.";
          break;
        case 2: // POSITION_UNAVAILABLE
          errorMessage = "Position indisponible actuellement";
          break;
        case 3: // TIMEOUT
          errorMessage = "Délai d'attente dépassé";
          break;
      }
      
      setLocationError(errorMessage);
      setUserLocation(defaultLocation);
      
      toast({
        title: "Accès à la position impossible",
        description: errorMessage,
        variant: "destructive",
        duration: 5000
      });
    };

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            setLocationError(null);
          },
          handleGeolocationError,
          { 
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        setLocationError("La géolocalisation n'est pas supportée par votre navigateur.");
        setUserLocation(defaultLocation);
        
        toast({
          title: "Géolocalisation non supportée",
          description: "Votre navigateur ne supporte pas la géolocalisation. Utilisation de la position par défaut.",
          variant: "default",
        });
      }
    } catch (e) {
      console.error("Unexpected geolocation error:", e);
      setUserLocation(defaultLocation);
      setLocationError("Une erreur inattendue est survenue lors de l'accès à votre position.");
      
      toast({
        title: "Erreur de géolocalisation",
        description: "Impossible de récupérer votre position. Utilisation d'une position par défaut.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return { 
    userLocation: userLocation || { lat: 48.8566, lng: 2.3522 }, 
    locationError 
  };
};
