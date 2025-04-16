
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log("Profile page - user:", user, "isLoading:", isLoading);
    
    if (!isLoading) {
      if (user) {
        console.log("User authenticated, redirecting based on role:", user.role);
        // Redirect based on user role
        switch (user.role) {
          case 'client':
            console.log("Client user detected, redirecting to main dashboard");
            navigate('/'); // Clients see the main dashboard with ClientDashboard
            break;
          case 'store':
            console.log("Store user detected, redirecting to store dashboard");
            navigate('/store-dashboard'); // Stores have their own dashboard
            break;
          case 'partner':
            console.log("Partner user detected, redirecting to partner profile");
            navigate('/partner/profile'); // Partners have their own profile page
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
  }, [user, isLoading, navigate]);

  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">
          {isLoading ? "Vérification de l'authentification..." : "Redirection en cours..."}
        </p>
        {isLoading && <p className="text-sm text-muted-foreground mt-2">Veuillez patienter...</p>}
      </div>
    </div>
  );
};

export default Profile;
