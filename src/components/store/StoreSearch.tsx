import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { MapPin, Store, Loader2, AlertCircle, Search } from "lucide-react";
import { useGoogleMap } from '@/hooks/useGoogleMap';
import StoreMarkers from './StoreMarkers';
import ManualAddressForm from './search/ManualAddressForm';
import SearchResults from './search/SearchResults';
import MapError from './search/MapError';
import { useToast } from "@/components/ui/use-toast";
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
  const [errorType, setErrorType] = useState<string | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [isSearchingPlace, setIsSearchingPlace] = useState(false);
  const [manualSearchResults, setManualSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
  const { toast } = useToast();
  const [mapInitialized, setMapInitialized] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const handleStoreSelect = (placeDetails: google.maps.places.PlaceResult) => {
    if (!placeDetails.formatted_address || !placeDetails.geometry?.location) {
      toast({
        title: "Données incomplètes",
        description: "Les informations de l'établissement sont incomplètes",
        variant: "destructive"
      });
      return;
    }

    try {
      const addressComponents = placeDetails.formatted_address.split(',');
      const city = addressComponents[1]?.trim() || '';
      const postalCode = addressComponents[0]?.match(/\d{5}/)?.[0] || '';
      const placeLocation = placeDetails.geometry.location;

      console.log("Selecting store with details:", {
        name: placeDetails.name,
        address: addressComponents[0]?.trim(),
        city,
        postalCode,
        location: {
          lat: placeLocation.lat(),
          lng: placeLocation.lng()
        },
        placeId: placeDetails.place_id
      });

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
    } catch (error) {
      console.error("Error processing place details:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement des données de l'établissement",
        variant: "destructive"
      });
    }
  };

  const getPlaceDetails = (placeId: string) => {
    if (!apiKeyLoaded || !google?.maps?.places) {
      toast({
        title: "API Google indisponible",
        description: "Impossible d'obtenir les détails de l'établissement.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log("Getting details for place ID:", placeId);
      
      // Create a temporary div for the PlacesService
      const serviceDiv = document.createElement('div');
      const service = new google.maps.places.PlacesService(serviceDiv);
      
      service.getDetails({ 
        placeId, 
        fields: ['name', 'formatted_address', 'place_id', 'geometry', 'website', 'formatted_phone_number', 'opening_hours'] 
      }, (place, status) => {
        console.log("Place details result:", status);
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          console.log("Got place details:", place);
          handleStoreSelect(place);
        } else {
          console.error("Failed to get place details:", status);
          toast({
            title: "Erreur",
            description: "Impossible de récupérer les détails de l'établissement.",
            variant: "destructive"
          });
        }
      });
    } catch (error) {
      console.error("Error getting place details:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération des détails.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (isOpen && apiKeyLoaded && mapElementRef.current && !mapInitialized) {
      console.log("Dialog open and API key loaded, initializing map");
      
      try {
        const mapInstance = initializeMap(mapElementRef.current);
        if (mapInstance) {
          console.log("Map initialized successfully");
          setMapError(null);
          setMapInitialized(true);
          setNoResults(false);
        } else {
          console.error("Map initialization returned null");
          setMapError("Impossible d'initialiser la carte. Veuillez réessayer.");
        }
      } catch (error) {
        console.error("Error during map initialization:", error);
        setMapError("Erreur lors de l'initialisation de la carte");
      }
    }
  }, [isOpen, apiKeyLoaded, initializeMap, mapInitialized]);

  useEffect(() => {
    if (!isOpen) {
      setMapInitialized(false);
    }
  }, [isOpen]);

  const handleManualSearch = async (values: {
    address: string;
    city: string;
    postalCode: string;
  }) => {
    const fullAddress = `${values.address}, ${values.postalCode} ${values.city}, France`;
    setIsSearchingPlace(true);
    setManualSearchResults([]);

    try {
      if (!google?.maps?.places) {
        throw new Error("Google Places API not available");
      }
      
      const serviceDiv = document.createElement('div');
      serviceDiv.style.display = 'none';
      document.body.appendChild(serviceDiv);
      
      const service = new google.maps.places.PlacesService(serviceDiv);

      service.findPlaceFromQuery(
        {
          query: fullAddress,
          fields: ['name', 'formatted_address', 'place_id', 'geometry']
        },
        (results, status) => {
          document.body.removeChild(serviceDiv);
          setIsSearchingPlace(false);
          
          if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            setManualSearchResults(results);
            
            if (results.length === 1) {
              getPlaceDetails(results[0].place_id!);
            }
          } else {
            toast({
              title: "Aucun établissement trouvé",
              description: "Vérifiez l'adresse saisie et réessayez",
              variant: "destructive"
            });
          }
        }
      );
    } catch (error) {
      setIsSearchingPlace(false);
      console.error("Error searching for place:", error);
      toast({
        title: "Erreur de recherche",
        description: "Une erreur est survenue lors de la recherche. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Button 
        onClick={() => {
          setMapError(null);
          setShowManualForm(false);
          setManualSearchResults([]);
          setIsOpen(true);
        }} 
        className="w-full"
      >
        <MapPin className="w-4 h-4 mr-2" />
        Rechercher ma boutique CBD
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          setMapError(null);
          setShowManualForm(false);
          setManualSearchResults([]);
        }
        setIsOpen(open);
      }}>
        <DialogContent className="sm:max-w-[800px] h-[600px] flex flex-col">
          <DialogTitle>Recherche de boutique CBD</DialogTitle>
          <DialogDescription>
            Recherchez votre boutique CBD sur la carte. Si votre boutique n'apparaît pas, vous pourrez l'ajouter manuellement.
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
          
          {showManualForm ? (
            <div className="flex-1 flex flex-col">
              <ManualAddressForm
                onSubmit={handleManualSearch}
                onBack={() => setShowManualForm(false)}
                isSearching={isSearchingPlace}
              />
              <SearchResults
                results={manualSearchResults}
                onSelectPlace={getPlaceDetails}
              />
            </div>
          ) : mapError ? (
            <MapError
              error={mapError}
              errorType={errorType}
              onRetry={() => {
                setMapError(null);
                if (mapElementRef.current && apiKeyLoaded) {
                  initializeMap(mapElementRef.current);
                }
              }}
              onManualAdd={() => setShowManualForm(true)}
            />
          ) : (
            <>
              <div id="store-search-map" ref={mapElementRef} className="w-full flex-1 rounded-md" />
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setShowManualForm(true)} className="w-full sm:w-auto">
                  <Store className="w-4 h-4 mr-2" />
                  Ajouter ma boutique manuellement
                </Button>
              </DialogFooter>
            </>
          )}
          
          {map && userLocation && !mapError && !showManualForm && (
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
