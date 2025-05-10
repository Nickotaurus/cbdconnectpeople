
import { useState, useEffect } from 'react';
import { ChevronRight, Star, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store } from '@/types/store';
import { fetchReviewsData } from '@/services/googleBusinessService';

interface StoreDetailProps {
  store: Store;
  onClearSelection: () => void;
  onViewDetails: (store: Store) => void;
}

const StoreDetail = ({ store, onClearSelection, onViewDetails }: StoreDetailProps) => {
  const [reviewData, setReviewData] = useState<{ rating?: number, totalReviews?: number } | null>(null);
  
  useEffect(() => {
    const loadReviewData = async () => {
      if (store.placeId) {
        const data = await fetchReviewsData(store.placeId);
        if (data) {
          setReviewData(data);
        }
      }
    };
    
    loadReviewData();
  }, [store.placeId]);

  const displayRating = reviewData?.rating !== undefined ? reviewData.rating : store.rating;
  const displayReviewCount = reviewData?.totalReviews !== undefined ? reviewData.totalReviews : store.reviewCount;

  return (
    <div className="animate-[fade-in_0.3s_ease-out,scale-in_0.3s_ease-out]">
      <div className="bg-background rounded-lg shadow-sm p-4 transition-all duration-300 hover:shadow-md">
        {store.imageUrl && (
          <div className="w-full h-40 mb-3 rounded-md overflow-hidden">
            <img 
              src={store.imageUrl} 
              alt={store.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=CBD";
              }}
            />
          </div>
        )}
        
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{store.name}</h3>
            <p className="text-muted-foreground text-sm">{store.address}, {store.city}</p>
            
            {store.isEcommerce && (
              <div className="flex items-center text-primary text-sm mt-1">
                <Globe className="h-3.5 w-3.5 mr-1" />
                <a 
                  href={store.ecommerceUrl || store.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline line-clamp-1"
                >
                  {(store.ecommerceUrl || store.website).replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
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
            {displayRating}
          </div>
          <span className="text-xs text-muted-foreground">
            {displayReviewCount} avis Google
          </span>
          
          {store.isEcommerce && (
            <Badge variant="outline" className="text-xs">
              E-commerce
            </Badge>
          )}
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
