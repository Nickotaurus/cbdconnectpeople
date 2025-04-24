
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useGoogleMap } from '@/hooks/useGoogleMap';
import StoreMarkers from './StoreMarkers';
import ManualAddressForm from './search/ManualAddressForm';
import SearchResults from './search/SearchResults';
import StoreSearchBar from './search/StoreSearchBar';
import DialogWrapper from './search/DialogWrapper';
import GoogleBusinessIntegration from './search/GoogleBusinessIntegration';
import { useGooglePlacesApi } from '@/hooks/store/useGooglePlacesApi';
import { useStoreSearch } from '@/hooks/store/useStoreSearch';
import { findBusinessByPlaceId } from '@/services/googleBusinessService';
import './StoreSearch.css';
import { useToast } from "@/components/ui/use-toast";
import { getGoogleMapsApiKey } from '@/services/googleApiService';

interface StoreSearchProps {
  onStoreSelect: (store: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    placeId: string;
    photos?: string[];
    phone?: string;
    website?: string;
    rating?: number;
    totalReviews?: number;
  }) => void;
  isRegistration?: boolean;
}

const SUGGESTION_TERMS = [
  "CBD", "Chanvre", "Cannabis légal", "Herboristerie", "Bien-être"
];

const StoreSearch = ({ onStoreSelect, isRegistration = false }: StoreSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { map, isLoading, userLocation, initializeMap } = useGoogleMap();
  const { isApiLoaded } = useGooglePlacesApi();
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualSearchResults, setManualSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
  const [foundBusinessProfile, setFoundBusinessProfile] = useState<{
    name: string;
    address: string;
    phone?: string;
    website?: string;
    rating?: number;
    totalReviews?: number;
    photos?: string[];
    placeId: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoadingBusinessProfile, setIsLoadingBusinessProfile] = useState(false);
  const { toast } = useToast();

  const {
    isSearching,
    setIsSearching,
    noResults,
    setNoResults,
    searchQuery,
    setSearchQuery,
    handleSearch
  } = useStoreSearch({ onStoreSelect });

  const handleStoreSelect = async (placeDetails: google.maps.places.PlaceResult) => {
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
      const postalCodeMatch = placeDetails.formatted_address.match(/\b\d{5}\b/);
      const postalCode = postalCodeMatch ? postalCodeMatch[0] : '';
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

      // Si c'est pour l'inscription, on cherche les détails business
      if (isRegistration && placeDetails.place_id) {
        setIsLoadingBusinessProfile(true);
        const businessDetails = await findBusinessByPlaceId(placeDetails.place_id);
        setIsLoadingBusinessProfile(false);
        
        if (businessDetails) {
          console.log("Found business details:", businessDetails);
          setFoundBusinessProfile(businessDetails);
          return; // Attendre l'acceptation de l'utilisateur
        } else {
          console.log("No business details found, continuing with basic info");
        }
      }

      // Procéder avec les informations disponibles
      onStoreSelect({
        name: placeDetails.name || '',
        address: addressComponents[0]?.trim() || '',
        city,
        postalCode,
        latitude: placeLocation.lat(),
        longitude: placeLocation.lng(),
        placeId: placeDetails.place_id || ''
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

  const handleAcceptBusinessProfile = () => {
    if (!foundBusinessProfile) return;
    
    // Extraire les informations de l'adresse
    const addressComponents = foundBusinessProfile.address.split(',');
    const city = addressComponents[1]?.trim() || '';
    const postalCodeMatch = foundBusinessProfile.address.match(/\b\d{5}\b/);
    const postalCode = postalCodeMatch ? postalCodeMatch[0] : '';
    
    onStoreSelect({
      name: foundBusinessProfile.name,
      address: addressComponents[0]?.trim() || '',
      city,
      postalCode,
      latitude: foundBusinessProfile.latitude,
      longitude: foundBusinessProfile.longitude,
      placeId: foundBusinessProfile.placeId,
      photos: foundBusinessProfile.photos,
      phone: foundBusinessProfile.phone,
      website: foundBusinessProfile.website,
      rating: foundBusinessProfile.rating,
      totalReviews: foundBusinessProfile.totalReviews
    });
    setIsOpen(false);
    setFoundBusinessProfile(null);
  };

  const handleRejectBusinessProfile = () => {
    if (!foundBusinessProfile) return;
    
    // Extraire les informations de l'adresse
    const addressComponents = foundBusinessProfile.address.split(',');
    const city = addressComponents[1]?.trim() || '';
    const postalCodeMatch = foundBusinessProfile.address.match(/\b\d{5}\b/);
    const postalCode = postalCodeMatch ? postalCodeMatch[0] : '';
    
    // Procéder avec les données minimales
    onStoreSelect({
      name: foundBusinessProfile.name,
      address: addressComponents[0]?.trim() || '',
      city,
      postalCode,
      latitude: foundBusinessProfile.latitude,
      longitude: foundBusinessProfile.longitude,
      placeId: foundBusinessProfile.placeId
    });
    setIsOpen(false);
    setFoundBusinessProfile(null);
  };

  const getPlaceDetails = (placeId: string) => {
    if (!window.google?.maps?.places) {
      // Essayer de charger l'API Google Maps
      loadGoogleMapsAPI().then(() => {
        if (window.google?.maps?.places) {
          fetchPlaceDetails(placeId);
        } else {
          toast({
            title: "API Google indisponible",
            description: "Impossible de charger l'API Google Maps. Veuillez rafraîchir la page.",
            variant: "destructive"
          });
        }
      }).catch(error => {
        console.error("Failed to load Google Maps API:", error);
        toast({
          title: "Erreur de chargement API",
          description: "Impossible de charger l'API Google Maps.",
          variant: "destructive"
        });
      });
      return;
    }
    
    fetchPlaceDetails(placeId);
  };

  const fetchPlaceDetails = (placeId: string) => {
    try {
      console.log("Getting details for place ID:", placeId);
      
      // Create a visible div for the PlacesService (can help with some Google Maps issues)
      const serviceDiv = document.createElement('div');
      serviceDiv.style.width = '1px';
      serviceDiv.style.height = '1px';
      serviceDiv.style.position = 'absolute';
      serviceDiv.style.visibility = 'hidden';
      document.body.appendChild(serviceDiv);
      
      const service = new google.maps.places.PlacesService(serviceDiv);
      
      service.getDetails({ 
        placeId, 
        fields: ['name', 'formatted_address', 'place_id', 'geometry', 'website', 'formatted_phone_number', 'opening_hours', 'photos'] 
      }, (place, status) => {
        document.body.removeChild(serviceDiv);
        
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

  // Charger l'API Google Maps
  const loadGoogleMapsAPI = async () => {
    if (window.google?.maps?.places) {
      console.log("Google Maps API already loaded");
      return Promise.resolve();
    }
    
    try {
      const apiKey = await getGoogleMapsApiKey();
      
      if (!apiKey) {
        console.error("No Google Maps API key available");
        return Promise.reject(new Error("No API key available"));
      }
      
      return new Promise<void>((resolve, reject) => {
        // Vérifier si un script existe déjà
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          console.log("Google Maps script already exists, removing it");
          existingScript.remove();
        }
        
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsCallback`;
        script.async = true;
        script.defer = true;
        
        window.initGoogleMapsCallback = () => {
          console.log("Google Maps API loaded successfully via callback");
          resolve();
        };
        
        script.onerror = (err) => {
          console.error("Failed to load Google Maps API:", err);
          reject(new Error("Failed to load Google Maps API"));
        };
        
        document.head.appendChild(script);
      });
    } catch (error) {
      console.error("Error in loadGoogleMapsAPI:", error);
      return Promise.reject(error);
    }
  };

  const handleManualSearch = async (values: {
    address: string;
    city: string;
    postalCode: string;
  }) => {
    const fullAddress = `${values.address}, ${values.postalCode} ${values.city}, France`;
    setIsSearching(true);
    setManualSearchResults([]);

    try {
      if (!window.google?.maps?.places) {
        await loadGoogleMapsAPI();
        
        if (!window.google?.maps?.places) {
          throw new Error("Google Places API not available after loading");
        }
      }
      
      const serviceDiv = document.createElement('div');
      serviceDiv.style.width = '1px';
      serviceDiv.style.height = '1px';
      serviceDiv.style.position = 'absolute';
      serviceDiv.style.visibility = 'hidden';
      document.body.appendChild(serviceDiv);
      
      const service = new google.maps.places.PlacesService(serviceDiv);

      console.log("Searching for place with query:", fullAddress);
      service.textSearch(
        {
          query: fullAddress
        },
        (results, status) => {
          setIsSearching(false);
          document.body.removeChild(serviceDiv);
          
          if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            console.log("Places found:", results);
            setManualSearchResults(results);
            
            if (results.length === 1) {
              getPlaceDetails(results[0].place_id!);
            }
          } else {
            console.warn("Place text search result:", status);
            
            // Essayer une méthode alternative
            const alternateDiv = document.createElement('div');
            alternateDiv.style.width = '1px';
            alternateDiv.style.height = '1px';
            document.body.appendChild(alternateDiv);
            
            const alternateService = new google.maps.places.PlacesService(alternateDiv);
            alternateService.findPlaceFromQuery(
              {
                query: fullAddress,
                fields: ['name', 'formatted_address', 'place_id', 'geometry']
              },
              (findResults, findStatus) => {
                document.body.removeChild(alternateDiv);
                
                if (findStatus === google.maps.places.PlacesServiceStatus.OK && 
                    findResults && findResults.length > 0) {
                  console.log("Places found with alternate method:", findResults);
                  setManualSearchResults(findResults);
                  
                  if (findResults.length === 1) {
                    getPlaceDetails(findResults[0].place_id!);
                  }
                } else {
                  console.warn("Alternative search also failed:", findStatus);
                  toast({
                    title: "Aucun établissement trouvé",
                    description: "Vérifiez l'adresse saisie et réessayez",
                    variant: "destructive"
                  });
                }
              }
            );
          }
        }
      );
    } catch (error) {
      setIsSearching(false);
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
          setShowManualForm(false);
          setManualSearchResults([]);
          setIsOpen(true);
        }} 
        className="w-full"
      >
        <MapPin className="w-4 h-4 mr-2" />
        Rechercher ma boutique CBD
      </Button>

      <DialogWrapper
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setShowManualForm(false);
            setManualSearchResults([]);
            setFoundBusinessProfile(null);
          }
          setIsOpen(open);
        }}
        isLoading={isLoading}
        apiKeyLoaded={isApiLoaded}
        onManualAdd={() => setShowManualForm(true)}
        showManualForm={showManualForm}
        title={isRegistration ? "Recherchez votre boutique" : "Recherche de boutique CBD"}
        description={isRegistration 
          ? "Recherchez votre boutique pour récupérer automatiquement les informations de Google Business."
          : "Recherchez votre boutique CBD sur la carte. Si votre boutique n'apparaît pas, vous pourrez l'ajouter manuellement."
        }
      >
        {foundBusinessProfile && (
          <GoogleBusinessIntegration 
            businessDetails={foundBusinessProfile}
            isLoading={isLoadingBusinessProfile}
            onAccept={handleAcceptBusinessProfile}
            onReject={handleRejectBusinessProfile}
          />
        )}
        
        {showManualForm ? (
          <ManualAddressForm
            onSubmit={handleManualSearch}
            onBack={() => setShowManualForm(false)}
            isSearching={isSearching}
          />
        ) : (
          <>
            <div id="store-search-map" className="w-full flex-1 rounded-md relative">
              {map && userLocation && (
                <>
                  <StoreSearchBar 
                    searchQuery={searchQuery}
                    onSearchQueryChange={setSearchQuery}
                    onSearch={handleSearch}
                    isSearching={isSearching}
                    noResults={noResults}
                  />
                  <StoreMarkers 
                    map={map}
                    userLocation={userLocation}
                    onStoreSelect={handleStoreSelect}
                  />
                </>
              )}
            </div>
            <SearchResults
              results={manualSearchResults.map(place => ({
                place_id: place.place_id || '',
                name: place.name,
                formatted_address: place.formatted_address
              }))}
              onSelectPlace={getPlaceDetails}
            />
          </>
        )}
      </DialogWrapper>
    </>
  );
};

export default StoreSearch;
