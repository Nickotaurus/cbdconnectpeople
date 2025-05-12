
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import PublishButton from '@/components/classifieds/PublishButton';

interface ClassifiedHeaderProps {
  user: any | null;
}

const ClassifiedHeader = ({ user }: ClassifiedHeaderProps) => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl font-bold mb-2">Petites Annonces CBD</h1>
      <p className="text-muted-foreground mb-6">
        Achetez, vendez et échangez des biens et services liés au CBD
      </p>
      
      {user ? (
        <PublishButton />
      ) : (
        <div className="bg-secondary/30 rounded-lg p-4 mb-10 max-w-lg mx-auto">
          <p className="text-sm">
            Vous souhaitez publier une annonce ? <Link to="/register" className="text-primary font-medium hover:underline">Créez un compte gratuit</Link> pour commencer.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassifiedHeader;
