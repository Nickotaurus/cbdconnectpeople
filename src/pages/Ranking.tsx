
import React from 'react';
import { Button } from "@/components/ui/button";
import { Award, Home } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Ranking = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8 gap-2">
          <Award className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Classement CBD</h1>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-muted-foreground">
            Cette fonctionnalité sera bientôt disponible. Revenez prochainement !
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={() => navigate('/')} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
