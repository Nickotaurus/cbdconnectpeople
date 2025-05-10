
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

interface StoreErrorStateProps {
  error: string | null;
}

const StoreErrorState = ({ error }: StoreErrorStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Espace boutique</h1>
      <Card>
        <CardHeader>
          <CardTitle>Boutique non trouvée</CardTitle>
          <CardDescription>
            {error || "Cette boutique n'existe pas ou vous n'avez pas les permissions nécessaires."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild>
            <Link to="/">Retour à l'accueil</Link>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/add-store')}
          >
            Créer une boutique
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreErrorState;
