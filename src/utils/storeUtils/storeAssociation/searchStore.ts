
import { supabase } from '@/integrations/supabase/client';
import { stores } from '../storeOperations';
import { StoreBasicInfo } from './types';

/**
 * Search for a store in Supabase database by name and city
 */
export const searchStoreInDatabase = async (storeName: string, city?: string) => {
  console.log(`Searching in database for ${storeName}${city ? ` in ${city}` : ''}`);
  
  const query = supabase
    .from('stores')
    .select('*');
  
  // Apply store name filter
  const storeNameQuery = query.ilike('name', `%${storeName}%`);
  
  // If a city is provided, use it as an additional filter
  const { data: storeData, error } = await (city 
    ? storeNameQuery.ilike('city', `%${city}%`) 
    : storeNameQuery);

  if (error) {
    console.error('Error searching store in database:', error);
    return null;
  }

  console.log(`Found ${storeData?.length || 0} stores in database`);
  return storeData;
};

/**
 * Search for a store in local data by name and city with flexible matching
 */
export const searchStoreInLocalData = (storeName: string, city?: string) => {
  console.log(`Searching in local data for ${storeName}${city ? ` in ${city}` : ''}`);
  console.log('Number of local stores to check:', stores.length);
  
  // More lenient search with toLowerCase() and includes()
  const localStore = stores.find(s => {
    const nameMatch = s.name.toLowerCase().includes(storeName.toLowerCase()) || 
                     storeName.toLowerCase().includes(s.name.toLowerCase());
    
    // If a city is provided, check for city match too
    const cityMatch = !city || 
                     s.city.toLowerCase().includes(city.toLowerCase()) ||
                     city.toLowerCase().includes(s.city.toLowerCase());
    
    return nameMatch && cityMatch;
  });

  if (localStore) {
    console.log('Store found in local data:', localStore.name, 'in', localStore.city);
  }

  return localStore;
};

/**
 * Check if a store with similar coordinates already exists in the database
 */
export const checkForExistingStoreByLocation = async (latitude: number, longitude: number) => {
  const { data: existingStores, error } = await supabase
    .from('stores')
    .select('id, name, address, latitude, longitude, claimed_by')
    .eq('latitude', latitude)
    .eq('longitude', longitude);

  if (error) {
    console.error('Error checking for existing store by location:', error);
    return null;
  }

  if (existingStores && existingStores.length > 0) {
    console.log('Store with similar location already exists:', existingStores[0].name);
    return existingStores[0];
  }

  return null;
};

/**
 * Check if a store is already claimed by another user
 */
export const isStoreClaimed = (store: any, userId: string) => {
  return store.claimed_by && store.claimed_by !== userId;
};
