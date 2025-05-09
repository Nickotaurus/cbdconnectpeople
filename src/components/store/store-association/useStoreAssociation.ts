
import { useState, useEffect } from 'react';
import { associateStoreWithUser } from '@/utils/storeUtils';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { AssociationResult } from './types';

export const useStoreAssociation = (
  defaultEmail: string,
  defaultStoreName: string,
  onSuccess?: (storeId: string) => void
) => {
  const [email, setEmail] = useState(defaultEmail);
  const [storeName, setStoreName] = useState(defaultStoreName);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<AssociationResult>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Clean session data on startup to avoid conflicts
  useEffect(() => {
    localStorage.removeItem('userStoreId');
    sessionStorage.removeItem('userStoreId');
    sessionStorage.removeItem('newlyAddedStore');
  }, []);
  
  // Check if store is already associated at startup
  useEffect(() => {
    const checkExistingAssociation = async () => {
      if (!email) return;
      
      try {
        // 1. Find user ID from email
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id, store_id, email')
          .eq('email', email)
          .single();

        if (userError) {
          console.error('Erreur lors de la recherche du profil:', userError);
          return;
        }

        if (userData?.store_id) {
          // User already has an associated store
          console.log("Boutique déjà associée:", userData.store_id);
          localStorage.setItem('userStoreId', userData.store_id);
          sessionStorage.setItem('userStoreId', userData.store_id);
          
          setResult({
            success: true,
            message: 'Boutique déjà associée à ce profil',
            storeId: userData.store_id
          });
          
          if (onSuccess && userData.store_id) {
            onSuccess(userData.store_id);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la vérification d'association:", err);
      }
    };
    
    checkExistingAssociation();
  }, [email, onSuccess]);

  const handleAssociate = async () => {
    if (!email || !storeName) return;

    setProcessing(true);
    setResult({});

    try {
      // Force remove any existing association
      if (email === 'histoiredechanvre29@gmail.com') {
        // Get user ID
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();
        
        if (userError) {
          console.error('Erreur lors de la récupération du profil:', userError);
          throw new Error('Profil non trouvé');
        }
        
        // Remove store_id association from profile
        await supabase
          .from('profiles')
          .update({ store_id: null })
          .eq('id', userData.id);
          
        // Clean store association if it exists
        const { data: storeData } = await supabase
          .from('stores')
          .select('id')
          .ilike('name', `%${storeName}%`);
          
        if (storeData && storeData.length > 0) {
          await supabase
            .from('stores')
            .update({ user_id: null, claimed_by: null })
            .eq('id', storeData[0].id);
        }
        
        // Clean local storage
        localStorage.removeItem('userStoreId');
        sessionStorage.removeItem('userStoreId');
      }
      
      // Create a new association - passing just the two required parameters
      const response = await associateStoreWithUser(email, storeName);
      setResult(response);
      
      if (response.success && response.storeId) {
        // Show success notification
        toast({
          title: "Association réussie",
          description: "Votre boutique a été associée avec succès à votre profil",
        });
        
        // If association succeeded, reload page after 1.5 seconds
        setTimeout(() => {
          if (onSuccess && response.storeId) {
            onSuccess(response.storeId);
          } else {
            navigate(`/store/${response.storeId}/admin`);
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Erreur lors de l'association:", error);
      setResult({
        success: false,
        message: "Une erreur inattendue s'est produite"
      });
    } finally {
      setProcessing(false);
    }
  };

  return {
    email,
    setEmail,
    storeName,
    setStoreName,
    processing,
    result,
    handleAssociate
  };
};
