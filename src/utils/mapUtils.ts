
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
    if (!navigator.geolocation) {
      console.warn("Géolocalisation non supportée, utilisation de Paris par défaut");
      resolve({ lat: 48.8566, lng: 2.3522 }); // Paris par défaut
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.warn("Erreur de géolocalisation:", error);
        
        toast({
          title: "Position non autorisée",
          description: "Utilisation de Paris comme position par défaut",
          variant: "default"
        });
        
        resolve({ lat: 48.8566, lng: 2.3522 }); // Paris par défaut
      }
    );
  });
};
