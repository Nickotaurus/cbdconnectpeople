
import { Link } from 'react-router-dom';
import { MapPin, ExternalLink, Globe } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Store } from '@/types/store';
import StoreCardImage from './StoreCardImage';
import GoogleReviewButton from './GoogleReviewButton';

interface StoreCardProps {
  store: Store;
  distance?: number;
}

const StoreCard = ({ store, distance }: StoreCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md group">
      <StoreCardImage 
        imageUrl={store.imageUrl} 
        storeName={store.name} 
        rating={store.rating} 
        storeId={store.id} 
      />
      
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="space-y-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg line-clamp-1">{store.name}</h3>
              
              {store.isPremium && (
                <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                  Premium
                </Badge>
              )}
            </div>
            
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span className="line-clamp-1">{store.address}, {store.city}</span>
            </div>
            
            {distance !== undefined && (
              <p className="text-sm text-primary font-medium">
                à {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`}
              </p>
            )}
            
            {store.isEcommerce && (
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <Globe className="h-3.5 w-3.5 mr-1" />
                <a 
                  href={store.ecommerceUrl || store.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline line-clamp-1"
                >
                  {(store.ecommerceUrl || store.website).replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {store.products.map((product, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {product.category}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2 mt-3">
            <GoogleReviewButton 
              store={store} 
              variant="secondary"
              size="sm"
              className="flex-1 gap-1"
            />
            
            <Button asChild className="flex-1">
              <Link to={`/store/${store.id}`}>
                Voir détails
              </Link>
            </Button>
            
            <Button variant="outline" size="icon" asChild>
              <a 
                href={store.isEcommerce ? (store.ecommerceUrl || store.website) : store.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Visiter le site web"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreCard;
