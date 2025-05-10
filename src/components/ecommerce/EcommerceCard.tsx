
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { ClientUser } from '@/types/auth';
import { EcommerceStore } from '@/types/ecommerce';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, ExternalLink, Star, Heart } from 'lucide-react';
import { fetchReviewsData } from '@/services/googleBusinessService';

interface EcommerceCardProps {
  store: EcommerceStore;
  isFavorite: boolean;
  onToggleFavorite: (store: EcommerceStore) => Promise<void>;
}

const EcommerceCard = ({ store, isFavorite, onToggleFavorite }: EcommerceCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isToggling, setIsToggling] = useState(false);
  const [reviewData, setReviewData] = useState<{ rating?: number, totalReviews?: number } | null>(null);
  
  // Récupérer les avis Google si la boutique e-commerce a un placeId
  useEffect(() => {
    const loadReviewData = async () => {
      // Pour les boutiques physiques avec un e-commerce, elles peuvent avoir un place_id
      if (store.googlePlaceId) {
        const data = await fetchReviewsData(store.googlePlaceId);
        if (data) {
          setReviewData(data);
        }
      }
    };
    
    if (store.isPhysicalStore && store.googlePlaceId) {
      loadReviewData();
    }
  }, [store.googlePlaceId, store.isPhysicalStore]);

  const displayRating = reviewData?.rating !== undefined ? reviewData.rating : store.rating;
  const displayReviewCount = reviewData?.totalReviews !== undefined ? reviewData.totalReviews : store.reviewCount;
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des favoris.",
      });
      return;
    }
    
    if (user.role !== 'client') {
      toast({
        title: "Action non disponible",
        description: "Seuls les clients peuvent ajouter des favoris.",
      });
      return;
    }

    setIsToggling(true);
    try {
      await onToggleFavorite(store);
    } finally {
      setIsToggling(false);
    }
  };

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
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{store.name}</CardTitle>
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
            
            {user && user.role === 'client' && (
              <Button 
                size="icon" 
                variant="outline" 
                className={`h-8 w-8 p-1 ${isFavorite ? 'border-destructive' : ''}`} 
                onClick={handleFavoriteClick}
                disabled={isToggling}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
              </Button>
            )}
          </div>
        </div>
        <CardDescription className="flex items-center">
          <Globe className="h-3.5 w-3.5 mr-1" />
          <a 
            href={store.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline text-primary"
          >
            {store.url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '')}
          </a>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="mb-3">
          {renderStars(displayRating)}
          <p className="text-xs text-muted-foreground mt-1">
            {displayReviewCount} avis {store.isPhysicalStore && reviewData ? 'Google' : 'clients'}
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {store.description}
        </p>
        
        <div className="mb-3">
          <h4 className="text-xs font-medium mb-1">Spécialités:</h4>
          <div className="flex flex-wrap gap-1">
            {store.specialties.map(specialty => (
              <Badge key={specialty} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-medium mb-1">Livraison:</h4>
          <p className="text-xs text-muted-foreground">
            {store.shippingCountries.join(', ')}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button className="w-full gap-2" asChild>
          <a href={store.url} target="_blank" rel="noopener noreferrer">
            Visiter le site <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EcommerceCard;
