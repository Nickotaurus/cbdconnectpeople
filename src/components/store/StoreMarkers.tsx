
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
        
        console.log("Searching for CBD shops near:", userLocation);
        
        // Utilisons plusieurs termes de recherche pour augmenter les chances de trouver des boutiques
        const searchTerms = [
          { keyword: 'boutique CBD', radius: 50000 },
          { keyword: 'shop CBD', radius: 50000 },
          { keyword: 'magasin CBD', radius: 50000 },
          { keyword: 'CBD', radius: 30000 }
        ];
        
        // Fonction pour effectuer une recherche avec un terme spécifique
        const performSearch = (term: { keyword: string, radius: number }) => {
          const request = {
            location: userLocation,
            radius: term.radius,
            keyword: term.keyword
          };
          
          console.log(`Searching for: ${term.keyword} with radius: ${term.radius}m`);
          
          service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
              console.log(`Found ${results.length} places with keyword: ${term.keyword}`);
              setHasResults(true);
              
              results.forEach(place => {
                if (!place.geometry?.location) return;
                
                // Vérifier si nous avons déjà un marqueur à cette position
                const exists = markersRef.current.some(marker => 
                  marker.getPosition()?.lat() === place.geometry?.location.lat() && 
                  marker.getPosition()?.lng() === place.geometry?.location.lng()
                );
                
                if (exists) return; // Éviter les doublons
                
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

                        // Fix: Define the selectStore function in a way that doesn't conflict with the global declaration
                        if (!window.selectStore) {
                          window.selectStore = (placeId: string) => {
                            console.log("Store selected via info window:", placeId);
                            // Find the right place details and call onStoreSelect
                            if (placeId === place.place_id && placeDetails) {
                              onStoreSelect(placeDetails);
                            }
                          };
                        }

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
              console.warn(`No results for keyword: ${term.keyword}. Status: ${status}`);
            }
            
            setIsSearching(false);
          });
        };
        
        // Effectuer les recherches séquentiellement avec un délai
        let searchCount = 0;
        
        const executeNextSearch = () => {
          if (searchCount < searchTerms.length) {
            performSearch(searchTerms[searchCount]);
            searchCount++;
            
            // Continue with next search term after a delay
            setTimeout(executeNextSearch, 1000);
          } else {
            setIsSearching(false);
            
            // Si aucun résultat n'a été trouvé après toutes les recherches
            if (!hasResults && markersRef.current.length === 0) {
              console.warn("No CBD shops found after all searches");
              toast({
                title: "Aucun résultat",
                description: "Aucune boutique CBD trouvée à proximité. Essayez d'ajouter votre boutique manuellement.",
                variant: "destructive"
              });
            }
          }
        };
        
        // Start the search sequence
        executeNextSearch();
        
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

    return () => {
      // Clear markers on unmount
      clearMarkers();
      
      // Reset the global selectStore function when component unmounts
      window.selectStore = undefined;
    };
  }, [map, userLocation, onStoreSelect, toast, hasResults]);

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
    selectStore?: (placeId: string) => void;
  }
}

export default StoreMarkers;
