
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const EcommerceRegisterCTA = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-8 text-center">
      <h2 className="text-xl font-semibold mb-4">Vous possédez un e-commerce CBD ?</h2>
      <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
        Référencez gratuitement votre boutique en ligne et profitez d'une visibilité auprès de notre communauté
      </p>
      <Button 
        className="gap-2"
        onClick={() => navigate('/register?role=store')}
      >
        Référencer mon e-commerce
      </Button>
    </div>
  );
};

export default EcommerceRegisterCTA;
