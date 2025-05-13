
import { useState } from 'react';
import { Store } from '@/types/partners/store';
import StoreCardImage from './StoreCardImage';

interface StoreCardProps {
  store: Store;
  onClick?: () => void;
  showImage?: boolean;
  compact?: boolean;
}

const StoreCard = ({ store, onClick, showImage = true, compact = false }: StoreCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const truncateDescription = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div 
      className={`group bg-background border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${compact ? 'h-full' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showImage && (
        <StoreCardImage 
          imageUrl={store.imageUrl || store.photo_url || 'https://via.placeholder.com/300x200?text=CBD+Shop'} 
          storeName={store.name}
          rating={store.rating || 0}
          storeId={store.id}
        />
      )}
      
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1">{store.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{store.address}</p>
        
        {!compact && store.description && (
          <p className="text-sm line-clamp-2">{truncateDescription(store.description, 120)}</p>
        )}
      </div>
    </div>
  );
};

export default StoreCard;
