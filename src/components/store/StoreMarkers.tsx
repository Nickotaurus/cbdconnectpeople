
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
  const [hasResults, setHasResults] = useState(false);
  
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

        // Clear existing markers
        clearMarkers();
        setIsSearching(true);
        
        const service = new google.maps.places.PlacesService(map);
        
        // Définir les termes de recherche pour les boutiques CBD
        const searchTerms = [
          { keyword: 'boutique CBD', radius: 50000 },
          { keyword: 'shop CBD', radius: 50000 },
          { keyword: 'CBD store', radius: 50000 },
          { keyword: 'CBD', radius: 30000 }
        ];
        
        // Effectuer une recherche pour chaque terme
        for (const term of searchTerms) {
          const request = {
            location: userLocation,
            radius: term.radius,
            keyword: term.keyword
          };
          
          console.log(`Recherche de: ${term.keyword} dans un rayon de ${term.radius}m`);
          
          try {
            await new Promise((resolve, reject) => {
              service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                  console.log(`Trouvé ${results.length} établissements pour "${term.keyword}"`);
                  setHasResults(true);
                  
                  results.forEach(place => {
                    if (!place.geometry?.location) return;
                    
                    // Vérifier si nous avons déjà un marqueur à cette position
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
                  });
                }
                resolve(true);
              });
            });
            
            // Ajouter un délai entre les recherches pour éviter les limites de l'API
            await new Promise(resolve => setTimeout(resolve, 300));
            
          } catch (error) {
            console.error(`Erreur lors de la recherche pour ${term.keyword}:`, error);
          }
        }
        
      } catch (error) {
        console.error('Error loading markers:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les établissements sur la carte",
          variant: "destructive"
        });
      } finally {
        setIsSearching(false);
      }
    };

    initializeMarkers();

    return () => {
      clearMarkers();
      window.selectStore = undefined;
    };
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

declare global {
  interface Window {
    selectStore?: (placeId: string) => void;
  }
}

export default StoreMarkers;
