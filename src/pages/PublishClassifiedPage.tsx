
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import ClassifiedForm from '@/components/classifieds/forms/ClassifiedForm';
import { useToast } from '@/components/ui/use-toast';

const PublishClassifiedPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirection vers la page de connexion si non authentifié
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour publier une annonce.",
        variant: "destructive",
      });
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate, toast]);

  // Afficher un retour vide pendant le chargement pour éviter le flash de contenu
  if (authLoading || !user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Publier une annonce</h1>
          <p className="text-muted-foreground">
            Remplissez le formulaire ci-dessous pour soumettre votre annonce. Elle sera publiée après validation par nos équipes.
          </p>
        </div>
        
        <ClassifiedForm />
      </div>
    </div>
  );
};

export default PublishClassifiedPage;
