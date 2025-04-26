
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useGoogleMap } from '@/hooks/useGoogleMap';
import { useGooglePlacesApi } from '@/hooks/store/useGooglePlacesApi';
import { useStoreSearch } from '@/hooks/store/useStoreSearch';
import { useStoreSelection } from '@/hooks/store/useStoreSelection';
import { usePlacesService } from '@/hooks/store/usePlacesService';
import { loadGoogleMapsAPI } from '@/services/googleMapsService';
import StoreMarkers from './StoreMarkers';
import ManualAddressForm from './search/ManualAddressForm';
import SearchResults from './search/SearchResults';
import StoreSearchBar from './search/StoreSearchBar';
import DialogWrapper from './search/DialogWrapper';
import GoogleBusinessIntegration from './search/GoogleBusinessIntegration';
import { StoreData } from '@/types/store-types';
import './StoreSearch.css';

interface StoreSearchProps {
  onStoreSelect: (store: StoreData) => void;
  isRegistration?: boolean;
}

type BusinessProfile = StoreData;

const StoreSearch = ({ onStoreSelect, isRegistration = false }: StoreSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualSearchResults, setManualSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
  const [foundBusinessProfile, setFoundBusinessProfile] = useState<BusinessProfile | null>(null);

  const { map, isLoading, userLocation } = useGoogleMap();
  const { isApiLoaded } = useGooglePlacesApi();
  const { getPlaceDetails } = usePlacesService();
  const { handleStoreSelect, isLoadingBusinessProfile } = useStoreSelection(onStoreSelect);
  const { isSearching, setIsSearching, noResults, setNoResults, searchQuery, setSearchQuery, handleSearch } = useStoreSearch({ onStoreSelect });

  const handlePlaceSelect = (placeId: string) => {
    getPlaceDetails(placeId, async (place) => {
      const result = await handleStoreSelect(place, isRegistration);
      if (result) {
        if ('photos' in result && result.name && result.address && result.placeId && 
            result.latitude !== undefined && result.longitude !== undefined && 
            result.city !== undefined && result.postalCode !== undefined) {
          setFoundBusinessProfile(result);
        } else if (result.name && result.address && result.city && result.postalCode && 
                  result.latitude !== undefined && result.longitude !== undefined && 
                  result.placeId) {
          onStoreSelect(result);
          setIsOpen(false);
        }
      }
    });
  };

  const handleManualSearch = async (values: {
    address: string;
    city: string;
    postalCode: string;
  }) => {
    setIsSearching(true);
    setManualSearchResults([]);
    const fullAddress = `${values.address}, ${values.postalCode} ${values.city}, France`;

    try {
      if (!window.google?.maps?.places) {
        await loadGoogleMapsAPI(['places']);
      }

      const serviceDiv = document.createElement('div');
      document.body.appendChild(serviceDiv);
      
      const service = new google.maps.places.PlacesService(serviceDiv);
      
      service.textSearch({ query: fullAddress }, (results, status) => {
        setIsSearching(false);
        document.body.removeChild(serviceDiv);
        
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          setManualSearchResults(results);
          if (results.length === 1 && results[0].place_id) {
            handlePlaceSelect(results[0].place_id);
          }
        } else {
          setNoResults(true);
        }
      });
    } catch (error) {
      setIsSearching(false);
      console.error('Error searching for place:', error);
    }
  };

  const handleAcceptBusinessProfile = () => {
    if (foundBusinessProfile) {
      onStoreSelect(foundBusinessProfile);
      setIsOpen(false);
      setFoundBusinessProfile(null);
    }
  };

  const handleRejectBusinessProfile = () => {
    if (foundBusinessProfile) {
      const basicInfo: StoreData = {
        name: foundBusinessProfile.name,
        address: foundBusinessProfile.address,
        city: foundBusinessProfile.city,
        postalCode: foundBusinessProfile.postalCode,
        latitude: foundBusinessProfile.latitude,
        longitude: foundBusinessProfile.longitude,
        placeId: foundBusinessProfile.placeId
      };
      onStoreSelect(basicInfo);
      setIsOpen(false);
      setFoundBusinessProfile(null);
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
                    onStoreSelect={handlePlaceSelect}
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
              onSelectPlace={handlePlaceSelect}
            />
          </>
        )}
      </DialogWrapper>
    </>
  );
};

export default StoreSearch;
