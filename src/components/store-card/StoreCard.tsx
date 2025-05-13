
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import StoreCardImage from './StoreCardImage';
import GoogleReviewButton from './GoogleReviewButton';
import { Store } from '@/types/store';

interface StoreCardProps {
  store: Store;
  className?: string;
  onClick?: () => void;
}

const StoreCard = ({ store, className = "", onClick }: StoreCardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const imageUrl = store.photo_url || store.imageUrl || 'https://via.placeholder.com/300x200?text=CBD+Shop';
  
  return (
    <Card className={`overflow-hidden group transition-all hover:shadow-md ${className}`}>
      <Link to={`/store/${store.id}`} onClick={handleClick}>
        <StoreCardImage 
          imageUrl={imageUrl}
          storeName={store.name}
          altText={`${store.name} - CBD Shop in ${store.city}`}
          rating={store.rating}
          storeId={store.id}
          isPremium={store.isPremium}
        />
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium line-clamp-1">{store.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{store.city}</p>
            </div>
            {store.placeId && <GoogleReviewButton storeId={store.placeId} />}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default StoreCard;
