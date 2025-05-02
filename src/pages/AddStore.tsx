
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import StoreForm from '@/components/StoreForm';
import { Store } from '@/types/store';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/auth';

const AddStore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const { fromRegistration, storeType, requiresSubscription } = 
    (location.state as { 
      fromRegistration?: boolean; 
      storeType?: string; 
      requiresSubscription?: boolean;
    }) || {};

  const handleStoreAdded = async (store: Store) => {
    setIsTransitioning(true);
    
    toast({
      title: "Boutique ajoutée avec succès",
      description: "Votre boutique a été référencée dans l'annuaire. Vous pouvez maintenant accéder à votre espace boutique.",
      duration: 5000,
    });

    // Enregistrer l'ID de la nouvelle boutique dans localStorage et sessionStorage pour plus de fiabilité
    localStorage.setItem('userStoreId', store.id);
    sessionStorage.setItem('userStoreId', store.id);
    sessionStorage.setItem('newlyAddedStore', store.id);

    // Si provient de l'inscription et nécessite un abonnement (ecommerce ou les deux)
    if (fromRegistration && requiresSubscription) {
      setTimeout(() => {
        navigate('/partners/subscription', { 
          state: { 
            fromStoreRegistration: true,
            storeId: store.id
          } 
        });
        setIsTransitioning(false);
      }, 1500);
    } else {
      // Navigation vers le tableau de bord de la boutique
      setTimeout(() => {
        navigate(`/store/${store.id}/admin`);
        setIsTransitioning(false);
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
        onSuccess={handleStoreAdded} 
        storeType={storeType} 
      />
    </div>
  );
};

export default AddStore;
