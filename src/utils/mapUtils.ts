
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
  return new Promise((resolve, reject) => {
    // Fonction pour utiliser Paris comme position par défaut
    const useParis = (reason: string) => {
      console.warn(`Utilisation de Paris comme position par défaut: ${reason}`);
      resolve({ lat: 48.8566, lng: 2.3522 }); // Paris
    };

    // Vérifier si la géolocalisation est supportée
    if (!navigator.geolocation) {
      useParis("La géolocalisation n'est pas supportée par ce navigateur");
      return;
    }

    // Utiliser un timeout plus court pour éviter d'attendre trop longtemps
    const timeoutId = setTimeout(() => {
      useParis("Délai d'attente dépassé");
    }, 5000); // 5 secondes maximum

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          console.log("Position utilisateur obtenue avec succès:", position.coords);
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
          
          // Toujours résoudre avec Paris, mais signaler l'erreur pour l'interface utilisateur
          useParis(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 4000, // 4 secondes maximum pour la position
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
