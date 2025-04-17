
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PartnersHeaderProps {
  isProfessional: boolean;
  isLoggedIn: boolean;
}

const PartnersHeader = ({ isProfessional, isLoggedIn }: PartnersHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold mb-2">Partenaires CBD Connect</h1>
      <p className="text-muted-foreground mb-6">
        {isProfessional 
          ? "Connectez-vous avec tous les partenaires de l'écosystème CBD" 
          : "Découvrez les partenaires qui font vivre l'écosystème CBD en France"}
      </p>
      {!isLoggedIn && (
        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90"
          onClick={() => navigate('/register?role=partner')}
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Référencer mon activité gratuitement
        </Button>
      )}
    </div>
  );
};

export default PartnersHeader;
