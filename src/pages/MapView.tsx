
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

  // Fonction améliorée pour combiner et dédupliquer les boutiques avec une gestion spécifique pour "CBD Histoire de Chanvre"
  const combineAndDeduplicateStores = useCallback((localStores: Store[], dbStores: Store[]) => {
    // Créer une map pour suivre les boutiques uniques
    const storeMap: Record<string, Store> = {};
    
    // Fonction pour générer une clé cohérente pour une boutique
    const getStoreKey = (store: Store): string => {
      // Clé spéciale pour CBD Histoire de Chanvre (pour supprimer tous les doublons)
      if (store.name.includes("CBD Histoire de Chanvre")) {
        return "cbd_histoire_de_chanvre";
      }
      
      // Pour les autres boutiques, utiliser la logique standard
      if (store.placeId) {
        return `place_${store.placeId}`;
      }
      
      if (store.latitude && store.longitude) {
        // Arrondir les coordonnées à 5 décimales
        const lat = Math.round(store.latitude * 100000) / 100000;
        const lng = Math.round(store.longitude * 100000) / 100000;
        return `geo_${lat}_${lng}`;
      }
      
      return `addr_${store.address.toLowerCase().replace(/\s+/g, '')}_${store.name.toLowerCase().replace(/\s+/g, '')}`;
    };
    
    // D'abord ajouter les boutiques locales à la map
    localStores.forEach(store => {
      const key = getStoreKey(store);
      storeMap[key] = store;
    });
    
    // Ensuite ajouter les boutiques de Supabase, remplaçant les locales si elles existent avec la même clé
    if (dbStores && dbStores.length > 0) {
      dbStores.forEach(store => {
        const key = getStoreKey(store);
        storeMap[key] = store;
      });
    }
    
    // Convertir la map en tableau et trier par distance
    const uniqueStores = Object.values(storeMap);
    
    // Retourner les boutiques triées par distance
    return getStoresByDistance(userLocation.latitude, userLocation.longitude, uniqueStores);
  }, [userLocation]);
  
  // Charger et combiner les boutiques
  useEffect(() => {
    // Obtenir les boutiques locales
    const localStores = getStoresByDistance(userLocation.latitude, userLocation.longitude);
    // Puis combiner avec les boutiques de Supabase et assurer une bonne déduplication
    const combined = combineAndDeduplicateStores(localStores, supabaseStores);
    setCombinedStores(combined);
    
    if (isInitialLoad && !isLoadingStores) {
      setIsInitialLoad(false);
    }
  }, [userLocation, supabaseStores, isLoadingStores, combineAndDeduplicateStores, isInitialLoad]);
  
  // Obtenir la position de l'utilisateur
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
    
    // Écouter l'événement reset search
    const handleResetSearch = () => setSearchTerm('');
    window.addEventListener('reset-search', handleResetSearch);
    
    // Écouter l'événement reset filters
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
