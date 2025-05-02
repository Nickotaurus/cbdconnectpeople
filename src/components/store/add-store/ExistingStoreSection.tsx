
import React from 'react';

const ExistingStoreSection: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center p-6 border rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Vous avez déjà une boutique</h2>
        <p className="mb-6 text-muted-foreground">
          Vous allez être redirigé vers votre espace boutique existant.
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
};

export default ExistingStoreSection;
