
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAddStore } from '@/hooks/useAddStore';
import LoadingState from '@/components/store/add-store/LoadingState';
import AssociationToolSection from '@/components/store/add-store/AssociationToolSection';
import ExistingStoreSection from '@/components/store/add-store/ExistingStoreSection';
import AddStoreFormSection from '@/components/store/add-store/AddStoreFormSection';

const AddStore: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isTransitioning,
    existingStoreId,
    isCheckingExistingStore,
    showAssociationTool,
    fromRegistration,
    storeType,
    requiresSubscription,
    handleStoreAdded,
    handleAssociationSuccess
  } = useAddStore();

  // Redirect to existing store if one is found
  useEffect(() => {
    if (!isCheckingExistingStore && existingStoreId && !showAssociationTool) {
      toast({
        title: "Vous avez déjà une boutique",
        description: "Vous allez être redirigé vers votre espace boutique existant.",
        duration: 5000,
      });
      
      setTimeout(() => {
        navigate(`/store/${existingStoreId}/admin`, { replace: true });
      }, 1500);
    }
  }, [existingStoreId, isCheckingExistingStore, toast, navigate, showAssociationTool]);

  if (isCheckingExistingStore) {
    return <LoadingState />;
  }
  
  if (showAssociationTool) {
    return (
      <AssociationToolSection 
        onBackClick={() => navigate('/map')}
        onAssociationSuccess={handleAssociationSuccess}
        isTransitioning={isTransitioning}
      />
    );
  }

  if (existingStoreId) {
    return <ExistingStoreSection />;
  }

  return (
    <AddStoreFormSection
      onBackClick={() => navigate('/map')}
      onStoreAdded={handleStoreAdded}
      storeType={storeType}
      fromRegistration={fromRegistration}
      requiresSubscription={requiresSubscription}
      isTransitioning={isTransitioning}
    />
  );
};

export default AddStore;
