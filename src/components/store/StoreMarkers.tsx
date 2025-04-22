
import { useEffect, useRef, useState } from 'react';
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
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    const initializeMarkers = async () => {
      if (!map || !userLocation) {
        console.log("Map or user location not available for markers");
        return;
      }

      try {
        if (!google?.maps?.places) {
          console.error("Google Places API not loaded");
          toast({
            title: "Erreur",
            description: "API Google Places non disponible",
            variant: "destructive"
          });
          return;
        }

        // Add a user marker
        new google.maps.Marker({
          position: userLocation,
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#4F46E5",
            fillOpacity: 1,
            strokeColor: "#312E81",
            strokeWeight: 2,
            scale: 8
          },
          title: "Votre position"
        });

        setIsSearching(true);
        // Utiliser directement l'API Google Places
        const service = new google.maps.places.PlacesService(map);
        
        // Recherche des boutiques CBD à proximité
        const request = {
          location: userLocation,
          radius: 50000, // 50km
          keyword: 'boutique CBD'
        };

        service.nearbySearch(request, (results, status) => {
          setIsSearching(false);
          
          if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            console.log("Found CBD shops:", results.length);
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
                  { placeId: place.place_id || "", fields: ['name', 'formatted_address', 'rating', 'website', 'photos', 'user_ratings_total', 'geometry'] },
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
            console.warn('Nearby search result:', status, results?.length || 0);
            
            if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              toast({
                title: "Aucun résultat",
                description: "Aucune boutique CBD trouvée à proximité",
                variant: "destructive"
              });
            } else if (status !== google.maps.places.PlacesServiceStatus.OK) {
              toast({
                title: "Recherche infructueuse",
                description: `Erreur lors de la recherche: ${status}`,
                variant: "destructive"
              });
            }
          }
        });
      } catch (error) {
        setIsSearching(false);
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

  // Si la recherche est en cours, on affiche rien (le chargement est géré par le parent)
  return null;
};

declare global {
  interface Window {
    selectStore: (placeId: string) => void;
  }
}

export default StoreMarkers;
