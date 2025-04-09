
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ExternalLink, Heart } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { ClientUser } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import type { Store } from '@/utils/data';
import { handleImageLoad } from '@/utils/animations';

interface StoreCardProps {
  store: Store;
  distance?: number;
}

const StoreCard = ({ store, distance }: StoreCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { user, updateUserPreferences } = useAuth();
  const { toast } = useToast();
  const clientUser = user as ClientUser;
  
  // Check if store is already in favorites
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    if (user && user.role === 'client') {
      setIsFavorite((clientUser?.favorites || []).includes(store.id));
    }
  }, [user, clientUser?.favorites, store.id]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    handleImageLoad(e);
    setImageLoaded(true);
  };
  
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to store details
    e.stopPropagation();
    
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
    
    try {
      const updatedFavorites = isFavorite
        ? (clientUser.favorites || []).filter(id => id !== store.id)
        : [...(clientUser.favorites || []), store.id];
      
      await updateUserPreferences({ favorites: updatedFavorites });
      setIsFavorite(!isFavorite);
      
      toast({
        title: isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
        description: isFavorite 
          ? `${store.name} a été retiré de vos favoris.` 
          : `${store.name} a été ajouté à vos favoris.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos favoris.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleReview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté en tant que client pour noter cette boutique.",
      });
      return;
    }
    
    if (user.role !== 'client') {
      toast({
        title: "Action non disponible",
        description: "Seuls les clients peuvent laisser des avis.",
      });
      return;
    }
    
    // Google review URL - in real world would be dynamic based on actual Google Place ID
    const googleReviewUrl = `https://search.google.com/local/writereview?placeid=${encodeURIComponent(`place_id_for_${store.name.replace(/\s+/g, '_').toLowerCase()}`)}`;
    
    // Open Google review in a new tab
    window.open(googleReviewUrl, '_blank');
    
    toast({
      title: "Action enregistrée",
      description: "Merci de contribuer. Cette action compte pour vos quêtes !",
    });
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
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge className="bg-primary text-primary-foreground font-medium">
            <Star className="h-3 w-3 mr-1 fill-primary-foreground" /> 
            {store.rating.toFixed(1)}
          </Badge>
          
          {user && user.role === 'client' && (
            <Button 
              size="icon" 
              variant="secondary" 
              className={`h-6 w-6 rounded-full p-1 ${isFavorite ? 'bg-destructive/20' : 'bg-background/80'}`} 
              onClick={toggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
            </Button>
          )}
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
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex-1 gap-1"
              onClick={handleGoogleReview}
            >
              <Star className="h-4 w-4" /> Avis Google
            </Button>
            
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
