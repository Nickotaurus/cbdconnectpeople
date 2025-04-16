
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { PartnerUser } from '@/types/auth';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log("Profile page - user:", user, "isLoading:", isLoading);
    
    // Attendre que le statut d'authentification soit chargé
    if (!isLoading) {
      if (!user) {
        // Si l'utilisateur n'est pas connecté, redirection vers la page de login
        console.log("No authenticated user, redirecting to login");
        navigate('/login');
        return;
      }
      
      // Si l'utilisateur est connecté, redirection basée sur son rôle
      console.log("User authenticated, redirecting based on role:", user.role);
      
      switch (user.role) {
        case 'client':
          console.log("Client user detected, redirecting to main dashboard");
          navigate('/');
          break;
        case 'store':
          console.log("Store user detected, redirecting to store dashboard");
          navigate('/store-dashboard');
          break;
        case 'partner':
          // Vérification spécifique pour les partenaires
          const partnerUser = user as PartnerUser;
          if (partnerUser.partnerId === null) {
            console.log("Partner has no partnerId, redirecting to add-partner");
            navigate('/add-partner', {
              state: { 
                fromRegistration: false,
                partnerCategory: partnerUser.partnerCategory || ''
              }
            });
          } else {
            console.log("Partner has partnerId, redirecting to partner profile");
            navigate('/partner/profile');
          }
          break;
        default:
          console.log("Unknown role, redirecting to main page");
          navigate('/');
          break;
      }
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">
          {isLoading ? "Vérification de l'authentification..." : "Redirection en cours..."}
        </p>
        {isLoading && <p className="text-sm text-muted-foreground mt-2">Veuillez patienter...</p>}
        <p className="text-sm text-muted-foreground mt-2">
          État: {isLoading ? "Chargement" : user ? `Connecté (${user.role})` : "Non connecté"}
        </p>
      </div>
    </div>
  );
};

export default Profile;
