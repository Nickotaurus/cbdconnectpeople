import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { MapPin, Loader2, AlertCircle, Search, Store } from "lucide-react";
import { useGoogleMap } from '@/hooks/useGoogleMap';
import StoreMarkers from './StoreMarkers';
import './StoreSearch.css';
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";

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

// Form schema for manual address entry
const manualAddressSchema = z.object({
  address: z.string().min(5, "L'adresse est requise (min. 5 caractères)"),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().min(5, "Code postal requis"),
});

type ManualAddressFormValues = z.infer<typeof manualAddressSchema>;

const StoreSearch = ({ onStoreSelect }: StoreSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { map, isLoading, userLocation, initializeMap, apiKeyLoaded } = useGoogleMap();
  const mapElementRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [showManualForm, setShowManualForm] = useState(false);
  const [isSearchingPlace, setIsSearchingPlace] = useState(false);
  const [manualSearchResults, setManualSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
  const { toast } = useToast();
  const [mapInitialized, setMapInitialized] = useState(false);

  const form = useForm<ManualAddressFormValues>({
    resolver: zodResolver(manualAddressSchema),
    defaultValues: {
      address: "",
      city: "",
      postalCode: "",
    },
  });

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

  // Vérifier la disponibilité de la localisation
  useEffect(() => {
    if (userLocation) {
      setLocationStatus('success');
    } else if (!isLoading && !userLocation) {
      setLocationStatus('error');
    }
  }, [userLocation, isLoading]);

  // Initialiser la carte
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

  // Reset map initialization state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setMapInitialized(false);
    }
  }, [isOpen]);

  // Handle manual search
  const handleManualSearch = async (values: ManualAddressFormValues) => {
    if (!apiKeyLoaded) {
      toast({
        title: "API Google indisponible",
        description: "Impossible d'effectuer la recherche. Veuillez réessayer ultérieurement.",
        variant: "destructive"
      });
      return;
    }

    const fullAddress = `${values.address}, ${values.postalCode} ${values.city}, France`;
    setIsSearchingPlace(true);
    setManualSearchResults([]);

    try {
      if (!google?.maps?.places) {
        throw new Error("Google Places API not available");
      }
      
      // Create a temporary div for the PlacesService
      const serviceDiv = document.createElement('div');
      const service = new google.maps.places.PlacesService(serviceDiv);

      console.log("Searching for address:", fullAddress);
      
      // First try using textSearch which works better for addresses
      service.textSearch({
        query: fullAddress,
      }, (results, status) => {
        console.log("Text search result:", status, results?.length || 0);
        
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          setManualSearchResults(results);
          
          // If only one result, fetch more details
          if (results.length === 1) {
            getPlaceDetails(results[0].place_id!);
          }
        } else {
          // Fallback to findPlaceFromQuery
          service.findPlaceFromQuery({
            query: fullAddress,
            fields: ['name', 'formatted_address', 'place_id', 'geometry']
          }, (queryResults, queryStatus) => {
            console.log("Find place query result:", queryStatus, queryResults?.length || 0);
            
            setIsSearchingPlace(false);
            
            if (queryStatus === google.maps.places.PlacesServiceStatus.OK && queryResults && queryResults.length > 0) {
              setManualSearchResults(queryResults);
              
              // If only one result, fetch more details
              if (queryResults.length === 1) {
                getPlaceDetails(queryResults[0].place_id!);
              }
            } else {
              toast({
                title: "Aucun établissement trouvé",
                description: "Nous n'avons pas trouvé d'établissement correspondant à cette adresse. Veuillez vérifier l'adresse saisie.",
                variant: "destructive"
              });
            }
          });
        }
      });
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

  // Get detailed information about a place
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

  // Fonction pour ajouter manuellement une boutique
  const handleManualAdd = () => {
    setShowManualForm(true);
  };

  return (
    <>
      <Button 
        onClick={() => {
          console.log("Opening store search dialog");
          setMapError(null);
          setNoResults(false);
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
        console.log("Dialog open state changed to:", open);
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
            {locationStatus === 'success' && userLocation && (
              <span className="block text-green-600 mt-1">
                Votre position actuelle: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
              </span>
            )}
            {locationStatus === 'error' && (
              <span className="block text-amber-600 mt-1">
                Position approximative utilisée (Paris). Pour de meilleurs résultats, autorisez la géolocalisation.
              </span>
            )}
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
              <div className="p-4 mb-4 bg-slate-50 rounded-md">
                <h3 className="font-medium mb-2">Ajout manuel de boutique</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Veuillez saisir l'adresse complète de votre boutique pour que nous puissions la trouver.
                </p>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleManualSearch)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse complète</FormLabel>
                          <FormControl>
                            <Input placeholder="123 rue de la Paix" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code postal</FormLabel>
                            <FormControl>
                              <Input placeholder="75001" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ville</FormLabel>
                            <FormControl>
                              <Input placeholder="Paris" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowManualForm(false)}
                      >
                        Retour
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSearchingPlace}
                      >
                        {isSearchingPlace ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Recherche...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Rechercher l'établissement
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
              
              {/* Display search results */}
              {manualSearchResults.length > 0 && (
                <div className="flex-1 overflow-y-auto">
                  <h3 className="font-medium mb-2">Résultats de recherche</h3>
                  <div className="space-y-2">
                    {manualSearchResults.map((place) => (
                      <div 
                        key={place.place_id} 
                        className="p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
                        onClick={() => getPlaceDetails(place.place_id!)}
                      >
                        <p className="font-medium">{place.name || "Établissement"}</p>
                        <p className="text-sm text-muted-foreground">{place.formatted_address}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : mapError ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-center text-destructive font-medium mb-2">{mapError}</p>
              <p className="text-center text-muted-foreground mb-4">
                {mapError.includes("domaine") 
                  ? "L'URL du site n'est pas autorisée à utiliser cette clé API Google Maps. L'administrateur du site doit ajouter ce domaine aux domaines autorisés dans les paramètres de la clé API."
                  : "Veuillez vous assurer que la géolocalisation est activée et que votre connexion internet est stable."
                }
              </p>
              <div className="flex gap-2">
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
                <Button variant="outline" onClick={handleManualAdd}>
                  <Store className="w-4 h-4 mr-2" />
                  Ajouter manuellement
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div id="store-search-map" ref={mapElementRef} className="w-full flex-1 rounded-md" />
              {noResults && (
                <div className="p-4 bg-amber-50 text-amber-800 rounded-md mt-4">
                  <p className="font-medium flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" /> 
                    Aucune boutique CBD trouvée à proximité
                  </p>
                </div>
              )}
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={handleManualAdd} className="w-full sm:w-auto">
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
