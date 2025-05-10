
import { Store } from '@/types/store';
import { Badge } from "@/components/ui/badge";
import { Star, Globe } from 'lucide-react';
import { calculateDistance } from '@/utils/geoUtils';

interface StoreListProps {
  stores: Store[];
  searchTerm: string;
  userLocation: { latitude: number, longitude: number };
  onSelectStore: (store: Store) => void;
  activeFilters: {
    categories: string[];
    minRating: number;
    maxDistance: number | null;
  };
  isLoading: boolean;
}

const StoreList = ({ 
  stores, 
  searchTerm, 
  userLocation, 
  onSelectStore,
  activeFilters,
  isLoading
}: StoreListProps) => {
  // Si en chargement, afficher un indicateur
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-background rounded-lg p-4 border">
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-muted rounded-md"></div>
              <div className="flex-1">
                <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {searchTerm ? 
            `Aucune boutique trouvée pour "${searchTerm}"` : 
            "Aucune boutique ne correspond aux critères sélectionnés"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stores.map(store => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          store.latitude,
          store.longitude
        );
        
        return (
          <div 
            key={store.id} 
            onClick={() => onSelectStore(store)} 
            className="flex gap-3 p-3 bg-background rounded-lg border cursor-pointer hover:bg-accent transition-colors duration-200"
          >
            <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
              {store.imageUrl ? (
                <img 
                  src={store.imageUrl} 
                  alt={store.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=CBD";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xl font-bold">
                  {store.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className="font-medium truncate">{store.name}</h3>
                <div className="flex items-center gap-1">
                  {store.rating > 0 && (
                    <div className="flex items-center px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs">
                      <Star className="w-3 h-3 mr-0.5 fill-primary" />
                      {store.rating.toFixed(1)}
                    </div>
                  )}
                  
                  {store.isEcommerce && (
                    <Badge variant="outline" className="text-xs">
                      E-commerce
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground truncate">{store.address}</p>
              
              {store.isEcommerce && (
                <div className="flex items-center text-primary text-xs mt-0.5">
                  <Globe className="w-3 h-3 mr-0.5" />
                  <span className="truncate">{(store.ecommerceUrl || store.website).replace(/^https?:\/\//, '')}</span>
                </div>
              )}
              
              {distance !== undefined && (
                <p className="text-xs text-primary font-medium mt-1">
                  à {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`}
                </p>
              )}
              
              {store.products && store.products.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {store.products.slice(0, 2).map((product, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs px-1.5 py-0">
                      {product.category}
                    </Badge>
                  ))}
                  {store.products.length > 2 && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                      +{store.products.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StoreList;
