
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { associateStoreWithProfile } from '@/utils/storeUtils/storeAssociation/associateStore';
import { StoreBasicInfo } from '@/utils/storeUtils/storeAssociation/types';

export const useStoreAssociation = () => {
  const [isAssociating, setIsAssociating] = useState(false);
  const [associationResult, setAssociationResult] = useState<{
    success: boolean;
    message: string;
    storeId?: string;
  } | null>(null);

  const associateStore = async (userId: string, storeData: StoreBasicInfo, storeType: 'physical' | 'ecommerce' | 'both' = 'physical') => {
    try {
      setIsAssociating(true);
      setAssociationResult(null);
      
      // Verify if the user exists
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select()
        .eq('id', userId)
        .single();
      
      if (userError || !userProfile) {
        setAssociationResult({
          success: false,
          message: 'Utilisateur non trouvé. Veuillez vous reconnecter.'
        });
        return;
      }
      
      // Associate the store with the user profile
      const result = await associateStoreWithProfile(userId, storeData, storeType);
      
      setAssociationResult(result);
      
      return result;
    } catch (error) {
      console.error('Error during store association:', error);
      setAssociationResult({
        success: false,
        message: 'Une erreur est survenue lors de l\'association de la boutique.'
      });
    } finally {
      setIsAssociating(false);
    }
  };

  return {
    associateStore,
    isAssociating,
    associationResult,
  };
};
