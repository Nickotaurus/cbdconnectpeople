
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { PartnerUser } from "@/types/auth";
import PartnerDashboard from "@/components/dashboards/PartnerDashboard";

const PartnerProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter pour accéder à votre espace partenaire",
      });
      navigate('/login', { state: { redirectTo: '/partner/profile' } });
      return;
    }

    // If user is not a partner, redirect to homepage
    if (user.role !== 'partner') {
      toast({
        title: "Accès refusé",
        description: "Cette page est réservée aux partenaires CBD",
      });
      navigate('/');
      return;
    }

    // If user is a partner without a partnerId, redirect to add-partner
    const partnerUser = user as PartnerUser;
    console.log("Partner user:", partnerUser);
    if (user.role === 'partner' && !partnerUser.partnerId) {
      console.log("Partner has no partnerId, redirecting to add-partner");
      navigate('/add-partner', {
        state: { 
          fromRegistration: false,
          partnerCategory: partnerUser.partnerCategory || ''
        }
      });
    }
  }, [user, navigate, toast]);

  if (!user || user.role !== 'partner') {
    return null; // Will be redirected by useEffect
  }

  // Check if the partner has a partnerId
  const partnerUser = user as PartnerUser;
  const hasPartnerId = partnerUser.partnerId;
  console.log("Has partnerId:", hasPartnerId);

  return (
    <div className="container mx-auto px-4 py-8">
      {!hasPartnerId ? (
        <div className="text-center max-w-md mx-auto py-12">
          <h1 className="text-2xl font-bold mb-4">Complétez votre profil</h1>
          <p className="text-muted-foreground mb-6">
            Pour être visible sur notre plateforme, veuillez compléter votre profil partenaire.
          </p>
          <Button onClick={() => navigate('/add-partner')} className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            Référencer mon activité
          </Button>
        </div>
      ) : (
        <PartnerDashboard />
      )}
    </div>
  );
};

export default PartnerProfile;
