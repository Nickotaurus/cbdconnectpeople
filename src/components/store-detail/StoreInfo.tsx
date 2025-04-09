
import { Star, MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Store } from '@/types/store';

interface StoreInfoProps {
  store: Store;
}

const StoreInfo = ({ store }: StoreInfoProps) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">{store.name}</h1>
        {store.isPremium && (
          <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
            Premium
          </Badge>
        )}
      </div>
      
      <div className="flex items-center mt-2">
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="ml-1 font-medium">{store.rating}</span>
        </div>
        <span className="mx-2 text-muted-foreground">•</span>
        <span className="text-muted-foreground">{store.reviewCount} avis</span>
      </div>
      
      <div className="flex items-center mt-2 text-muted-foreground">
        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
        <span>{store.address}, {store.postalCode} {store.city}</span>
      </div>
    </div>
  );
};

export default StoreInfo;
