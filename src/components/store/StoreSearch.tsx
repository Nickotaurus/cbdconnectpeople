
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Loader2 } from "lucide-react";
import { useGoogleMap } from '@/hooks/useGoogleMap';
import StoreMarkers from './StoreMarkers';
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
  const [isOpen, setIsOpen] = useState(false);
  const { map, isLoading, userLocation, initializeMap } = useGoogleMap();

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
      const mapElement = document.getElementById('store-search-map');
      initializeMap(mapElement);
    }
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
          <StoreMarkers 
            map={map}
            userLocation={userLocation}
            onStoreSelect={handleStoreSelect}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoreSearch;
