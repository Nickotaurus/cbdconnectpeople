import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/auth';
import { ClientUser } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

interface FavoriteButtonProps {
  storeId: string;
  isFavoriteInitial?: boolean;
  onToggle?: (isFavorite: boolean) => void;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const FavoriteButton = ({ 
  storeId, 
  isFavoriteInitial = false, 
  onToggle,
  size = "icon",
  className = ""
}: FavoriteButtonProps) => {
  const { user, updateUserPreferences } = useAuth();
  const { toast } = useToast();
  const clientUser = user as ClientUser;
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);
  
  useEffect(() => {
    if (user && user.role === 'client') {
      setIsFavorite((clientUser?.favorites || []).includes(storeId));
    }
  }, [user, clientUser?.favorites, storeId]);

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
        ? (clientUser.favorites || []).filter(id => id !== storeId)
        : [...(clientUser.favorites || []), storeId];
      
      await updateUserPreferences({ favorites: updatedFavorites });
      setIsFavorite(!isFavorite);
      
      if (onToggle) {
        onToggle(!isFavorite);
      }
      
      toast({
        title: isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
        description: isFavorite 
          ? `Cette boutique a été retirée de vos favoris.` 
          : `Cette boutique a été ajoutée à vos favoris.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos favoris.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      size={size} 
      variant="secondary" 
      className={`${isFavorite ? 'bg-destructive/20' : 'bg-background/80'} ${className}`} 
      onClick={toggleFavorite}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
    </Button>
  );
};

export default FavoriteButton;
