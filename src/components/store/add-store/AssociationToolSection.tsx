
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import StoreAssociationTool from '@/components/store/store-association/StoreAssociationTool';

interface AssociationToolSectionProps {
  onBackClick: () => void;
  onAssociationSuccess: (storeId: string) => void;
  isTransitioning: boolean;
}

const AssociationToolSection: React.FC<AssociationToolSectionProps> = ({ 
  onBackClick, 
  onAssociationSuccess, 
  isTransitioning 
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="gap-2" 
          onClick={onBackClick}
          disabled={isTransitioning}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la carte
        </Button>
      </div>
      
      <div className="mb-8 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-2">Associer votre boutique</h1>
        <p className="text-muted-foreground">
          Utilisez cet outil pour associer votre boutique existante à votre profil.
        </p>
      </div>
      
      <StoreAssociationTool onSuccess={onAssociationSuccess} />
    </div>
  );
};

export default AssociationToolSection;
