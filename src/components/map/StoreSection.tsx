
import { Store } from '@/types/store/store';
import { getStoresByDistance } from '@/utils/data';
import StoreList from '@/components/map/StoreList';
import StoreDetail from '@/components/map/StoreDetail';
import ActiveFiltersDisplay from '@/components/map/ActiveFiltersDisplay';
import DebugPanel from '@/components/map/DebugPanel';

interface StoreSectionProps {
  stores: Store[];
  isLoading: boolean;
  searchTerm: string;
  userLocation: { latitude: number, longitude: number };
  activeFilters: {
    categories: string[];
    minRating: number;
    maxDistance: number | null;
  };
  selectedStore: Store | null;
  onSelectStore: (store: Store) => void;
  onClearSelection: () => void;
  onViewDetails: (store: Store) => void;
  debugMode: boolean;
  refetch: () => void;
  supabaseStoresCount: number;
  localStoresCount: number;
}

const StoreSection = ({
  stores,
  isLoading,
  searchTerm,
  userLocation,
  activeFilters,
  selectedStore,
  onSelectStore,
  onClearSelection,
  onViewDetails,
  debugMode,
  refetch,
  supabaseStoresCount,
  localStoresCount
}: StoreSectionProps) => {
  return (
    <div className="w-full md:w-2/5 h-1/2 md:h-full order-1 md:order-2 overflow-y-auto p-4 bg-secondary/50">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          {selectedStore 
            ? 'Boutique sélectionnée' 
            : isLoading
            ? 'Chargement des boutiques...'
            : stores.length > 0 
              ? `${stores.length} boutiques trouvées` 
              : 'Aucune boutique trouvée'
          }
        </h2>
        
        {!selectedStore && (
          <ActiveFiltersDisplay
            categories={activeFilters.categories}
            minRating={activeFilters.minRating}
            maxDistance={activeFilters.maxDistance}
          />
        )}
      </div>
      
      <DebugPanel
        isVisible={debugMode}
        supabaseStoresCount={supabaseStoresCount}
        localStoresCount={localStoresCount}
        combinedStoresCount={stores.length}
        onRefresh={refetch}
      />
      
      {selectedStore ? (
        <StoreDetail 
          store={selectedStore} 
          onClearSelection={onClearSelection} 
          onViewDetails={onViewDetails} 
        />
      ) : (
        <StoreList 
          stores={stores} 
          searchTerm={searchTerm} 
          userLocation={userLocation} 
          onSelectStore={onSelectStore}
          activeFilters={activeFilters}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default StoreSection;
