
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Store } from '@/types/store';

interface GoogleReviewButtonProps {
  store: Store;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const GoogleReviewButton = ({ 
  store, 
  variant = "secondary",
  size = "sm",
  className = ""
}: GoogleReviewButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
    <Button 
      variant={variant}
      size={size}
      className={`gap-1 ${className}`}
      onClick={handleGoogleReview}
    >
      <Star className="h-4 w-4" /> Avis Google
    </Button>
  );
};

export default GoogleReviewButton;
