
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Store } from '@/types/store';
import { convertToStore } from '@/utils/storeFormUtils';
import { useStores } from '@/hooks/useStores';

export const useStoreDashboard = () => {
  const { toast } = useToast();
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { stores, refetch } = useStores();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ecommerceData, setEcommerceData] = useState({
    isEcommerce: false,
    ecommerceUrl: '',
  });

  useEffect(() => {
    const checkNewlyRegistered = () => {
      const isNewlyRegistered = sessionStorage.getItem('newlyRegisteredStore');
      if (isNewlyRegistered === 'true') {
        setShowSuccessMessage(true);
        sessionStorage.removeItem('newlyRegisteredStore');
      }
    };
    
    checkNewlyRegistered();
    
    const fetchUserStore = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error fetching session:", sessionError);
          return;
        }
        
        if (!session?.user?.id) {
          console.log("No user logged in");
          return;
        }
        
        // Get user profile with store_id
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('store_id')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return;
        }
        
        if (!profileData?.store_id) {
          console.log("User has no associated store");
          return;
        }
        
        // Get store details
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('id', profileData.store_id)
          .single();
        
        if (storeError) {
          console.error("Error fetching store:", storeError);
          return;
        }
        
        if (storeData) {
          const storeObject = convertToStore(storeData);
          setCurrentStore(storeObject);
          
          // Set ecommerce data
          setEcommerceData({
            isEcommerce: storeObject.isEcommerce || false,
            ecommerceUrl: storeObject.ecommerceUrl || storeObject.website || '',
          });
        }
      } catch (error) {
        console.error("Error in fetchUserStore:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserStore();
  }, []);

  const handleEcommerceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEcommerceData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleEcommerceSubmit = async () => {
    if (!currentStore?.id) {
      toast({
        title: "Erreur",
        description: "Aucune boutique associée à votre compte.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("Enregistrement des données e-commerce:", ecommerceData);
      
      const { error } = await supabase
        .from('stores')
        .update({
          is_ecommerce: ecommerceData.isEcommerce,
          ecommerce_url: ecommerceData.ecommerceUrl,
        })
        .eq('id', currentStore.id);
      
      if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
      }
      
      // Update local store data
      setCurrentStore(prev => {
        if (!prev) return null;
        return {
          ...prev,
          isEcommerce: ecommerceData.isEcommerce,
          ecommerceUrl: ecommerceData.ecommerceUrl,
        };
      });
      
      toast({
        title: "Succès",
        description: ecommerceData.isEcommerce 
          ? "Votre boutique a été enregistrée comme e-commerce."
          : "Les modifications ont été enregistrées.",
      });
      
      // Refresh stores list - making sure to await it
      await refetch();
      
      // Ajouter un message pour confirmer l'enregistrement
      console.log("Enregistrement réussi des données e-commerce");
      
    } catch (error: any) {
      console.error("Error updating e-commerce status:", error);
      toast({
        title: "Erreur",
        description: error?.message || "Une erreur est survenue lors de la mise à jour de votre boutique.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    currentStore,
    isLoading,
    showSuccessMessage,
    setShowSuccessMessage,
    ecommerceData,
    isSubmitting,
    handleEcommerceChange,
    handleEcommerceSubmit,
    refetch
  };
};
