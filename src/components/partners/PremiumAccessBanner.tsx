
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Lock } from 'lucide-react';

interface PremiumAccessBannerProps {
  isProfessional: boolean;
  hasPremium: boolean;
}

const PremiumAccessBanner = ({ isProfessional, hasPremium }: PremiumAccessBannerProps) => {
  const navigate = useNavigate();
  
  if (!isProfessional) {
    return (
      <div className="bg-secondary/30 rounded-lg p-4 mb-6 text-center">
        <p className="text-sm">
          Vous êtes un professionnel ? <a href="/register" className="text-primary font-medium hover:underline">Créez un compte professionnel</a> pour contacter directement les partenaires.
        </p>
      </div>
    );
  }
  
  if (!hasPremium) {
    return (
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <Lock className="text-primary h-10 w-10" />
          <div>
            <h3 className="font-medium">Accès aux coordonnées des partenaires</h3>
            <p className="text-sm text-muted-foreground">
              Accédez aux coordonnées de nos partenaires avec un abonnement premium.
            </p>
          </div>
          <Button 
            className="ml-auto"
            onClick={() => navigate('/partners/subscription')}
          >
            Débloquer l'accès
          </Button>
        </div>
      </div>
    );
  }
  
  return null;
};

export default PremiumAccessBanner;
