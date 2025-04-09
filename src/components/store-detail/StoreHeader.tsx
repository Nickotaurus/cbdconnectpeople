
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Settings, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Store } from '@/types/store';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ClientUser } from '@/types/auth';

interface StoreHeaderProps {
  store: Store;
  isFavorite: boolean;
  toggleFavorite: () => Promise<void>;
}

const StoreHeader = ({ store, isFavorite, toggleFavorite }: StoreHeaderProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const shareStore = () => {
    if (navigator.share) {
      navigator.share({
        title: store.name,
        text: `Découvrez ${store.name} sur CBD Boutique Finder`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "L'adresse de cette boutique a été copiée dans votre presse-papier."
      });
    }
  };

  return (
    <div className="relative h-64 md:h-96 overflow-hidden">
      {/* Background image */}
      <div 
        className={`absolute inset-0 bg-sage-200 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`}
      />
      <img 
        src={store.imageUrl} 
        alt={store.name} 
        className="w-full h-full object-cover" 
        onLoad={() => setImageLoaded(true)}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent"></div>
      
      {/* Back button */}
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm z-10" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          className={`bg-background/80 backdrop-blur-sm ${isFavorite ? 'border-destructive' : ''}`}
          onClick={toggleFavorite}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-background/80 backdrop-blur-sm"
          onClick={shareStore}
        >
          <Share2 className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-background/80 backdrop-blur-sm"
          asChild
        >
          <Link to={`/store/${store.id}/admin`}>
            <Settings className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default StoreHeader;
