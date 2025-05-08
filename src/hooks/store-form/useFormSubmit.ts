
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { FormData, StoreFormSubmitResult } from '@/types/store-form';
import { Store } from '@/types/store';
import { createStoreDataFromForm, convertToStore } from '@/utils/storeFormUtils';

interface UseFormSubmitProps {
  formData: FormData;
  isEdit: boolean;
  storeId?: string;
  isAddressValid: boolean;
  onSuccess?: (store: Store) => Promise<void>;
}

export const useFormSubmit = ({ 
  formData, 
  isEdit, 
  storeId, 
  isAddressValid,
  onSuccess 
}: UseFormSubmitProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<StoreFormSubmitResult> => {
    e.preventDefault();
    console.log("Formulaire soumis", formData);
    
    if (!isAddressValid && !isEdit) {
      toast({
        title: "Adresse requise",
        description: "Veuillez sélectionner une adresse valide",
        variant: "destructive"
      });
      return { success: false };
    }
    
    setIsLoading(true);
    
    try {
      const storeData = createStoreDataFromForm(formData);
      
      // Récupérer l'utilisateur actuellement connecté pour associer la boutique
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Erreur lors de la récupération de la session:", sessionError);
        // On continue sans user_id si on ne peut pas récupérer la session
      }
      
      if (session?.user?.id) {
        // Ajouter l'ID utilisateur aux données de la boutique
        storeData.user_id = session.user.id;
      } else {
        console.warn("Aucun utilisateur connecté, la boutique sera créée sans propriétaire");
      }
      
      console.log("Données de boutique à enregistrer:", storeData);
      
      if (isEdit && storeId) {
        const { data: updateData, error } = await supabase
          .from('stores')
          .update(storeData)
          .eq('id', storeId)
          .select();
        
        if (error) {
          console.error("Erreur lors de la mise à jour:", error);
          throw error;
        }
        
        toast({
          title: "Boutique mise à jour",
          description: "Les informations de votre boutique ont été mises à jour avec succès.",
        });
        
        return { success: true, id: storeId };
      } else {
        console.log("Tentative d'insertion dans la table stores...");
        
        const { data, error } = await supabase
          .from('stores')
          .insert([storeData])
          .select();
        
        if (error) {
          console.error("Erreur Supabase lors de l'insertion:", error);
          throw error;
        }
        
        console.log("Données insérées avec succès:", data);
        
        if (data && data.length > 0) {
          // Customize success message based on store type
          let successMsg = "Votre boutique a été ajoutée avec succès.";
          
          if (formData.isEcommerce && formData.hasGoogleBusinessProfile) {
            successMsg = "Votre boutique physique et votre site e-commerce ont été ajoutés avec succès. Les informations Google ont été importées.";
          } else if (formData.isEcommerce) {
            successMsg = "Votre boutique physique et votre site e-commerce ont été ajoutés avec succès.";
          } else if (formData.hasGoogleBusinessProfile) {
            successMsg = "Votre boutique a été ajoutée avec succès. Les informations Google ont été importées.";
          }
          
          toast({
            title: "Boutique ajoutée",
            description: successMsg,
          });
          
          // Marquer la boutique comme nouvellement créée pour afficher le message de confirmation
          sessionStorage.setItem('newlyRegisteredStore', 'true');
          
          // Convert to Store type for onSuccess callback
          const storeForCallback = convertToStore(data[0]);
          
          // Si l'utilisateur est connecté, associer la boutique à son profil
          if (session?.user?.id) {
            try {
              const { error: profileError } = await supabase
                .from('profiles')
                .update({ 
                  store_id: data[0].id,
                  store_type: 'physical' 
                })
                .eq('id', session.user.id);
                
              if (profileError) {
                console.error("Erreur lors de la mise à jour du profil:", profileError);
                // On continue même si la mise à jour du profil échoue
              } else {
                console.log("Profil mis à jour avec store_id:", data[0].id);
              }
            } catch (profileUpdateError) {
              console.error("Erreur lors de la mise à jour du profil:", profileUpdateError);
            }
          }
          
          if (onSuccess) {
            await onSuccess(storeForCallback);
          }
          
          return { success: true, store: storeForCallback, id: data[0].id };
        }
      }
      
      return { success: false };
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la boutique.",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit
  };
};
