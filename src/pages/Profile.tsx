
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [redirectionAttempted, setRedirectionAttempted] = useState(false);

  useEffect(() => {
    console.log("Profile page - user:", user, "isLoading:", isLoading, "redirectionAttempted:", redirectionAttempted);
    
    if (!isLoading && !redirectionAttempted) {
      setRedirectionAttempted(true);
      
      if (user) {
        console.log("User authenticated, redirecting based on role:", user.role);
        
        // Redirection immédiate sans délai
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
            console.log("Partner user detected, redirecting to partner profile");
            navigate('/partner/profile');
            break;
          default:
            console.log("Unknown role, redirecting to main page");
            navigate('/');
            break;
        }
      } else {
        console.log("No authenticated user, redirecting to login");
        // If not authenticated, redirect to login
        navigate('/login');
      }
    }
  }, [user, isLoading, navigate, redirectionAttempted]);

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
