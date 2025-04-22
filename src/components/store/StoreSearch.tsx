
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
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
  const [mapError, setMapError] = useState<string | null>(null);

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
      
      // Using a slightly longer timeout to ensure the DOM is fully updated
      const timer = setTimeout(() => {
        if (mapElementRef.current) {
          console.log("Map element found, initializing", mapElementRef.current);
          try {
            const mapInstance = initializeMap(mapElementRef.current);
            if (!mapInstance) {
              console.error("Map initialization failed");
              setMapError("Impossible d'initialiser la carte. Veuillez réessayer.");
            } else {
              setMapError(null);
            }
          } catch (error) {
            console.error("Error during map initialization:", error);
            setMapError("Erreur lors de l'initialisation de la carte");
          }
        } else {
          console.error("Map element still not found after timeout!");
          setMapError("Élément de carte non trouvé");
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, apiKeyLoaded, initializeMap]);

  return (
    <>
      <Button 
        onClick={() => {
          console.log("Opening store search dialog");
          setMapError(null);
          setIsOpen(true);
        }} 
        className="w-full"
      >
        <MapPin className="w-4 h-4 mr-2" />
        Rechercher ma boutique CBD
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => {
        console.log("Dialog open state changed to:", open);
        if (!open) setMapError(null);
        setIsOpen(open);
      }}>
        <DialogContent className="sm:max-w-[800px] h-[600px] flex flex-col">
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
          
          {mapError ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-center text-destructive font-medium mb-2">{mapError}</p>
              <p className="text-center text-muted-foreground mb-4">Veuillez vous assurer que la géolocalisation est activée et que votre connexion internet est stable.</p>
              <Button 
                onClick={() => {
                  setMapError(null);
                  if (mapElementRef.current && apiKeyLoaded) {
                    initializeMap(mapElementRef.current);
                  }
                }}
              >
                Réessayer
              </Button>
            </div>
          ) : (
            <div id="store-search-map" ref={mapElementRef} className="w-full flex-1 rounded-md" />
          )}
          
          {map && userLocation && !mapError && (
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
