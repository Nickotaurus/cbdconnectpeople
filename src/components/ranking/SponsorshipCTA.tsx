
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const SponsorshipCTA = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-16 bg-gradient-to-r from-primary/5 to-amber-50 dark:from-primary/10 dark:to-amber-900/10 rounded-xl p-8 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          Vous souhaitez apparaître dans nos classements ?
        </h2>
        <p className="text-muted-foreground mb-6">
          Proposez vos produits ou services pour nos classements et gagnez en visibilité auprès de notre communauté.
        </p>
        <Button 
          variant="default" 
          size="lg" 
          className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
          onClick={() => navigate("/partners/subscription")}
        >
          Devenir partenaire
        </Button>
      </div>
    </div>
  );
};

export default SponsorshipCTA;
