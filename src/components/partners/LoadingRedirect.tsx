
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      navigate('/login', { state: { redirectTo: '/add-partner' } });
    }, 3000); // Increased delay for better reliability
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="container max-w-md mx-auto py-16 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
      <p>Redirection vers la page de connexion...</p>
      <p className="text-xs text-muted-foreground mt-2">Si la redirection ne fonctionne pas, cliquez <button onClick={() => navigate('/login')} className="text-primary hover:underline">ici</button></p>
    </div>
  );
};

export default LoadingRedirect;
