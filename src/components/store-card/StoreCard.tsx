
import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from '@/types/store';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, Globe } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import GoogleReviewButton from './GoogleReviewButton';
import StoreCardImage from './StoreCardImage';

interface StoreCardProps {
  store: Store;
  showActions?: boolean;
  urlPrefix?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StoreCard = ({ 
  store, 
  showActions = true, 
  urlPrefix = '/store', 
  size = 'md',
  className = ''
}: StoreCardProps) => {
  const imageUrl = store.imageUrl || store.photo_url;
  
  const sizeClasses = {
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-80'
  };
  
  return (
    <Card className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${sizeClasses[size]} ${className}`}>
      <div className="relative h-full flex flex-col">
        <StoreCardImage 
          imageUrl={imageUrl} 
          storeName={store.name}
          isPremium={store.isPremium}
          className="h-1/2 object-cover w-full"
          rating={store.rating}
          storeId={store.id}
        />
        
        <CardContent className="flex-1 flex flex-col p-3 relative">
          {showActions && (
            <div className="absolute top-3 right-3 flex gap-2">
              <FavoriteButton storeId={store.id} size="sm" />
            </div>
          )}
          
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-start mb-1">
                <Link to={`${urlPrefix}/${store.id}`} className="font-semibold text-lg line-clamp-1 hover:underline">
                  {store.name}
                </Link>
                
                {store.rating > 0 && (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-medium text-sm">{store.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center text-muted-foreground text-sm mb-2">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="line-clamp-1">{store.address}, {store.city}</span>
              </div>
            </div>
            
            <div>
              <div className="flex flex-wrap gap-1 mb-2">
                {store.isPremium && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                    Premium
                  </Badge>
                )}
                
                {store.isEcommerce && (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
                    E-commerce
                  </Badge>
                )}
                
                {store.hasGoogleBusinessProfile && (
                  <GoogleReviewButton storeId={store.id} />
                )}
              </div>
              
              {store.isEcommerce && store.ecommerceUrl && (
                <Link to={store.ecommerceUrl.startsWith('http') ? store.ecommerceUrl : `https://${store.ecommerceUrl}`} 
                      className="flex items-center text-primary text-xs hover:underline" 
                      target="_blank"
                      rel="noopener noreferrer">
                  <Globe className="w-3 h-3 mr-1" />
                  <span className="truncate">{store.ecommerceUrl.replace(/^https?:\/\//, '')}</span>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default StoreCard;
