
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  const { map, isLoading, userLocation, initializeMap, apiKeyLoaded } = useGoogleMap();
  const mapElementRef = useRef<HTMLDivElement>(null);

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
    // Initialize map only after dialog is fully open and DOM is updated
    if (isOpen && apiKeyLoaded) {
      console.log("Dialog open and API key loaded, waiting for DOM update");
      
      // Using a small timeout to ensure the DOM is fully updated
      const timer = setTimeout(() => {
        if (mapElementRef.current) {
          console.log("Map element found, initializing", mapElementRef.current);
          initializeMap(mapElementRef.current);
        } else {
          console.error("Map element still not found after timeout!");
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, apiKeyLoaded, initializeMap]);

  return (
    <>
      <Button 
        onClick={() => {
          console.log("Opening store search dialog");
          setIsOpen(true);
        }} 
        className="w-full"
      >
        <MapPin className="w-4 h-4 mr-2" />
        Rechercher ma boutique CBD
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => {
        console.log("Dialog open state changed to:", open);
        setIsOpen(open);
      }}>
        <DialogContent className="sm:max-w-[800px] h-[600px]">
          <DialogTitle>Recherche de boutique CBD</DialogTitle>
          <DialogDescription className="sr-only">
            Recherchez votre boutique CBD sur la carte
          </DialogDescription>
          
          {(isLoading || !apiKeyLoaded) && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p className="text-sm text-muted-foreground">
                  {!apiKeyLoaded ? "Chargement de l'API Google Maps..." : "Initialisation de la carte..."}
                </p>
              </div>
            </div>
          )}
          
          <div id="store-search-map" ref={mapElementRef} className="w-full h-full rounded-md" />
          
          {map && userLocation && (
            <StoreMarkers 
              map={map}
              userLocation={userLocation}
              onStoreSelect={handleStoreSelect}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoreSearch;
