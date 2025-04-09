
import { Store } from '@/types/store';
import StoreCard from '@/components/store-card';
import { Button } from "@/components/ui/button";
import { calculateDistance } from '@/utils/geoUtils';

interface StoreListProps {
  stores: Store[];
  searchTerm: string;
  userLocation: { latitude: number; longitude: number };
  onSelectStore: (store: Store) => void;
}

const StoreList = ({ stores, searchTerm, userLocation, onSelectStore }: StoreListProps) => {
  const filteredStores = searchTerm
    ? stores.filter(store => 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : stores;
  
  if (filteredStores.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {searchTerm 
            ? `Aucune boutique trouvée pour "${searchTerm}"`
            : 'Aucune boutique trouvée dans cette zone'}
        </p>
        {searchTerm && (
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => window.dispatchEvent(new CustomEvent('reset-search'))}
          >
            Réinitialiser la recherche
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
