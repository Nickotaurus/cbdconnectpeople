
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Store } from '@/utils/data';
import { handleImageLoad } from '@/utils/animations';

interface StoreCardProps {
  store: Store;
  distance?: number;
}

const StoreCard = ({ store, distance }: StoreCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    handleImageLoad(e);
    setImageLoaded(true);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md group">
      <div className="relative w-full h-48 overflow-hidden">
        <div 
          className={`absolute inset-0 bg-sage-200 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`}
        />
        <img 
          src={store.imageUrl} 
          alt={store.name} 
          className="w-full h-full object-cover img-loading transition-transform duration-500 group-hover:scale-105"
          onLoad={onImageLoad}
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary text-primary-foreground font-medium">
            <Star className="h-3 w-3 mr-1 fill-primary-foreground" /> 
            {store.rating.toFixed(1)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="space-y-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg line-clamp-1">{store.name}</h3>
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
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {store.products.map((product, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {product.category}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button asChild className="flex-1">
              <Link to={`/store/${store.id}`}>
                Voir détails
              </Link>
            </Button>
            
            <Button variant="outline" size="icon" asChild>
              <a href={store.website} target="_blank" rel="noopener noreferrer" aria-label="Visiter le site web">
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
