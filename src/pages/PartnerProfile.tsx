
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Loader } from "lucide-react";
import { PartnerUser } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import PartnerDashboard from "@/components/dashboards/PartnerDashboard";

const PartnerProfile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [partnerData, setPartnerData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("PartnerProfile component loaded, current user:", user);
    
    // If user is not logged in, redirect to login
    if (!isLoading && !user) {
      console.log("No user found, redirecting to login");
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter pour accéder à votre espace partenaire",
      });
      navigate('/login', { state: { redirectTo: '/partner/profile' } });
      return;
    }

    // If user is not a partner, redirect to homepage
    if (!isLoading && user && user.role !== 'partner') {
      console.log("User is not a partner, redirecting to homepage");
      toast({
        title: "Accès refusé",
        description: "Cette page est réservée aux partenaires CBD",
      });
      navigate('/');
      return;
    }

    // Check partner profile and refresh data
    const fetchPartnerData = async () => {
      if (!user) return;
      
      try {
        setIsLoadingProfile(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching partner profile:", error);
          setError("Impossible de charger votre profil partenaire");
          return;
        }

        console.log("Partner data from database:", data);
        setPartnerData(data);

        // If the user is a partner but doesn't have a complete profile, show toast notification
        if (data && (data.partner_id === null || data.partner_id === undefined)) {
          toast({
            title: "Profil incomplet",
            description: "Veuillez compléter votre profil partenaire pour être visible sur la plateforme",
          });
        }
      } catch (err) {
        console.error("Error in partner data fetch:", err);
        setError("Une erreur est survenue lors du chargement de votre profil");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (user) {
      fetchPartnerData();
    }
  }, [user, isLoading, navigate, toast]);

  // Loading state for the entire page
  if (isLoading || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If the partner has no partnerId, show the profile creation suggestion
  const partnerUser = user as PartnerUser;
  const hasCompleteProfile = partnerData?.partner_id !== null && partnerData?.partner_id !== undefined;

  if (!hasCompleteProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
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
      </div>
    );
  }

  // If everything is loaded and the partner has a profile, show the dashboard
  return (
    <div className="container mx-auto px-4 py-8">
      <PartnerDashboard />
    </div>
  );
};

export default PartnerProfile;
