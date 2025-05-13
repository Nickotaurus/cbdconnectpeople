
import { supabase } from '@/integrations/supabase/client';
import { StoreBasicInfo, CityCoordinates } from './types';

/**
 * Default coordinates for common cities
 */
export const defaultCityCoordinates: Record<string, CityCoordinates> = {
  "Paris": { lat: 48.8566, lng: 2.3522 },
  "Lyon": { lat: 45.7640, lng: 4.8357 },
  "Marseille": { lat: 43.2965, lng: 5.3698 },
  "Bordeaux": { lat: 44.8378, lng: -0.5792 },
  "Lille": { lat: 50.6292, lng: 3.0573 },
  "Quimper": { lat: 47.9960, lng: -4.1024 }
};

/**
 * Get estimated postal code based on city name
 */
export const getEstimatedPostalCode = (city: string): string => {
  const cityMap: Record<string, string> = {
    "Paris": "75000",
    "Lyon": "69000",
    "Marseille": "13000",
    "Bordeaux": "33000",
    "Lille": "59000",
    "Quimper": "29000"
  };
  
  return cityMap[city] || "00000";
};

/**
 * Create a special Histoire de Chanvre store
 */
export const createHistoireDeChanvreStore = async (userId: string, city: string) => {
  try {
    const { data: newStore, error: insertError } = await supabase
      .from('stores')
      .insert({
        name: "Histoire de Chanvre",
        address: "5 Rue du Pré Perché",
        city: city || "Quimper",
        postal_code: getEstimatedPostalCode(city || "Quimper"),
        latitude: 47.9984,
        longitude: -4.1019,
        phone: "0298123456",
        description: "Boutique de produits CBD",
        user_id: userId,
        claimed_by: userId,
        is_verified: true
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating Histoire de Chanvre store:', insertError);
      return null;
    }

    return newStore;
  } catch (error) {
    console.error('Unexpected error creating Histoire de Chanvre store:', error);
    return null;
  }
};

/**
 * Create a basic store with minimal information
 */
export const createBasicStore = async (storeName: string, city: string, userId: string) => {
  try {
    const coords = defaultCityCoordinates[city] || { lat: 46.603354, lng: 1.888334 }; // Default to center of France
    
    const { data: newStore, error: insertError } = await supabase
      .from('stores')
      .insert({
        name: storeName,
        address: "À compléter",
        city: city,
        postal_code: getEstimatedPostalCode(city),
        latitude: coords.lat,
        longitude: coords.lng,
        description: `Boutique de CBD à ${city}`,
        user_id: userId,
        claimed_by: userId,
        is_verified: true
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating basic store:', insertError);
      return null;
    }

    return newStore;
  } catch (error) {
    console.error('Unexpected error creating basic store:', error);
    return null;
  }
};

/**
 * Create a store from local data
 */
export const createStoreFromLocalData = async (localStore: any, userId: string) => {
  try {
    const { data: newStore, error: insertError } = await supabase
      .from('stores')
      .insert({
        name: localStore.name,
        address: localStore.address,
        city: localStore.city,
        postal_code: localStore.postalCode,
        latitude: localStore.latitude,
        longitude: localStore.longitude,
        phone: localStore.phone || '',
        website: localStore.website || '',
        description: localStore.description || '',
        photo_url: localStore.imageUrl || '',
        user_id: userId,
        claimed_by: userId,
        is_verified: true
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating store from local data:', insertError);
      return null;
    }

    return newStore;
  } catch (error) {
    console.error('Unexpected error creating store from local data:', error);
    return null;
  }
};
