
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
  const [uploadingLogo, setUploadingLogo] = useState(false);
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

  // Nouvelle fonction pour gérer l'upload du logo
  const handleLogoUpload = async (file: File) => {
    if (!currentStore?.id) {
      toast({
        title: "Erreur",
        description: "Aucune boutique associée à votre compte.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      setUploadingLogo(true);
      
      // Créer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentStore.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Télécharger le fichier dans le bucket "store-logos"
      const { data, error } = await supabase.storage
        .from('store-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error("Erreur lors du téléchargement du logo:", error);
        throw error;
      }
      
      // Obtenir l'URL publique du logo
      const { data: publicUrlData } = supabase.storage
        .from('store-logos')
        .getPublicUrl(filePath);
      
      const logoUrl = publicUrlData.publicUrl;
      
      // Mettre à jour la boutique avec l'URL du logo
      const { error: updateError } = await supabase
        .from('stores')
        .update({ logo_url: logoUrl })
        .eq('id', currentStore.id);
        
      if (updateError) {
        console.error("Erreur lors de la mise à jour de l'URL du logo:", updateError);
        throw updateError;
      }
      
      // Mettre à jour le store local
      setCurrentStore(prev => {
        if (!prev) return null;
        return {
          ...prev,
          logo_url: logoUrl
        };
      });
      
      toast({
        title: "Succès",
        description: "Votre logo a été téléchargé avec succès.",
      });
      
      return logoUrl;
      
    } catch (error: any) {
      console.error("Erreur lors du téléchargement du logo:", error);
      toast({
        title: "Erreur",
        description: error?.message || "Une erreur est survenue lors du téléchargement du logo.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingLogo(false);
    }
  };
  
  return {
    currentStore,
    isLoading,
    showSuccessMessage,
    setShowSuccessMessage,
    ecommerceData,
    isSubmitting,
    uploadingLogo,
    handleEcommerceChange,
    handleEcommerceSubmit,
    handleLogoUpload,
    refetch
  };
};
