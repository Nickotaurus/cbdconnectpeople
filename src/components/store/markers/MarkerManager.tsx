
import { useRef, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { renderInfoWindowContent } from '../info-window/InfoWindowRenderer';

interface MarkerManagerProps {
  map: google.maps.Map;
  userLocation: google.maps.LatLngLiteral;
  onStoreSelect: (store: google.maps.places.PlaceResult) => void;
}

const MarkerManager = ({ map, userLocation, onStoreSelect }: MarkerManagerProps) => {
  const { toast } = useToast();
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
    
    const marker = new google.maps.Marker({
      position: place.geometry.location,
      map,
      title: place.name,
      animation: google.maps.Animation.DROP
    });

    marker.addListener('click', () => {
      if (activeInfoWindow.current) {
        activeInfoWindow.current.close();
      }

      service.getDetails(
        { 
          placeId: place.place_id || "", 
          fields: ['name', 'formatted_address', 'rating', 'website', 'photos', 'user_ratings_total', 'geometry'] 
        },
        (placeDetails, detailStatus) => {
          if (detailStatus === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
            const infoWindow = new google.maps.InfoWindow({
              content: renderInfoWindowContent(placeDetails, () => onStoreSelect(placeDetails)),
              ariaLabel: placeDetails.name,
            });

            if (!window.selectStore) {
              window.selectStore = (placeId: string) => {
                if (placeId === place.place_id && placeDetails) {
                  onStoreSelect(placeDetails);
                }
              };
            }

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
