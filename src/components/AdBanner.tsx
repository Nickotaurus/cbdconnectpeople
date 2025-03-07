
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AdBannerProps {
  title: string;
  description: string;
  imageUrl: string;
  storeName: string;
  ctaText?: string;
  onCTAClick?: () => void;
  onClose?: () => void;
  isCloseable?: boolean;
}

const AdBanner = ({
  title,
  description,
  imageUrl,
  storeName,
  ctaText = 'En savoir plus',
  onCTAClick,
  onClose,
  isCloseable = true
}: AdBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };
  
  const handleCTAClick = () => {
    toast({
      title: 'Publicité cliquée',
      description: `Vous avez cliqué sur la publicité de ${storeName}`,
    });
    
    if (onCTAClick) {
      onCTAClick();
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <Card className="mb-6 overflow-hidden border-primary/20 bg-gradient-to-r from-background to-secondary/30">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/3 h-32 sm:h-auto">
            <img 
              src={imageUrl} 
              alt={storeName} 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <div className="relative flex-1 p-4">
            {isCloseable && (
              <button 
                onClick={handleClose}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <Info className="h-3 w-3 mr-1" />
              <span>Publicité</span>
            </div>
            
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
            
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-medium">Par {storeName}</span>
              <Button size="sm" onClick={handleCTAClick}>{ctaText}</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdBanner;
