
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '@/components/Map';
import { Store } from '@/types/store';
import { getStoresByDistance, filterUserLocation } from '@/utils/data';
import { useAuth } from '@/contexts/AuthContext';

// Import new components
import SearchBar from '@/components/map/SearchBar';
import MapActions from '@/components/map/MapActions';
import FiltersSheet from '@/components/map/FiltersSheet';
import StoreDetail from '@/components/map/StoreDetail';
import StoreList from '@/components/map/StoreList';

const MapView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(filterUserLocation());
  const [stores, setStores] = useState(getStoresByDistance(userLocation.latitude, userLocation.longitude));
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setStores(getStoresByDistance(latitude, longitude));
        },
        (error) => {
          console.log('Geolocation error:', error);
          setUserLocation(filterUserLocation());
        }
      );
    }
    
    // Listen for reset search event
    const handleResetSearch = () => setSearchTerm('');
    window.addEventListener('reset-search', handleResetSearch);
    
    return () => {
      window.removeEventListener('reset-search', handleResetSearch);
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

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <MapActions />
          <FiltersSheet />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-3/5 h-1/2 md:h-full order-2 md:order-1 p-4">
          <Map 
            stores={stores} 
            onSelectStore={handleSelectStore} 
            selectedStoreId={selectedStore?.id}
          />
        </div>
        
        <div className="w-full md:w-2/5 h-1/2 md:h-full order-1 md:order-2 overflow-y-auto p-4 bg-secondary/50">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              {selectedStore 
                ? 'Boutique sélectionnée' 
                : stores.length > 0 
                  ? `${stores.length} boutiques trouvées` 
                  : 'Aucune boutique trouvée'
              }
            </h2>
          </div>
          
          {selectedStore ? (
            <StoreDetail 
              store={selectedStore} 
              onClearSelection={clearSelection} 
              onViewDetails={handleStoreDetail} 
            />
          ) : (
            <StoreList 
              stores={stores} 
              searchTerm={searchTerm} 
              userLocation={userLocation} 
              onSelectStore={handleSelectStore} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
