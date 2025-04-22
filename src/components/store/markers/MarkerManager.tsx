
import { useRef, useState } from 'react';
import { renderInfoWindowContent } from '../info-window/InfoWindowRenderer';

interface MarkerManagerProps {
  map: google.maps.Map;
  userLocation: google.maps.LatLngLiteral;
  onStoreSelect: (store: google.maps.places.PlaceResult) => void;
  toast: any; // Accept toast as a prop instead of using the hook
}

const MarkerManager = ({ map, userLocation, onStoreSelect, toast }: MarkerManagerProps) => {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const activeInfoWindow = useRef<google.maps.InfoWindow | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  const addMarker = (
    place: google.maps.places.PlaceResult,
    service: google.maps.places.PlacesService
  ) => {
    if (!place.geometry?.location) return;
    
    const exists = markersRef.current.some(marker => 
      marker.getPosition()?.lat() === place.geometry?.location.lat() && 
      marker.getPosition()?.lng() === place.geometry?.location.lng()
    );
    
    if (exists) return;
    
    // Check if the place name contains CBD-related terms to customize marker
    const lowerName = (place.name || '').toLowerCase();
    const isCbdStore = lowerName.includes('cbd') || 
                      lowerName.includes('chanvre') || 
                      lowerName.includes('cannabis');
    
    // Use a custom marker for CBD stores
    const markerOptions: google.maps.MarkerOptions = {
      position: place.geometry.location,
      map,
      title: place.name,
      animation: google.maps.Animation.DROP
    };
    
    // Add a custom icon for CBD stores to make them stand out
    if (isCbdStore) {
      markerOptions.icon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#4F46E5',
        fillOpacity: 1,
        strokeColor: '#312E81',
        strokeWeight: 2,
        scale: 8
      };
    }
    
    const marker = new google.maps.Marker(markerOptions);

    marker.addListener('click', () => {
      if (activeInfoWindow.current) {
        activeInfoWindow.current.close();
      }

      service.getDetails(
        { 
          placeId: place.place_id || "", 
          fields: ['name', 'formatted_address', 'rating', 'website', 'photos', 'user_ratings_total', 'geometry', 'types', 'vicinity'] 
        },
        (placeDetails, detailStatus) => {
          if (detailStatus === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
            const infoWindow = new google.maps.InfoWindow({
              content: renderInfoWindowContent(placeDetails, () => onStoreSelect(placeDetails)),
              ariaLabel: placeDetails.name,
            });

            // Définir la fonction globale de sélection
            window.selectStore = (placeId: string) => {
              console.log(`Sélection du magasin: ${placeId}`);
              if (placeId === placeDetails.place_id) {
                console.log("Boutique sélectionnée:", placeDetails.name);
                onStoreSelect(placeDetails);
                // Fermer la fenêtre d'info après sélection
                infoWindow.close();
                // Notification de succès
                toast({
                  title: "Boutique sélectionnée",
                  description: `Vous avez sélectionné: ${placeDetails.name}`,
                });
              }
            };

            infoWindow.open(map, marker);
            activeInfoWindow.current = infoWindow;
          }
        }
      );
    });

    markersRef.current.push(marker);
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  return { addMarker, clearMarkers, isSearching, setIsSearching, hasResults, setHasResults };
};

export default MarkerManager;
