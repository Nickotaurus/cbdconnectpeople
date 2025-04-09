
import { Store } from '@/types/store';
import StoreCard from '@/components/store-card';
import { Button } from "@/components/ui/button";
import { calculateDistance } from '@/utils/geoUtils';

interface StoreListProps {
  stores: Store[];
  searchTerm: string;
  userLocation: { latitude: number; longitude: number };
  onSelectStore: (store: Store) => void;
  activeFilters?: {
    categories: string[];
    minRating: number;
    maxDistance: number | null;
  };
}

const StoreList = ({ stores, searchTerm, userLocation, onSelectStore, activeFilters }: StoreListProps) => {
  // Filter stores based on search term and active filters
  let filteredStores = stores;
  
  // Apply search term filter
  if (searchTerm) {
    filteredStores = filteredStores.filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Apply category filter
  if (activeFilters?.categories && activeFilters.categories.length > 0) {
    filteredStores = filteredStores.filter(store => 
      store.products.some(product => 
        activeFilters.categories.includes(product.category)
      )
    );
  }
  
  // Apply rating filter
  if (activeFilters?.minRating && activeFilters.minRating > 0) {
    filteredStores = filteredStores.filter(store => 
      store.rating >= activeFilters.minRating
    );
  }
  
  // Apply distance filter
  if (activeFilters?.maxDistance) {
    filteredStores = filteredStores.filter(store => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        store.latitude,
        store.longitude
      );
      return distance <= activeFilters.maxDistance!;
    });
  }
  
  if (filteredStores.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {searchTerm 
            ? `Aucune boutique trouvée pour "${searchTerm}"`
            : 'Aucune boutique ne correspond à vos critères de filtrage'}
        </p>
        {(searchTerm || (activeFilters && (
          activeFilters.categories.length > 0 || 
          activeFilters.minRating > 0 || 
          activeFilters.maxDistance !== null
        ))) && (
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => window.dispatchEvent(new CustomEvent('reset-filters'))}
          >
            Réinitialiser les filtres
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredStores.map(store => (
        <div 
          key={store.id} 
          className="cursor-pointer"
          onClick={() => onSelectStore(store)}
        >
          <StoreCard 
            store={store} 
            distance={calculateDistance(
              userLocation.latitude, 
              userLocation.longitude, 
              store.latitude, 
              store.longitude
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default StoreList;
