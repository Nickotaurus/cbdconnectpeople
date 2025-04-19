import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Loader2, Star } from "lucide-react";
import './StoreSearch.css';

interface StoreSearchProps {
  onStoreSelect: (store: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    placeId: string;
  }) => void;
}

const StoreSearch = ({ onStoreSelect }: StoreSearchProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchResultsRef = useRef<google.maps.Marker[]>([]);
  const activeInfoWindow = useRef<google.maps.InfoWindow | null>(null);

  const getCurrentLocation = () => {
    return new Promise<google.maps.LatLngLiteral>((resolve, reject) => {
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
          resolve({ lat: 48.8566, lng: 2.3522 });
        }
      );
    });
  };

  const initializeMap = async () => {
    if (!window.google?.maps) {
      toast({
        title: "Erreur",
        description: "Le service Google Maps n'est pas disponible",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);

      const mapElement = document.getElementById('store-search-map');
      if (!mapElement) return;

      const map = new google.maps.Map(mapElement, {
        center: location,
        zoom: 13,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false
      });
      mapRef.current = map;

      new google.maps.Marker({
        position: location,
        map: map,
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

      const service = new google.maps.places.PlacesService(map);
      const request: google.maps.places.PlaceSearchRequest = {
        location: location,
        radius: 5000,
        keyword: 'cbd shop',
      };
      
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          searchResultsRef.current.forEach(marker => marker.setMap(null));
          searchResultsRef.current = [];

          results.forEach(place => {
            if (!place.geometry?.location) return;

            const marker = new google.maps.Marker({
              position: place.geometry.location,
              map: map,
              title: place.name,
              animation: google.maps.Animation.DROP
            });

            const infoWindowContent = `
              <div class="store-info-window">
                <h3 class="store-name">${place.name}</h3>
                ${place.rating ? `
                  <div class="store-rating">
                    <span class="rating-value">${place.rating.toFixed(1)}</span>
                    <span class="rating-stars">★</span>
                    ${place.user_ratings_total ? `
                      <span class="rating-count">(${place.user_ratings_total} avis)</span>
                    ` : ''}
                  </div>
                ` : ''}
                ${place.vicinity ? `<p class="store-address">${place.vicinity}</p>` : ''}
                <button class="select-store-btn" onclick="window.selectStore('${place.place_id}')">
                  Sélectionner cette boutique
                </button>
              </div>
            `;

            const infoWindow = new google.maps.InfoWindow({
              content: infoWindowContent,
              ariaLabel: place.name,
            });

            marker.addListener('click', () => {
              if (activeInfoWindow.current) {
                activeInfoWindow.current.close();
              }
              
              service.getDetails(
                {
                  placeId: place.place_id,
                  fields: ['name', 'formatted_address', 'geometry', 'rating', 'user_ratings_total']
                },
                (placeDetails, detailStatus) => {
                  if (detailStatus === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
                    const addressComponents = placeDetails.formatted_address?.split(',') || [];
                    const city = addressComponents[1]?.trim() || '';
                    const postalCode = addressComponents[0]?.match(/\d{5}/)?.[0] || '';
                    const placeLocation = placeDetails.geometry!.location;

                    window.selectStore = (placeId: string) => {
                      if (placeId === place.place_id) {
                        onStoreSelect({
                          name: placeDetails.name || '',
                          address: addressComponents[0]?.trim() || '',
                          city,
                          postalCode,
                          latitude: placeLocation.lat(),
                          longitude: placeLocation.lng(),
                          placeId: place.place_id
                        });
                        setIsOpen(false);
                      }
                    };

                    infoWindow.open(map, marker);
                    activeInfoWindow.current = infoWindow;
                  }
                }
              );
            });

            searchResultsRef.current.push(marker);
          });
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser la carte",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      initializeMap();
    }
    return () => {
      if (searchResultsRef.current) {
        searchResultsRef.current.forEach(marker => marker.setMap(null));
        searchResultsRef.current = [];
      }
    };
  }, [isOpen]);

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="w-full"
      >
        <MapPin className="w-4 h-4 mr-2" />
        Rechercher ma boutique CBD
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px] h-[600px]">
          <DialogTitle className="sr-only">Recherche de boutique CBD</DialogTitle>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          <div id="store-search-map" className="w-full h-full rounded-md" />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoreSearch;
