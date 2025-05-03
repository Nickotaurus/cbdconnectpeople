
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const LoadingState: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-6"></div>
            <h2 className="text-lg font-medium mb-2">Vérification de votre profil</h2>
            <p className="text-muted-foreground text-sm">
              Nous vérifions si vous avez déjà une boutique enregistrée...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingState;
