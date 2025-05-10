
import { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { EcommerceStore } from '@/types/ecommerce';

interface EcommerceFavoriteButtonProps {
  store: EcommerceStore;
  isFavorite: boolean;
  onToggleFavorite: (store: EcommerceStore) => Promise<void>;
}

const EcommerceFavoriteButton = ({ 
  store, 
  isFavorite, 
  onToggleFavorite 
}: EcommerceFavoriteButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isToggling, setIsToggling] = useState(false);

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

  if (!user || user.role !== 'client') {
    return null;
  }

  return (
    <Button 
      size="icon" 
      variant="outline" 
      className={`h-8 w-8 p-1 ${isFavorite ? 'border-destructive' : ''}`} 
      onClick={handleFavoriteClick}
      disabled={isToggling}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
    </Button>
  );
};

export default EcommerceFavoriteButton;
