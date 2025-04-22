
import { getGoogleMapsApiKey } from './googleApiService';
import type { GooglePlaceResult, GooglePlacesResponse, GooglePlaceDetailsResponse } from '@/types/google-places.types';

export const searchCBDShops = async (
  query: string = "boutique CBD", 
  location: string = "France"
): Promise<GooglePlaceResult[]> => {
  try {
    const apiKey = await getGoogleMapsApiKey();
    
    if (!apiKey) {
      throw new Error("Clé API Google Places non disponible");
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&location=${encodeURIComponent(location)}&radius=50000&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la recherche de boutiques CBD");
    }

    const data: GooglePlacesResponse = await response.json();
    
    if (data.status !== "OK") {
      throw new Error(`Erreur API: ${data.status}`);
    }

    return data.results;
  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
    throw error;
  }
};

export const getPlaceDetails = async (
  placeId: string
): Promise<GooglePlaceDetailsResponse["result"]> => {
  try {
    const apiKey = await getGoogleMapsApiKey();
    
    if (!apiKey) {
      throw new Error("Clé API Google Places non disponible");
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_address,geometry,reviews,website,formatted_phone_number,opening_hours&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des détails de la boutique");
    }

    const data: GooglePlaceDetailsResponse = await response.json();
    
    if (data.status !== "OK") {
      throw new Error(`Erreur API: ${data.status}`);
    }

    return data.result;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails:", error);
    throw error;
  }
};
