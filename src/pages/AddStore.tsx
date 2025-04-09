
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import StoreForm from '@/components/StoreForm';
import { Store } from '@/types/store';

const AddStore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get registration info if coming from registration flow
  const { fromRegistration, storeType, requiresSubscription } = 
    (location.state as { 
      fromRegistration?: boolean; 
      storeType?: string; 
      requiresSubscription?: boolean;
    }) || {};

  const handleStoreAdded = (store: Store) => {
    // If coming from registration and requires subscription (ecommerce or both)
    if (fromRegistration && requiresSubscription) {
      setTimeout(() => {
        navigate('/partners/subscription', { 
          state: { 
            fromStoreRegistration: true,
            storeId: store.id
          } 
        });
      }, 1500);
    } else {
      // Normal flow - just go to the store detail page
      setTimeout(() => {
        navigate(`/store/${store.id}`);
      }, 1500);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="gap-2" 
          onClick={() => navigate('/map')}
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
          Assurez-vous que toutes les informations sont correctes et précises.
        </p>
      </div>
      
      <StoreForm 
        onSuccess={handleStoreAdded} 
        storeType={storeType} 
      />
    </div>
  );
};

export default AddStore;
