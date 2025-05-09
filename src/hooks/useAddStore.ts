
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Store } from '@/types/store';

export const useAddStore = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCheckingExistingStore, setIsCheckingExistingStore] = useState(true);
  const [existingStoreId, setExistingStoreId] = useState<string | null>(null);
  const [showAssociationTool, setShowAssociationTool] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fromRegistration, setFromRegistration] = useState(false);
  const [storeType, setStoreType] = useState<string | null>(null);
  const [requiresSubscription, setRequiresSubscription] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur vient de s'inscrire
    const params = new URLSearchParams(window.location.search);
    const fromReg = params.get('from') === 'registration';
    const type = params.get('type');
    const needsSub = params.get('subscription') === 'true';
    
    setFromRegistration(fromReg);
    setStoreType(type);
    setRequiresSubscription(needsSub);
    
    const checkExistingStore = async () => {
      try {
        // Vérifier si l'utilisateur est connecté
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("L'utilisateur n'est pas connecté");
          setIsCheckingExistingStore(false);
          return;
        }
        
        console.log("Vérification si l'utilisateur a déjà une boutique");
        
        // Vérifier si l'utilisateur a déjà une boutique dans son profil
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('store_id')
          .eq('id', session.user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Erreur lors de la vérification du profil:", profileError);
          setIsCheckingExistingStore(false);
          return;
        }
        
        if (profileData?.store_id) {
          console.log("L'utilisateur a déjà une boutique associée:", profileData.store_id);
          setExistingStoreId(profileData.store_id);
          setIsCheckingExistingStore(false);
          return;
        }
        
        // Si l'utilisateur est un commerçant mais n'a pas de boutique associée
        const { data: userData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (userData?.role === 'store' && !profileData?.store_id) {
          console.log("L'utilisateur est un commerçant sans boutique associée");
          setShowAssociationTool(true);
        }
        
        setIsCheckingExistingStore(false);
      } catch (error) {
        console.error("Erreur lors de la vérification des boutiques:", error);
        setIsCheckingExistingStore(false);
      }
    };
    
    checkExistingStore();
  }, []);

  const handleStoreAdded = useCallback(async (store: Store) => {
    setIsTransitioning(true);
    
    // Register the store to ensure it appears on the map
    console.log("Enregistrement de la boutique pour affichage sur la carte");
    
    // Set the newly registered store flag
    sessionStorage.setItem('newlyRegisteredStore', 'true');
    
    // Store the store ID for quick access
    if (store.id) {
      localStorage.setItem('userStoreId', store.id);
    }
    
    // Short delay to show success message
    setTimeout(() => {
      // Navigate to the store dashboard
      navigate('/store-dashboard', { replace: true });
    }, 1000);
    
    // Toast the success message
    toast({
      title: "Boutique ajoutée",
      description: "Votre boutique a été enregistrée avec succès et est maintenant visible sur la carte.",
      duration: 5000,
    });
  }, [navigate, toast]);

  const handleAssociationSuccess = useCallback((storeId: string) => {
    setIsTransitioning(true);
    
    setExistingStoreId(storeId);
    setTimeout(() => {
      navigate(`/store/${storeId}/admin`, { replace: true });
    }, 1500);
    
    toast({
      title: "Association réussie",
      description: "Votre boutique a été associée à votre profil avec succès.",
      duration: 5000,
    });
  }, [navigate, toast]);

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
