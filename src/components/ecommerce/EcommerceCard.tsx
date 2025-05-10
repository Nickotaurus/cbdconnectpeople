
import { EcommerceStore } from '@/types/ecommerce';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import EcommerceHeader from './EcommerceHeader';
import EcommerceRating from './EcommerceRating';
import EcommerceSpecialties from './EcommerceSpecialties';
import EcommerceShipping from './EcommerceShipping';
import EcommerceFooter from './EcommerceFooter';
import { useReviewData } from './useReviewData';

interface EcommerceCardProps {
  store: EcommerceStore;
  isFavorite: boolean;
  onToggleFavorite: (store: EcommerceStore) => Promise<void>;
}

const EcommerceCard = ({ store, isFavorite, onToggleFavorite }: EcommerceCardProps) => {
  const { displayRating, displayReviewCount, isLoadingReviews, isGoogleReview } = useReviewData(store);

  return (
    <Card className={`overflow-hidden ${store.isPremium ? 'border-2 border-primary' : ''}`}>
      <div className="h-24 flex items-center justify-center p-4 bg-secondary/30">
        <img 
          src={store.logo} 
          alt={store.name} 
          className="max-h-full max-w-full object-contain"
        />
      </div>
      
      <CardHeader className="pb-2">
        <EcommerceHeader
          store={store}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      </CardHeader>
      
      <CardContent className="pb-2">
        <EcommerceRating
          rating={displayRating}
          reviewCount={displayReviewCount}
          isLoadingReviews={isLoadingReviews}
          isGoogleReview={isGoogleReview}
        />
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {store.description}
        </p>
        
        <EcommerceSpecialties specialties={store.specialties} />
        
        <EcommerceShipping shippingCountries={store.shippingCountries} />
      </CardContent>
      
      <CardFooter className="pt-2">
        <EcommerceFooter url={store.url} />
      </CardFooter>
    </Card>
  );
};

export default EcommerceCard;
