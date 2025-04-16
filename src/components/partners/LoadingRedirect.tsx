
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      navigate('/login', { state: { redirectTo: '/add-partner' } });
    }, 2000); // Augmentation du délai pour assurer que la redirection fonctionne
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="container max-w-md mx-auto py-16 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
      <p>Redirection vers la page de connexion...</p>
    </div>
  );
};

export default LoadingRedirect;
