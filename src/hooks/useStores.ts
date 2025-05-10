
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Store, StoreOpeningHours } from '@/types/store';
import { storesData } from '@/data/storesData';

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStores = async () => {
    try {
      setIsLoading(true);
      
      // Essayer d'abord de charger depuis Supabase
      const { data: dbStores, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_verified', true);
      
      if (error) {
        console.error("Error fetching stores from Supabase:", error);
        throw error;
      }
      
      if (dbStores && dbStores.length > 0) {
        // Convertir les données de la DB au format Store
        const storeList = dbStores.map((storeData: any) => {
          // Convertir les heures d'ouverture du format string[] au format StoreOpeningHours[]
          let openingHours: StoreOpeningHours[] = [];
          if (storeData.opening_hours && Array.isArray(storeData.opening_hours)) {
            openingHours = storeData.opening_hours.map((hour: string) => {
              const parts = hour.split(':');
              return {
                day: parts[0] || '',
                hours: parts.slice(1).join(':') || ''
              };
            });
          }
          
          return {
            id: storeData.id,
            name: storeData.name,
            address: storeData.address,
            city: storeData.city,
            postalCode: storeData.postal_code || '',
            latitude: storeData.latitude,
            longitude: storeData.longitude,
            phone: storeData.phone || '',
            website: storeData.website || '',
            openingHours,
            description: storeData.description || '',
            imageUrl: storeData.photo_url || '',
            rating: 0, // Default values since these may not be in the DB yet
            reviewCount: 0,
            reviews: [],
            products: [],
            placeId: storeData.google_place_id || '',
            isPremium: storeData.is_premium || false,
            isEcommerce: storeData.is_ecommerce || false,
            ecommerceUrl: storeData.ecommerce_url || '',
            hasGoogleBusinessProfile: storeData.has_google_profile || false,
          };
        });
        
        setStores(storeList);
      } else {
        // Fallback aux données statiques
        console.log("No stores found in database, using local data");
        setStores(storesData || []);
      }
    } catch (err) {
      console.error("Error in useStores:", err);
      setError(err as Error);
      // Fallback aux données statiques
      setStores(storesData || []);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchStores();
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return { stores, isLoading, error, refetch };
};
