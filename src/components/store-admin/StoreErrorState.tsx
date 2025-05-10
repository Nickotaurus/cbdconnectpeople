
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface StoreErrorStateProps {
  error: string | null;
}

const StoreErrorState = ({ error }: StoreErrorStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className="border-destructive">
        <CardHeader className="bg-destructive/5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Erreur</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <p>{error || "Une erreur inattendue est survenue lors du chargement de la boutique."}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Retour
          </Button>
          <Button onClick={() => navigate('/add-store')}>
            Créer une boutique
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StoreErrorState;
