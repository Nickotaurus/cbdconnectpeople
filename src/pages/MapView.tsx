
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '@/components/Map';
import { Store } from '@/types/store';
import { getStoresByDistance, filterUserLocation } from '@/utils/data';
import { useAuth } from '@/contexts/auth';

// Import new components
import SearchBar from '@/components/map/SearchBar';
import MapActions from '@/components/map/MapActions';
import FiltersSheet from '@/components/map/FiltersSheet';
import StoreDetail from '@/components/map/StoreDetail';
import StoreList from '@/components/map/StoreList';
import { useStores } from '@/hooks/useStores';

const MapView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(filterUserLocation());
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const { stores: supabaseStores, isLoading: isLoadingStores } = useStores();
  const [combinedStores, setCombinedStores] = useState<Store[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Filter states
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    minRating: 0,
    maxDistance: null as number | null,
  });

  // Memoized function to combine and deduplicate stores
  const combineAndDeduplicateStores = useCallback((localStores: Store[], dbStores: Store[]) => {
    // Create a Map object using placeId or address+name as unique identifier
    const storeMap = new Map<string, Store>();
    
    // First add local stores to the map
    localStores.forEach(store => {
      const key = store.placeId || `${store.address}-${store.name}`.toLowerCase().replace(/\s+/g, '');
      storeMap.set(key, store);
    });
    
    // Then add Supabase stores, overwriting local ones if they exist with same key
    if (dbStores && dbStores.length > 0) {
      dbStores.forEach(store => {
        const key = store.placeId || `${store.address}-${store.name}`.toLowerCase().replace(/\s+/g, '');
        if (!storeMap.has(key)) {
          storeMap.set(key, store);
        }
      });
    }
    
    // Convert map back to array and sort by distance
    const uniqueStores = Array.from(storeMap.values());
    return getStoresByDistance(userLocation.latitude, userLocation.longitude, uniqueStores);
  }, [userLocation]);
  
  // Load and combine stores
  useEffect(() => {
    const localStores = getStoresByDistance(userLocation.latitude, userLocation.longitude);
    const combined = combineAndDeduplicateStores(localStores, supabaseStores);
    setCombinedStores(combined);
    
    if (isInitialLoad && !isLoadingStores) {
      setIsInitialLoad(false);
    }
  }, [userLocation, supabaseStores, isLoadingStores, combineAndDeduplicateStores, isInitialLoad]);
  
  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.log('Geolocation error:', error);
        },
        { maximumAge: 60000, timeout: 5000 }
      );
    }
    
    // Listen for reset search event
    const handleResetSearch = () => setSearchTerm('');
    window.addEventListener('reset-search', handleResetSearch);
    
    // Listen for reset filters event
    const handleResetFilters = () => {
      setSearchTerm('');
      setActiveFilters({
        categories: [],
        minRating: 0,
        maxDistance: null,
      });
    };
    window.addEventListener('reset-filters', handleResetFilters);
    
    return () => {
      window.removeEventListener('reset-search', handleResetSearch);
      window.removeEventListener('reset-filters', handleResetFilters);
    };
  }, []);
    
  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
  };
  
  const handleStoreDetail = (store: Store) => {
    navigate(`/store/${store.id}`);
  };
  
  const clearSelection = () => {
    setSelectedStore(null);
  };

  const handleApplyFilters = (filters: {
    categories: string[];
    minRating: number;
    maxDistance: number | null;
  }) => {
    setActiveFilters(filters);
    // Clear selected store when applying new filters
    setSelectedStore(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <MapActions />
          <FiltersSheet onApplyFilters={handleApplyFilters} />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-3/5 h-1/2 md:h-full order-2 md:order-1 p-4">
          <Map 
            stores={combinedStores} 
            onSelectStore={handleSelectStore} 
            selectedStoreId={selectedStore?.id}
          />
        </div>
        
        <div className="w-full md:w-2/5 h-1/2 md:h-full order-1 md:order-2 overflow-y-auto p-4 bg-secondary/50">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              {selectedStore 
                ? 'Boutique sélectionnée' 
                : isInitialLoad || isLoadingStores
                ? 'Chargement des boutiques...'
                : combinedStores.length > 0 
                  ? `${combinedStores.length} boutiques trouvées` 
                  : 'Aucune boutique trouvée'
              }
            </h2>
            
            {!selectedStore && activeFilters && (
              activeFilters.categories.length > 0 || 
              activeFilters.minRating > 0 || 
              activeFilters.maxDistance !== null
            ) && (
              <div className="flex flex-wrap gap-1 mt-2">
                {activeFilters.categories.length > 0 && (
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {activeFilters.categories.length} catégorie(s)
                  </div>
                )}
                
                {activeFilters.minRating > 0 && (
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {activeFilters.minRating}+ étoiles
                  </div>
                )}
                
                {activeFilters.maxDistance !== null && (
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    &lt; {activeFilters.maxDistance} km
                  </div>
                )}
              </div>
            )}
          </div>
          
          {selectedStore ? (
            <StoreDetail 
              store={selectedStore} 
              onClearSelection={clearSelection} 
              onViewDetails={handleStoreDetail} 
            />
          ) : (
            <StoreList 
              stores={combinedStores} 
              searchTerm={searchTerm} 
              userLocation={userLocation} 
              onSelectStore={handleSelectStore}
              activeFilters={activeFilters}
              isLoading={isInitialLoad || isLoadingStores}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
