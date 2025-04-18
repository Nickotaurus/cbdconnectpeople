
import { ChevronRight, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Store } from '@/types/store';

interface StoreDetailProps {
  store: Store;
  onClearSelection: () => void;
  onViewDetails: (store: Store) => void;
}

const StoreDetail = ({ store, onClearSelection, onViewDetails }: StoreDetailProps) => {
  return (
    <div className="animate-[fade-in_0.3s_ease-out,scale-in_0.3s_ease-out]">
      <div className="bg-background rounded-lg shadow-sm p-4 transition-all duration-300 hover:shadow-md">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{store.name}</h3>
            <p className="text-muted-foreground text-sm">{store.address}, {store.city}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 transition-transform duration-200 hover:translate-x-1"
            onClick={() => onViewDetails(store)}
          >
            Détails
            <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium flex items-center">
            <Star className="h-3 w-3 mr-1 fill-primary" />
            {store.rating}
          </div>
          <span className="text-xs text-muted-foreground">
            {store.reviewCount} avis
          </span>
        </div>
        
        <p className="text-sm mb-3 line-clamp-2">
          {store.description}
        </p>
        
        <div>
          <h4 className="text-sm font-medium mb-1">Produits proposés</h4>
          <div className="flex flex-wrap gap-1">
            {store.products.map((product, index) => (
              <span 
                key={index} 
                className="bg-secondary px-2 py-0.5 rounded text-xs animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {product.category}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <Button 
        variant="link" 
        onClick={onClearSelection} 
        className="p-0 h-auto text-sm mt-2 transition-all duration-200 hover:translate-x-[-2px]"
      >
        Voir toutes les boutiques
      </Button>
    </div>
  );
};

export default StoreDetail;
