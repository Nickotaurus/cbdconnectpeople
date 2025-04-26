
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { findBusinessByPlaceId } from '@/services/googleBusinessService';

export const useStoreSelection = (onStoreSelect: (store: {
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
}) => void) => {
  const [isLoadingBusinessProfile, setIsLoadingBusinessProfile] = useState(false);
  const { toast } = useToast();

  const handleStoreSelect = async (placeDetails: google.maps.places.PlaceResult, isRegistration = false) => {
    if (!placeDetails.formatted_address || !placeDetails.geometry?.location) {
      toast({
        title: "Données incomplètes",
        description: "Les informations de l'établissement sont incomplètes",
        variant: "destructive"
      });
      return null;
    }

    try {
      const addressComponents = placeDetails.formatted_address.split(',');
      const city = addressComponents[1]?.trim() || '';
      const postalCodeMatch = placeDetails.formatted_address.match(/\b\d{5}\b/);
      const postalCode = postalCodeMatch ? postalCodeMatch[0] : '';
      const placeLocation = placeDetails.geometry.location;

      if (isRegistration && placeDetails.place_id) {
        setIsLoadingBusinessProfile(true);
        const businessDetails = await findBusinessByPlaceId(placeDetails.place_id);
        setIsLoadingBusinessProfile(false);
        
        if (businessDetails) {
          return businessDetails;
        }
      }

      return {
        name: placeDetails.name || '',
        address: addressComponents[0]?.trim() || '',
        city,
        postalCode,
        latitude: placeLocation.lat(),
        longitude: placeLocation.lng(),
        placeId: placeDetails.place_id || ''
      };
    } catch (error) {
      console.error("Error processing place details:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement des données de l'établissement",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    handleStoreSelect,
    isLoadingBusinessProfile
  };
};
