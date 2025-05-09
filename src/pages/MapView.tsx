
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Store } from '@/types/store';
import { getStoresByDistance } from '@/utils/data';
import MapComponent from '@/components/Map';

// Import custom hooks
import { useMapView } from '@/hooks/useMapView';
import { useFilteredStores } from '@/hooks/useFilteredStores';

// Import components
import SearchBar from '@/components/map/SearchBar';
import MapActions from '@/components/map/MapActions';
import FiltersSheet from '@/components/map/FiltersSheet';
import StoreSection from '@/components/map/StoreSection';
import { Button } from "@/components/ui/button";

const MapView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Custom hook for map view state and operations
  const {
    searchTerm,
    setSearchTerm,
    userLocation,
    selectedStore,
    activeFilters,
    debugMode,
    handleSelectStore,
    handleClearSelection,
    handleApplyFilters,
    toggleDebugMode,
    getLocalStoresCount
  } = useMapView();
  
  // Custom hook for store filtering and data loading
  const {
    stores: combinedStores,
    isLoading,
    refetch
  } = useFilteredStores(userLocation, searchTerm, activeFilters);
  
  // Navigate to store detail page
  const handleStoreDetail = (store: Store) => {
    navigate(`/store/${store.id}`);
  };
  
  // Count of local stores for debug panel
  const localStoresCount = getLocalStoresCount();

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <MapActions />
          <FiltersSheet onApplyFilters={handleApplyFilters} />
          {user && (
            <Button 
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded ml-auto"
              variant="outline"
              size="sm"
              onClick={toggleDebugMode}
            >
              {debugMode ? "Debug: ON" : "Debug: OFF"}
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-3/5 h-1/2 md:h-full order-2 md:order-1 p-4">
          <MapComponent 
            stores={combinedStores} 
            onSelectStore={handleSelectStore} 
            selectedStoreId={selectedStore?.id}
          />
        </div>
        
        <StoreSection
          stores={combinedStores}
          isLoading={isLoading}
          searchTerm={searchTerm}
          userLocation={userLocation}
          activeFilters={activeFilters}
          selectedStore={selectedStore}
          onSelectStore={handleSelectStore}
          onClearSelection={handleClearSelection}
          onViewDetails={handleStoreDetail}
          debugMode={debugMode}
          refetch={refetch}
          supabaseStoresCount={combinedStores.filter(s => s.id.includes('-')).length}
          localStoresCount={localStoresCount}
        />
      </div>
    </div>
  );
};

export default MapView;
