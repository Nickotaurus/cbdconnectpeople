
import { useEffect, useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Store } from '@/types/store';
import { StoreDBType } from '@/types/store-types';
import { useToast } from "@/components/ui/use-toast";

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_verified', true);

      if (error) throw new Error(error.message);

      // Transform Supabase data to match the Store interface
      const transformedStores: Store[] = (data || []).map((store: StoreDBType) => {
        // Convert string[] to array of objects with day and hours properties
        const formattedOpeningHours = (store.opening_hours || []).map(hourString => {
          // Assume format is "Day: hours" or similar
          const parts = hourString.split(':');
          return {
            day: parts[0] || '',
            hours: parts.length > 1 ? parts.slice(1).join(':').trim() : ''
          };
        });

        return {
          id: store.id,
          name: store.name,
          address: store.address,
          city: store.city,
          postalCode: store.postal_code || '',
          latitude: store.latitude,
          longitude: store.longitude,
          phone: store.phone || '',
          website: store.website || '',
          openingHours: formattedOpeningHours,
          description: store.description || '',
          imageUrl: store.photo_url || '',
          logo_url: store.logo_url || '',
          photo_url: store.photo_url || '',
          rating: 0, // Default value
          reviewCount: 0, // Default value
          placeId: store.google_place_id || '',
          reviews: [], // Data to be implemented later
          products: [], // Data to be implemented later
          incentive: undefined,
          coupon: {
            code: '',
            discount: '',
            validUntil: new Date().toISOString(),
            usageCount: 0,
            isAffiliate: false
          },
          lotteryPrize: undefined,
          isPremium: store.is_premium || false,
          premiumUntil: store.premium_until || undefined,
          isEcommerce: store.is_ecommerce || false,
          ecommerceUrl: store.ecommerce_url || undefined,
          hasGoogleBusinessProfile: store.has_google_profile || false
        };
      });

      console.log(`Nombre total de boutiques avant déduplication: ${transformedStores.length}`);
      
      // Remove duplicates, without special processing for "CBD Histoire de Chanvre"
      const uniqueStores = removeDuplicateStores(transformedStores);
      
      console.log(`Nombre total de boutiques après déduplication: ${uniqueStores.length}`);
      
      setStores(uniqueStores);
    } catch (err) {
      console.error('Error fetching stores:', err);
      setError(err instanceof Error ? err : new Error('Une erreur est survenue lors du chargement des boutiques'));
      toast({
        title: "Erreur",
        description: "Impossible de charger les boutiques depuis la base de données",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Simplified function to eliminate duplicates, without special treatment
  const removeDuplicateStores = (stores: Store[]): Store[] => {
    // Use a regular object to store unique stores
    const uniqueStoresMap: Record<string, Store> = {};
    
    stores.forEach(store => {
      // Use a standard deduplication key for all stores
      const key = generateUniqueStoreKey(store);
      uniqueStoresMap[key] = store;
    });
    
    console.log(`Après déduplication: ${Object.keys(uniqueStoresMap).length} boutiques uniques`);
    return Object.values(uniqueStoresMap);
  };
  
  // Function to generate a unique key for each store
  const generateUniqueStoreKey = (store: Store): string => {
    if (store.placeId) {
      return `place_${store.placeId}`;
    }
    
    if (store.latitude && store.longitude) {
      // Round to 5 decimals to avoid small differences
      const lat = Math.round(store.latitude * 100000) / 100000;
      const lng = Math.round(store.longitude * 100000) / 100000;
      return `geo_${lat}_${lng}`;
    }
    
    // Last option: use normalized address and name
    return `addr_${store.address.toLowerCase().replace(/\s+/g, '')}_${store.city.toLowerCase().replace(/\s+/g, '')}_${store.name.toLowerCase().replace(/\s+/g, '')}`;
  };

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const refetch = useCallback(() => {
    fetchStores();
  }, [fetchStores]);

  return { stores, isLoading, error, refetch };
};
