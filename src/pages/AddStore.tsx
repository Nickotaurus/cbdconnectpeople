
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAddStore } from '@/hooks/useAddStore';
import { Store } from '@/types/store';
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

  // Create a wrapper for the onStoreAdded callback to match the expected type
  const handleStoreSuccess = async (store: Store) => {
    if (handleStoreAdded) {
      await handleStoreAdded(store);
    }
  };

  return (
    <AddStoreFormSection
      onBackClick={() => navigate('/map')}
      onStoreAdded={handleStoreSuccess}
      storeType={storeType}
      fromRegistration={fromRegistration}
      requiresSubscription={false} // We always set this to false since all registrations are free now
      isTransitioning={isTransitioning}
    />
  );
};

export default AddStore;
