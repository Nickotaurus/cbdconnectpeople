
import { useState, useEffect } from 'react';
import { associateStoreWithUser } from '@/utils/storeUtils/storeAssociation';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { AssociationResult } from './types';

export const useStoreAssociation = (
  defaultStoreName: string,
  defaultCity: string,
  onSuccess?: (storeId: string) => void
) => {
  const [storeName, setStoreName] = useState(defaultStoreName);
  const [city, setCity] = useState(defaultCity);
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
  
  // Check if user already has a store association
  useEffect(() => {
    const checkExistingAssociation = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        // Get user profile
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('store_id')
          .eq('id', user.id)
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
  }, [onSuccess]);

  const handleAssociate = async () => {
    if (!storeName) {
      toast({
        title: "Nom manquant",
        description: "Veuillez saisir le nom de la boutique",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    setResult({});

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }
      
      // Create a new association using store name and city
      const response = await associateStoreWithUser(storeName, city, user.id);
      setResult(response);
      
      if (response.success && response.storeId) {
        // Show success notification
        toast({
          title: "Association réussie",
          description: "Votre boutique a été associée avec succès à votre profil",
        });
        
        // If association succeeded, redirect after 1.5 seconds
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
    storeName,
    setStoreName,
    city,
    setCity,
    processing,
    result,
    handleAssociate
  };
};
