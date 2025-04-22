
import { useEffect, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface StoreMarkersProps {
  map: google.maps.Map | null;
  userLocation: google.maps.LatLngLiteral | null;
  onStoreSelect: (store: google.maps.places.PlaceResult) => void;
}

const StoreMarkers = ({ map, userLocation, onStoreSelect }: StoreMarkersProps) => {
  const { toast } = useToast();
  const markersRef = useRef<google.maps.Marker[]>([]);
  const activeInfoWindow = useRef<google.maps.InfoWindow | null>(null);
  
  useEffect(() => {
    const initializeMarkers = async () => {
      if (!map || !userLocation) return;

      try {
        // Utiliser directement l'API Google Places
        const service = new google.maps.places.PlacesService(map);
        
        // Recherche des boutiques CBD à proximité
        const request = {
          location: userLocation,
          radius: 50000, // 50km
          keyword: 'boutique CBD'
        };

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            clearMarkers();
            
            results.forEach(place => {
              if (!place.geometry?.location) return;

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

                // Récupérer les détails du lieu
                service.getDetails(
                  { placeId: place.place_id || "", fields: ['name', 'formatted_address', 'rating', 'website', 'photos', 'user_ratings_total'] },
                  (placeDetails, detailStatus) => {
                    if (detailStatus === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
                      const infoWindow = new google.maps.InfoWindow({
                        content: renderInfoWindowContent(placeDetails, () => onStoreSelect(placeDetails)),
                        ariaLabel: placeDetails.name,
                      });

                      window.selectStore = (placeId: string) => {
                        if (placeId === place.place_id) {
                          onStoreSelect(placeDetails);
                        }
                      };

                      infoWindow.open(map, marker);
                      activeInfoWindow.current = infoWindow;
                    } else {
                      console.error('Error fetching place details:', detailStatus);
                      toast({
                        title: "Erreur",
                        description: "Impossible de récupérer les détails de cette boutique",
                        variant: "destructive"
                      });
                    }
                  }
                );
              });

              markersRef.current.push(marker);
            });
          } else {
            console.error('Nearby search error:', status);
            toast({
              title: "Recherche infructueuse",
              description: "Aucune boutique CBD trouvée à proximité",
              variant: "destructive"
            });
          }
        });
      } catch (error) {
        console.error('Error loading markers:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les établissements sur la carte",
          variant: "destructive"
        });
      }
    };

    initializeMarkers();

    return () => clearMarkers();
  }, [map, userLocation, onStoreSelect, toast]);

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };
  
  const renderInfoWindowContent = (place: google.maps.places.PlaceResult, onSelect: () => void) => {
    return `
      <div class="store-info-window">
        <h3 class="store-name">${place.name || 'Boutique CBD'}</h3>
        ${place.rating ? `
          <div class="store-rating">
            <span class="rating-value">${place.rating.toFixed(1)}</span>
            <span class="rating-stars">★</span>
            ${place.user_ratings_total ? `
              <span class="rating-count">(${place.user_ratings_total} avis)</span>
            ` : ''}
          </div>
        ` : ''}
        ${place.formatted_address ? `<p class="store-address">${place.formatted_address}</p>` : ''}
        <button class="select-store-btn" onclick="window.selectStore('${place.place_id}')">
          Sélectionner cette boutique
        </button>
      </div>
    `;
  };

  return null;
};

export default StoreMarkers;
