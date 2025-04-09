
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role
      switch (user.role) {
        case 'client':
          navigate('/'); // Clients see the main dashboard with ClientDashboard
          break;
        case 'store':
          navigate('/store-dashboard'); // Stores have their own dashboard
          break;
        case 'partner':
          navigate('/partner/profile'); // Partners have their own profile page
          break;
        default:
          navigate('/');
          break;
      }
    } else if (!isLoading && !user) {
      // If not authenticated, redirect to login
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Redirection en cours...</p>
      </div>
    </div>
  );
};

export default Profile;
