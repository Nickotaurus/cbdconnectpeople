
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Store } from '@/types/store';

export const useAddStore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [existingStoreId, setExistingStoreId] = useState<string | null>(null);
  const [isCheckingExistingStore, setIsCheckingExistingStore] = useState(true);
  const [showAssociationTool, setShowAssociationTool] = useState(false);
  
  const { fromRegistration, storeType, requiresSubscription } = 
    (location.state as { 
      fromRegistration?: boolean; 
      storeType?: string; 
      requiresSubscription?: boolean;
    }) || {};

  // Clean localStorage/sessionStorage and check for special case
  useEffect(() => {
    if (user?.email === 'histoiredechanvre29@gmail.com') {
      localStorage.removeItem('userStoreId');
      sessionStorage.removeItem('userStoreId');
      sessionStorage.removeItem('newlyAddedStore');
      
      // For this specific user, show the association tool directly
      setShowAssociationTool(true);
      setIsCheckingExistingStore(false);
      return;
    }
    
    const checkExistingStore = async () => {
      if (!user) {
        setIsCheckingExistingStore(false);
        return;
      }
      
      try {
        // Check if user has a store_id in their profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('store_id')
          .eq('id', user.id)
          .single();
          
        if (!profileError && profileData?.store_id) {
          setExistingStoreId(profileData.store_id);
          localStorage.setItem('userStoreId', profileData.store_id);
          sessionStorage.setItem('userStoreId', profileData.store_id);
        }
      } catch (error) {
        console.error("Error checking for existing store:", error);
      } finally {
        setIsCheckingExistingStore(false);
      }
    };
    
    checkExistingStore();
  }, [user]);

  const handleStoreAdded = async (store: Store) => {
    setIsTransitioning(true);
    
    // Build a customized confirmation message based on store type
    let confirmationMessage = "Votre boutique a été référencée dans l'annuaire.";
    
    if (store.isEcommerce && store.hasGoogleBusinessProfile) {
      confirmationMessage = "Votre boutique physique et votre site e-commerce ont été référencés avec succès. Les informations de votre fiche Google Business ont été importées.";
    } else if (store.isEcommerce) {
      confirmationMessage = "Votre boutique physique et votre site e-commerce ont été référencés avec succès.";
    } else if (store.hasGoogleBusinessProfile) {
      confirmationMessage = "Votre boutique a été référencée avec succès. Les informations de votre fiche Google Business ont été importées.";
    }
    
    toast({
      title: "Boutique ajoutée avec succès",
      description: confirmationMessage,
      duration: 5000,
    });

    // Save store ID in localStorage and sessionStorage
    localStorage.setItem('userStoreId', store.id);
    sessionStorage.setItem('userStoreId', store.id);
    sessionStorage.setItem('newlyAddedStore', store.id);

    // Navigate based on registration flow and subscription requirements
    if (fromRegistration && requiresSubscription) {
      setTimeout(() => {
        navigate('/partners/subscription', { 
          state: { 
            fromStoreRegistration: true,
            storeId: store.id
          },
          replace: true
        });
        setIsTransitioning(false);
      }, 1500);
    } else {
      // Navigate to store admin dashboard
      setTimeout(() => {
        navigate(`/store/${store.id}/admin`, { replace: true });
        setIsTransitioning(false);
      }, 1500);
    }
  };
  
  const handleAssociationSuccess = () => {
    const storeId = localStorage.getItem('userStoreId') || sessionStorage.getItem('userStoreId');
    if (storeId) {
      navigate(`/store/${storeId}/admin`, { replace: true });
    } else {
      // If no store ID is found, reload the page
      window.location.reload();
    }
  };

  return {
    isTransitioning,
    existingStoreId,
    isCheckingExistingStore,
    showAssociationTool,
    fromRegistration,
    storeType,
    requiresSubscription,
    handleStoreAdded,
    handleAssociationSuccess
  };
};
