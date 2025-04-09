
import { RankedItem } from '@/data/rankingsData';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, Globe, ExternalLink, Star } from 'lucide-react';
import StarRating from './StarRating';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PromoCodePopover from './PromoCodePopover';

interface RankingItemCardProps {
  item: RankedItem;
  index: number;
}

const RankingItemCard = ({ item, index }: RankingItemCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Google review URL - in real world would be dynamic based on actual Google Place ID
  const googleReviewUrl = `https://search.google.com/local/writereview?placeid=${encodeURIComponent(`place_id_for_${item.name.replace(/\s+/g, '_').toLowerCase()}`)}`;

  const handleReviewClick = () => {
    if (user && user.role === 'client') {
      // Open Google review in new tab
      window.open(googleReviewUrl, '_blank');
      
      // Notify user
      toast({
        title: "Action enregistrée",
        description: "Merci de contribuer. Cette action compte pour vos quêtes !",
      });
    } else {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté en tant que client pour noter une boutique.",
      });
    }
  };

  return (
    <Card 
      className={`overflow-hidden ${item.sponsored ? 'border-amber-300 dark:border-amber-500 shadow-md' : ''}`}
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-1/4 h-48 md:h-auto">
          <span className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
            {index + 1}
          </span>
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          {item.sponsored && (
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-gradient-to-r from-amber-400/90 to-amber-600/90 text-white border-0">
                Sponsorisé
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="flex-1 p-6">
          <div className="mb-3">
            <h3 className="text-xl font-bold mb-1">{item.name}</h3>
            {(item.location || item.url) && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                {item.location && (
                  <span className="flex items-center gap-1">
                    <Store className="h-3.5 w-3.5" />
                    {item.location}
                  </span>
                )}
                
                {item.url && (
                  <span className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" />
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline text-primary"
                    >
                      {item.url.replace(/(^\w+:|^)\/\//, '')}
                    </a>
                  </span>
                )}
              </p>
            )}
            
            <div className="mb-3">
              <StarRating rating={item.rating} />
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            {item.description}
          </p>
          
          <div className="flex flex-wrap gap-2 justify-between">
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-1"
              onClick={handleReviewClick}
            >
              <Star className="h-4 w-4" />
              Laisser un avis Google
            </Button>
            
            <div className="flex gap-2">
              <PromoCodePopover itemName={item.name} itemType={item.category} />
              
              <Button variant="default" size="sm" className="gap-1">
                {item.category === 'boutique' ? 'Voir la boutique' : 
                 item.category === 'ecommerce' ? (
                   <>
                     Visiter le site <ExternalLink className="h-4 w-4" />
                   </>
                 ) : 'Voir le détail'}
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default RankingItemCard;
