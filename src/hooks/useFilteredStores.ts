
import { useState, useEffect, useCallback } from 'react';
import { Store } from '@/types/store/store';
import { getStoresByDistance } from '@/utils/data';
import { useStores } from '@/hooks/useStores';
import { combineAndDeduplicateStores } from '@/utils/storeUtils/deduplication';
import { preloadStorePhotos } from '@/services/googlePhotosService';

interface FilterConfig {
  categories: string[];
  minRating: number;
  maxDistance: number | null;
}

export const useFilteredStores = (
  userLocation: { latitude: number, longitude: number },
  searchTerm: string,
  activeFilters: FilterConfig
) => {
  const { stores: supabaseStores, isLoading, refetch } = useStores();
  const [combinedStores, setCombinedStores] = useState<Store[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Get and combine stores from different sources
  const getAndCombineStores = useCallback(() => {
    // Obtenir les boutiques locales
    const localStores = getStoresByDistance(userLocation.latitude, userLocation.longitude);
    
    // Combiner avec boutiques Supabase et dédupliquer
    const combined = combineAndDeduplicateStores(localStores, supabaseStores, userLocation);
    
    // Trier par distance
    const sortedByDistance = getStoresByDistance(
      userLocation.latitude, 
      userLocation.longitude, 
      combined
    );
    
    setCombinedStores(sortedByDistance);
    
    // Précharger les photos Google
    if (sortedByDistance.length > 0) {
      preloadStorePhotos(sortedByDistance);
    }
    
    if (isInitialLoad && !isLoading) {
      setIsInitialLoad(false);
    }
  }, [userLocation, supabaseStores, isLoading, isInitialLoad]);
  
  // Fetch and combine stores effect
  useEffect(() => {
    getAndCombineStores();
  }, [getAndCombineStores]);
  
  // Setup auto-refresh
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 30000); // 30 secondes
    
    return () => clearInterval(intervalId);
  }, [refetch]);
  
  return {
    stores: combinedStores,
    isLoading: isLoading || isInitialLoad,
    refetch: () => {
      refetch();
      getAndCombineStores();
    }
  };
};
