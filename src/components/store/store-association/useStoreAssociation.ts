
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { associateStoreWithProfile } from '@/utils/storeUtils/storeAssociation/associateStore';
import { StoreBasicInfo, AssociationResult } from '@/utils/storeUtils/storeAssociation/types';
import { useAuth } from '@/contexts/auth';

export const useStoreAssociation = (
  defaultStoreName = "",
  defaultCity = "",
  onSuccess?: (storeId: string) => void
) => {
  const { user } = useAuth();
  const [storeName, setStoreName] = useState<string>(defaultStoreName);
  const [city, setCity] = useState<string>(defaultCity);
  const [processing, setProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<AssociationResult>({} as AssociationResult);

  const handleAssociate = async () => {
    if (!user?.id || !storeName) return;

    try {
      setProcessing(true);
      setResult({} as AssociationResult);
      
      // Create a minimal store data object for association
      const storeData: StoreBasicInfo = {
        name: storeName,
        city: city,
        latitude: 0,  // Will be updated during association process
        longitude: 0, // Will be updated during association process
      };
      
      // Call the association function
      const associationResult = await associateStoreWithProfile(user.id, storeData, 'physical');
      
      setResult(associationResult);
      
      // If successful and callback provided, call it with the store ID
      if (associationResult.success && associationResult.storeId && onSuccess) {
        onSuccess(associationResult.storeId);
      }
      
    } catch (error) {
      console.error('Error associating store:', error);
      setResult({
        success: false,
        message: "Une erreur s'est produite lors de l'association de la boutique"
      });
    } finally {
      setProcessing(false);
    }
  };

  return {
    storeName,
    setStoreName,
    city,
    setCity,
    processing,
    result,
    handleAssociate,
    // Also expose the raw association function for more complex scenarios
    associateStore: (userId: string, storeData: StoreBasicInfo, storeType: 'physical' | 'ecommerce' | 'both' = 'physical') => 
      associateStoreWithProfile(userId, storeData, storeType),
    isAssociating: processing,
    associationResult: result
  };
};
