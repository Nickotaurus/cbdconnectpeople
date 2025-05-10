
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import ClassifiedForm from '@/components/classifieds/forms/ClassifiedForm';

const PublishClassifiedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/login');
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
