
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import StoreForm from '@/components/StoreForm';
import { Store } from '@/types/store';

interface AddStoreFormSectionProps {
  onBackClick: () => void;
  onStoreAdded: (store: Store) => Promise<void>;
  storeType?: string;
  fromRegistration?: boolean;
  requiresSubscription?: boolean;
  isTransitioning: boolean;
}

const AddStoreFormSection: React.FC<AddStoreFormSectionProps> = ({
  onBackClick,
  onStoreAdded,
  storeType,
  fromRegistration,
  requiresSubscription,
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
        <h1 className="text-3xl font-bold mb-2">Ajouter une boutique CBD</h1>
        <p className="text-muted-foreground">
          {fromRegistration && requiresSubscription 
            ? "Enregistrez d'abord votre boutique physique. Vous pourrez ensuite configurer votre e-commerce."
            : "Utilisez ce formulaire pour ajouter une nouvelle boutique CBD à notre base de données."}
        </p>
      </div>
      
      <StoreForm 
        onSuccess={onStoreAdded} 
        storeType={storeType} 
      />
    </div>
  );
};

export default AddStoreFormSection;
