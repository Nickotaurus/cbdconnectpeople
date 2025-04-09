
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PublishButton = () => {
  const { user } = useAuth();
  
  return (
    user ? (
      <Button asChild className="gap-2">
        <Link to="/classifieds/publish">
          <PlusCircle className="h-4 w-4" />
          Publier une annonce
        </Link>
      </Button>
    ) : (
      <div className="bg-secondary/30 rounded-lg p-4 mb-6 text-center">
        <p className="text-sm">
          Vous souhaitez publier une annonce ? <Link to="/register" className="text-primary font-medium hover:underline">Créez un compte gratuit</Link> pour commencer.
        </p>
      </div>
    )
  );
};

export default PublishButton;
