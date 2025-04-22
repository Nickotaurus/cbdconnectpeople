
import { toast } from "@/components/ui/use-toast";

export const initializeGoogleMap = (
  mapElement: HTMLElement,
  location: google.maps.LatLngLiteral
): google.maps.Map => {
  return new google.maps.Map(mapElement, {
    center: location,
    zoom: 13,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false
  });
};

export const createUserLocationMarker = (
  map: google.maps.Map,
  position: google.maps.LatLngLiteral
): google.maps.Marker => {
  return new google.maps.Marker({
    position,
    map,
    title: "Votre position",
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#4F46E5",
      fillOpacity: 1,
      strokeColor: "#312E81",
      strokeWeight: 2,
      scale: 8
    }
  });
};

export const getCurrentLocation = (): Promise<google.maps.LatLngLiteral> => {
  return new Promise((resolve) => {
    // Fonction pour utiliser Paris comme position par défaut
    const useParis = (reason: string) => {
      console.warn(`Utilisation de Paris comme position par défaut: ${reason}`);
      toast({
        title: "Localisation non disponible",
        description: "Utilisation de Paris comme position par défaut. Vérifiez vos paramètres de confidentialité.",
        variant: "default"
      });
      resolve({ lat: 48.8566, lng: 2.3522 }); // Paris
    };

    // Vérifier si la géolocalisation est supportée
    if (!navigator.geolocation) {
      useParis("La géolocalisation n'est pas supportée par ce navigateur");
      return;
    }

    // Utiliser un timeout pour éviter d'attendre indéfiniment
    const timeoutId = setTimeout(() => {
      useParis("Délai d'attente dépassé");
    }, 10000); // 10 secondes maximum

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          console.log("Position utilisateur obtenue:", position.coords);
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          clearTimeout(timeoutId);
          console.warn("Erreur de géolocalisation:", error.message || error.code);
          
          let errorMessage = "Accès à la position refusé";
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
          
          toast({
            title: "Position non disponible",
            description: `${errorMessage}. Paris est utilisé comme position par défaut.`,
            variant: "default"
          });
          
          resolve({ lat: 48.8566, lng: 2.3522 }); // Paris par défaut
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0
        }
      );
    } catch (e) {
      clearTimeout(timeoutId);
      console.error("Erreur inattendue lors de la géolocalisation:", e);
      useParis("Erreur inattendue");
    }
  });
};
