
import { useState } from 'react';
import { Star } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { handleImageLoad } from '@/utils/animations';
import FavoriteButton from './FavoriteButton';
import { useAuth } from '@/contexts/auth';

interface StoreCardImageProps {
  imageUrl: string;
  storeName: string;
  rating: number;
  storeId: string;
}

const StoreCardImage = ({ imageUrl, storeName, rating, storeId }: StoreCardImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { user } = useAuth();

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    handleImageLoad(e);
    setImageLoaded(true);
  };
  
  const onImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="relative w-full h-48 overflow-hidden">
      <div 
        className={`absolute inset-0 bg-sage-200 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`}
      />
      
      {!imageError ? (
        <img 
          src={imageUrl} 
          alt={storeName} 
          className="w-full h-full object-cover img-loading transition-transform duration-500 group-hover:scale-105"
          onLoad={onImageLoad}
          onError={onImageError}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/70 font-bold text-4xl">
          {storeName.charAt(0)}
        </div>
      )}
      
      <div className="absolute top-2 right-2 flex gap-2">
        <Badge className="bg-primary text-primary-foreground font-medium">
          <Star className="h-3 w-3 mr-1 fill-primary-foreground" /> 
          {rating.toFixed(1)}
        </Badge>
        
        {user && user.role === 'client' && (
          <FavoriteButton 
            storeId={storeId}
            size="icon"
            className="h-6 w-6 rounded-full p-1"
          />
        )}
      </div>
    </div>
  );
};

export default StoreCardImage;
