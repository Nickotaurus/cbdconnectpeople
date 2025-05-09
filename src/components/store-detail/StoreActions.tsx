
import { MapPin, Phone, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Store } from '@/types/store';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface StoreActionsProps {
  store: Store;
  isFavorite: boolean;
  toggleFavorite: () => Promise<void>;
}

const StoreActions = ({ store, isFavorite, toggleFavorite }: StoreActionsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleGoogleReview = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour laisser un avis.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    // Google review URL - in real world would be dynamic based on actual Google Place ID
    const googleReviewUrl = `https://search.google.com/local/writereview?placeid=${encodeURIComponent(`place_id_for_${store.name.replace(/\s+/g, '_').toLowerCase()}`)}`;
    
    // Open Google review in a new tab
    window.open(googleReviewUrl, '_blank');
    
    toast({
      title: "Action enregistrée",
      description: "Merci de contribuer à la communauté professionnelle du CBD.",
    });
  };

  return (
    <div className="flex flex-col gap-2 mt-4 md:mt-0">
      <Button className="w-full md:w-auto">
        <MapPin className="mr-2 h-4 w-4" />
        Itinéraire
      </Button>
      <Button variant="outline" asChild className="w-full md:w-auto">
        <a href={`tel:${store.phone}`}>
          <Phone className="mr-2 h-4 w-4" />
          Appeler
        </a>
      </Button>
      <Button 
        variant="secondary" 
        onClick={handleGoogleReview} 
        className="w-full md:w-auto"
      >
        <Star className="mr-2 h-4 w-4" />
        Laisser un avis Google
      </Button>
    </div>
  );
};

export default StoreActions;
