
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Store } from '@/types/store';
import { stores as staticStores } from '@/utils/storeUtils';

interface StoreDBType {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  place_id?: string;
  phone?: string;
  website?: string;
  rating: number;
  review_count: number;
  description?: string;
  logo_url?: string;
  photo_url?: string;
  is_ecommerce?: boolean;
  ecommerce_url?: string;
  has_google_business_profile?: boolean;
  created_at: string;
  updated_at: string;
}

// Converting database model to application model
const mapDbStoreToAppStore = (dbStore: StoreDBType): Store => {
  return {
    id: dbStore.id,
    name: dbStore.name,
    address: dbStore.address,
    city: dbStore.city,
    postalCode: dbStore.postal_code,
    latitude: dbStore.latitude,
    longitude: dbStore.longitude,
    placeId: dbStore.place_id || null,
    phone: dbStore.phone || null,
    website: dbStore.website || null,
    rating: dbStore.rating || 0,
    reviewCount: dbStore.review_count || 0,
    description: dbStore.description || "",
    logo_url: dbStore.logo_url || null,
    photo_url: dbStore.photo_url || null,
    imageUrl: dbStore.photo_url || "https://via.placeholder.com/400x200?text=CBD",
    isEcommerce: dbStore.is_ecommerce || false,
    ecommerceUrl: dbStore.ecommerce_url || null,
    hasGoogleBusinessProfile: dbStore.has_google_business_profile || false,
    distance: null,
    products: [],  // Initialize with empty array as it doesn't exist in StoreDBType
    openingHours: [], // Add default empty openingHours array
    reviews: [], // Add default empty reviews array
  };
};

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch from local static data
      const localStores = staticStores;
      
      // Fetch from Supabase
      const { data, error } = await supabase.from('stores').select('*');
      
      if (error) throw error;
      
      // Map database stores to application model
      const mappedStores = data.map(mapDbStoreToAppStore);
      
      // Initialize products as empty arrays since they don't exist in the database directly
      const storesWithProducts = mappedStores.map(store => ({
        ...store,
        products: []
      }));
      
      // Combine stores from both sources
      setStores([...localStores, ...storesWithProducts]);
    } catch (err) {
      console.error('Error fetching stores:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stores,
    isLoading,
    error,
    refetch: fetchData,
  };
};
