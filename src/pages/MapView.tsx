import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '@/components/Map';
import { Store } from '@/types/store';
import { getStoresByDistance, filterUserLocation } from '@/utils/data';
import { useAuth } from '@/contexts/auth';
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(filterUserLocation());
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const { stores: supabaseStores, isLoading: isLoadingStores, refetch } = useStores();
  const [combinedStores, setCombinedStores] = useState<Store[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  
  // Filter states
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    minRating: 0,
    maxDistance: null as number | null,
  });

  // Fonction optimisée pour combiner et dédupliquer les boutiques
  const combineAndDeduplicateStores = useCallback((localStores: Store[], dbStores: Store[]) => {
    // Utiliser un objet standard pour stocker les boutiques uniques au lieu de Map
    const storeMap = new Object() as Record<string, Store>;
    
    // Tracer les compteurs pour le débogage
    console.log(`Nombre de boutiques locales: ${localStores.length}`);
    console.log(`Nombre de boutiques depuis supabase: ${dbStores ? dbStores.length : 0}`);
    
    // Ensemble de suivi pour éviter le traitement en double
    const processedIds = new Set<string>();
    const processedPlaceIds = new Set<string>();
    const processedCoordinates = new Set<string>();
    
    // Fonction pour traiter une boutique et l'ajouter au Map si elle est unique
    const processStore = (store: Store, priority: number) => {
      // Ne pas traiter la même boutique deux fois
      if (processedIds.has(store.id)) return;
      processedIds.add(store.id);
      
      // Déterminer la clé de déduplication
      let key: string;
      
      if (store.placeId && store.placeId.trim() !== '') {
        // Clé basée sur Place ID
        key = `place_${store.placeId}`;
        if (processedPlaceIds.has(store.placeId)) return;
        processedPlaceIds.add(store.placeId);
      }
      else if (store.latitude && store.longitude) {
        // Clé basée sur coordonnées
        const lat = Math.round(store.latitude * 100000) / 100000;
        const lng = Math.round(store.longitude * 100000) / 100000;
        key = `geo_${lat}_${lng}`;
        
        const coordKey = `${lat}_${lng}`;
        if (processedCoordinates.has(coordKey)) return;
        processedCoordinates.add(coordKey);
      }
      else {
        // Clé basée sur nom et adresse
        const normalizedName = store.name.toLowerCase().replace(/\s+/g, '');
        const normalizedAddress = store.address.toLowerCase().replace(/\s+/g, '');
        const normalizedCity = store.city.toLowerCase().replace(/\s+/g, '');
        key = `name_${normalizedName}_addr_${normalizedAddress}_${normalizedCity}`;
      }
      
      // Stocker la boutique dans notre map avec la priorité appropriée
      if (!storeMap[key] || (priority > (storeMap[key]?.id.includes('-') ? 2 : 1))) {
        storeMap[key] = store;
      }
    };
    
    // Traiter d'abord les boutiques de la base de données (priorité plus élevée)
    if (dbStores && dbStores.length > 0) {
      dbStores.forEach(store => processStore(store, 2));
    }
    
    // Puis traiter les boutiques locales (priorité plus basse)
    localStores.forEach(store => processStore(store, 1));
    
    console.log(`Nombre final de boutiques après déduplication: ${Object.keys(storeMap).length}`);
    
    // Convertir notre objet en tableau et trier par distance
    const uniqueStores = Object.values(storeMap) as Store[];
    return getStoresByDistance(userLocation.latitude, userLocation.longitude, uniqueStores);
  }, [userLocation]);
  
  // Charger et combiner les boutiques
  useEffect(() => {
    // Obtenir les boutiques locales
    const localStores = getStoresByDistance(userLocation.latitude, userLocation.longitude);
    
    // Puis combiner avec les boutiques de Supabase et assurer une bonne déduplication
    const combined = combineAndDeduplicateStores(localStores, supabaseStores);
    
    // Debug mode: ajouter des logs détaillés
    if (debugMode) {
      console.log("--- DEBUG: BOUTIQUES COMBINÉES ---");
      combined.forEach((store, index) => {
        console.log(`Boutique #${index + 1}: ${store.name} (${store.id})`);
        console.log(`- Source: ${store.id.includes('-') ? 'Supabase' : 'Local'}`);
        console.log(`- Position: ${store.latitude}, ${store.longitude}`);
        console.log(`- Adresse: ${store.address}, ${store.city}`);
        console.log(`- Place ID: ${store.placeId || 'Non défini'}`);
      });
    }
    
    setCombinedStores(combined);
    
    if (isInitialLoad && !isLoadingStores) {
      setIsInitialLoad(false);
    }
  }, [userLocation, supabaseStores, isLoadingStores, combineAndDeduplicateStores, isInitialLoad, debugMode]);
  
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

  // Ajouter un effet pour recharger les boutiques toutes les 30 secondes
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 30000); // 30 secondes
    
    return () => clearInterval(intervalId);
  }, [refetch]);
    
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
  
  // Fonction pour activer/désactiver le mode debug
  const toggleDebugMode = () => {
    setDebugMode(prev => !prev);
    if (!debugMode) {
      toast({
        title: "Mode debug activé",
        description: "Les détails des boutiques sont affichés dans la console",
      });
      // Force refresh pour afficher les logs
      refetch();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <MapActions />
          <FiltersSheet onApplyFilters={handleApplyFilters} />
          {user && (
            <button 
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded ml-auto"
              onClick={toggleDebugMode}
            >
              {debugMode ? "Debug: ON" : "Debug: OFF"}
            </button>
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
          
          {debugMode && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-xs font-semibold">Mode Debug</p>
              <p className="text-xs">Boutiques Supabase: {supabaseStores.length}</p>
              <p className="text-xs">Boutiques locales: {getStoresByDistance(userLocation.latitude, userLocation.longitude).length}</p>
              <p className="text-xs">Boutiques combinées: {combinedStores.length}</p>
              <button 
                className="text-xs text-blue-600 mt-1"
                onClick={refetch}
              >
                Rafraîchir les données
              </button>
            </div>
          )}
          
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
