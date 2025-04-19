
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
      reject(new Error("La géolocalisation n'est pas supportée par votre navigateur"));
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
        console.error("Erreur de géolocalisation:", error);
        resolve({ lat: 48.8566, lng: 2.3522 }); // Paris as fallback
      }
    );
  });
};

