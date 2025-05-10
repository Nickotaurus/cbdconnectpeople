
import { Globe } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import EcommerceFavoriteButton from './EcommerceFavoriteButton';
import { EcommerceStore } from '@/types/ecommerce';

interface EcommerceHeaderProps {
  store: EcommerceStore;
  isFavorite: boolean;
  onToggleFavorite: (store: EcommerceStore) => Promise<void>;
}

const EcommerceHeader = ({ store, isFavorite, onToggleFavorite }: EcommerceHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold">{store.name}</h3>
        <div className="flex items-center">
          <Globe className="h-3.5 w-3.5 mr-1" />
          <a 
            href={store.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline text-primary"
          >
            {store.url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '')}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {store.isPremium && (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Premium
          </Badge>
        )}
        
        {store.isPhysicalStore && (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            Boutique physique
          </Badge>
        )}
        
        <EcommerceFavoriteButton 
          store={store} 
          isFavorite={isFavorite} 
          onToggleFavorite={onToggleFavorite} 
        />
      </div>
    </div>
  );
};

export default EcommerceHeader;
