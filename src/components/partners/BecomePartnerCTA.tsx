
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const BecomePartnerCTA = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-12 bg-primary/5 border border-primary/20 rounded-xl p-8">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="md:w-2/3">
          <h2 className="text-2xl font-semibold mb-4">Vous proposez des services pour les professionnels du CBD ?</h2>
          <p className="mb-6">
            Rejoignez notre annuaire de partenaires et connectez-vous avec des boutiques et producteurs de CBD à la recherche de vos services.
            Profitez d'une visibilité ciblée auprès des acteurs du secteur.
          </p>
          <Button onClick={() => navigate('/register?role=partner')}>
            <Briefcase className="mr-2 h-4 w-4" />
            Devenir partenaire
          </Button>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
            <Briefcase className="h-16 w-16 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomePartnerCTA;
