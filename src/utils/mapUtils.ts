
import { toast } from "@/components/ui/use-toast";

export const initializeGoogleMap = (
  mapElement: HTMLElement,
  location: google.maps.LatLngLiteral
): google.maps.Map => {
  try {
    return new google.maps.Map(mapElement, {
      center: location,
      zoom: 13,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapId: 'cbd_store_map'
    });
  } catch (error) {
    console.error("Error initializing Google Map:", error);
    throw error; // Re-throw to let caller handle it
  }
};

export const createUserLocationMarker = (
  map: google.maps.Map,
  position: google.maps.LatLngLiteral
): any => {
  try {
    // Check if Advanced Marker API is available
    if (window.google?.maps?.marker?.PinElement) {
      const pinElement = new google.maps.marker.PinElement({
        background: '#4F46E5',
        borderColor: '#312E81',
        glyphColor: '#FFFFFF',
        scale: 1.1
      });
  
      return new google.maps.marker.AdvancedMarkerElement({
        position,
        map,
        title: "Votre position",
        content: pinElement.element,
        // zIndex property is available on AdvancedMarkerElement
        zIndex: 100
      });
    } else {
      // Fallback to traditional marker if Advanced Marker API is not available
      // Note: zIndex is removed as it's not in the MarkerOptions type
      return new google.maps.Marker({
        position,
        map,
        title: "Votre position",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#4F46E5',
          fillOpacity: 1,
          strokeColor: '#312E81',
          strokeWeight: 2,
          scale: 8
        }
        // zIndex removed here as it's not in the MarkerOptions type
      });
    }
  } catch (error) {
    console.error("Error creating user location marker:", error);
    // Return null instead of throwing, so we can continue execution
    return null;
  }
};

export const createStoreMarker = (
  map: google.maps.Map,
  position: google.maps.LatLngLiteral,
  title: string,
  isSelected: boolean = false,
  isCBDStore: boolean = false
): any => {
  try {
    // Check if Advanced Marker API is available
    if (window.google?.maps?.marker?.PinElement) {
      // Utiliser la couleur sage-500 pour les marqueurs
      const pinElement = new google.maps.marker.PinElement({
        background: isCBDStore ? '#4F46E5' : (isSelected ? '#78ADA2' : '#F59E0B'),
        borderColor: isCBDStore ? '#312E81' : (isSelected ? '#5A8279' : '#D97706'),
        glyphColor: '#FFFFFF',
        scale: isSelected ? 1.2 : 1
      });
    
      return new google.maps.marker.AdvancedMarkerElement({
        position,
        map,
        title: title,
        content: pinElement.element,
        // zIndex property is available on AdvancedMarkerElement
        zIndex: isSelected ? 99 : 1
      });
    } else {
      // Fallback to traditional marker if Advanced Marker API is not available
      // Note: zIndex is removed as it's not in the MarkerOptions type
      return new google.maps.Marker({
        position,
        map,
        title: title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: isCBDStore ? '#4F46E5' : (isSelected ? '#78ADA2' : '#F59E0B'),
          fillOpacity: 1,
          strokeColor: isCBDStore ? '#312E81' : (isSelected ? '#5A8279' : '#D97706'),
          strokeWeight: 2,
          scale: isSelected ? 8 : 6
        }
        // zIndex removed here as it's not in the MarkerOptions type
      });
    }
  } catch (error) {
    console.error("Error creating store marker:", error);
    // Return null instead of throwing, so we can continue execution
    return null;
  }
};

export const getCurrentLocation = (): Promise<google.maps.LatLngLiteral> => {
  return new Promise((resolve, reject) => {
    const useParis = (reason: string) => {
      console.warn(`Utilisation de Paris comme position par défaut: ${reason}`);
      resolve({ lat: 48.8566, lng: 2.3522 });
    };

    if (!navigator.geolocation) {
      useParis("La géolocalisation n'est pas supportée par ce navigateur");
      return;
    }

    const timeoutId = setTimeout(() => {
      useParis("Délai d'attente dépassé");
    }, 5000);

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
          
          useParis(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 4000,
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
