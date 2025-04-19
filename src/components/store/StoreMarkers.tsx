
import { useEffect, useRef } from 'react';
import { searchNearbyStores, getStoreDetails } from '@/services/placesService';
import StoreInfoWindow from './StoreInfoWindow';

interface StoreMarkersProps {
  map: google.maps.Map | null;
  userLocation: google.maps.LatLngLiteral | null;
  onStoreSelect: (store: google.maps.places.PlaceResult) => void;
}

const StoreMarkers = ({ map, userLocation, onStoreSelect }: StoreMarkersProps) => {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const activeInfoWindow = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    const initializeMarkers = async () => {
      if (!map || !userLocation) return;

      const service = new google.maps.places.PlacesService(map);
      try {
        const results = await searchNearbyStores(service, userLocation);
        clearMarkers();

        results.forEach(place => {
          if (!place.geometry?.location) return;

          const marker = new google.maps.Marker({
            position: place.geometry.location,
            map,
            title: place.name,
            animation: google.maps.Animation.DROP
          });

          marker.addListener('click', async () => {
            if (activeInfoWindow.current) {
              activeInfoWindow.current.close();
            }

            try {
              const placeDetails = await getStoreDetails(service, place.place_id as string);
              const infoWindow = new google.maps.InfoWindow({
                content: StoreInfoWindow({ 
                  place: placeDetails, 
                  onSelect: () => onStoreSelect(placeDetails)
                }),
                ariaLabel: place.name,
              });

              window.selectStore = (placeId: string) => {
                if (placeId === place.place_id) {
                  onStoreSelect(placeDetails);
                }
              };

              infoWindow.open(map, marker);
              activeInfoWindow.current = infoWindow;
            } catch (error) {
              console.error('Error fetching place details:', error);
            }
          });

          markersRef.current.push(marker);
        });
      } catch (error) {
        console.error('Error loading markers:', error);
      }
    };

    initializeMarkers();

    return () => clearMarkers();
  }, [map, userLocation, onStoreSelect]);

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  return null;
};

export default StoreMarkers;
