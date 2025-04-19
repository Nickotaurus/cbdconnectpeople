import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Loader2 } from "lucide-react";
import { initializeGoogleMap, createUserLocationMarker, getCurrentLocation } from '@/utils/mapUtils';
import { searchNearbyStores, getStoreDetails } from '@/services/placesService';
import StoreInfoWindow from './StoreInfoWindow';
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

      const map = initializeGoogleMap(mapElement, location);
      mapRef.current = map;

      createUserLocationMarker(map, location);

      const service = new google.maps.places.PlacesService(map);
      const results = await searchNearbyStores(service, location);

      searchResultsRef.current.forEach(marker => marker.setMap(null));
      searchResultsRef.current = [];

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
                onSelect: () => handleStoreSelect(placeDetails) 
              }),
              ariaLabel: place.name,
            });

            window.selectStore = (placeId: string) => {
              if (placeId === place.place_id) {
                handleStoreSelect(placeDetails);
              }
            };

            infoWindow.open(map, marker);
            activeInfoWindow.current = infoWindow;
          } catch (error) {
            console.error('Error fetching place details:', error);
          }
        });

        searchResultsRef.current.push(marker);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser la carte",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoreSelect = (placeDetails: google.maps.places.PlaceResult) => {
    if (!placeDetails.formatted_address || !placeDetails.geometry?.location) return;

    const addressComponents = placeDetails.formatted_address.split(',');
    const city = addressComponents[1]?.trim() || '';
    const postalCode = addressComponents[0]?.match(/\d{5}/)?.[0] || '';
    const placeLocation = placeDetails.geometry.location;

    onStoreSelect({
      name: placeDetails.name || '',
      address: addressComponents[0]?.trim() || '',
      city,
      postalCode,
      latitude: placeLocation.lat(),
      longitude: placeLocation.lng(),
      placeId: placeDetails.place_id as string
    });
    setIsOpen(false);
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
