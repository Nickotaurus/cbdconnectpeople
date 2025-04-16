
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Briefcase, Loader } from "lucide-react";
import { PartnerUser } from "@/types/auth";
import PartnerDashboard from "@/components/dashboards/PartnerDashboard";

const PartnerProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("PartnerProfile component loaded, current user:", user);
    
    // If user is not logged in, redirect to login
    if (!user) {
      console.log("No user found, redirecting to login");
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter pour accéder à votre espace partenaire",
      });
      navigate('/login', { state: { redirectTo: '/partner/profile' } });
      return;
    }

    // If user is not a partner, redirect to homepage
    if (user.role !== 'partner') {
      console.log("User is not a partner, redirecting to homepage");
      toast({
        title: "Accès refusé",
        description: "Cette page est réservée aux partenaires CBD",
      });
      navigate('/');
      return;
    }

    // Cast to partner user type for access to partner-specific properties
    const partnerUser = user as PartnerUser;
    console.log("Partner user details:", partnerUser);
    
    // Check for partnerId explicitly
    const hasPartnerId = partnerUser.partnerId !== null && partnerUser.partnerId !== undefined;
    console.log("Has partnerId:", hasPartnerId, "partnerId value:", partnerUser.partnerId);
    
    if (!hasPartnerId) {
      console.log("Partner has no partnerId, redirecting to add-partner");
      navigate('/add-partner', {
        state: { 
          fromRegistration: false,
          partnerCategory: partnerUser.partnerCategory || ''
        }
      });
    } else {
      console.log("Partner has partnerId, showing dashboard");
    }
    
    setIsLoading(false);
  }, [user, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'partner') {
    // Will be redirected by useEffect
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Check if the partner has a partnerId
  const partnerUser = user as PartnerUser;
  const hasPartnerId = partnerUser.partnerId !== null && partnerUser.partnerId !== undefined;
  console.log("Rendering with partnerId:", hasPartnerId, "value:", partnerUser.partnerId);

  return (
    <div className="container mx-auto px-4 py-8">
      {!hasPartnerId ? (
        <div className="text-center max-w-md mx-auto py-12">
          <h1 className="text-2xl font-bold mb-4">Complétez votre profil</h1>
          <p className="text-muted-foreground mb-6">
            Pour être visible sur notre plateforme, veuillez compléter votre profil partenaire.
          </p>
          <Button 
            onClick={() => navigate('/add-partner', {
              state: { 
                fromRegistration: false,
                partnerCategory: partnerUser.partnerCategory || ''
              }
            })} 
            className="flex items-center"
          >
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
