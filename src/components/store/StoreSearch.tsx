
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MapPin, Loader2 } from "lucide-react";

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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchResultsRef = useRef<google.maps.Marker[]>([]);

  const getCurrentLocation = () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
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
          // Default to Paris if geolocation fails
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

      // Create map instance
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

      // Add user location marker
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

      // Search for CBD shops
      const service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: location,
        radius: 5000,
        keyword: 'cbd shop',
      }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // Clear previous markers
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

            marker.addListener('click', () => {
              const addressComponents = place.formatted_address?.split(',') || [];
              const city = addressComponents[1]?.trim() || '';
              const postalCode = addressComponents[0]?.match(/\d{5}/)?.[0] || '';

              onStoreSelect({
                name: place.name || '',
                address: addressComponents[0]?.trim() || '',
                city,
                postalCode,
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng(),
                placeId: place.place_id || ''
              });

              setIsOpen(false);
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
    // Cleanup function
    return () => {
      searchResultsRef.current.forEach(marker => marker.setMap(null));
      searchResultsRef.current = [];
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
