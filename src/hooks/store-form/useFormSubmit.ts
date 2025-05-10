
import { useState } from 'react';
import { FormData, UseFormSubmitProps } from '@/types/store-form';
import { createStoreDataFromForm } from '@/utils/storeFormUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { Store } from '@/types/store';
import { convertToStore } from '@/utils/storeFormUtils';

export const useFormSubmit = ({ onSuccess }: UseFormSubmitProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    console.log("Début de handleSubmit dans useFormSubmit avec les données:", formData);
    setError('');
    setIsLoading(true);

    try {
      if (!user) {
        console.error("Erreur: Utilisateur non connecté");
        throw new Error("Vous devez être connecté pour ajouter une boutique");
      }

      console.log("Utilisateur connecté:", user.id);

      // Validation des données avant soumission
      if (!formData.name || !formData.address || !formData.city || !formData.postalCode) {
        const errorMsg = "Veuillez remplir tous les champs obligatoires";
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Create the store data object from form data
      const storeData = createStoreDataFromForm(formData);
      
      // Add user_id to the store data
      const storeDataWithUserId = {
        ...storeData,
        user_id: user.id
      };

      console.log('Données de la boutique à soumettre:', storeDataWithUserId);

      // Insert the store into the database
      const { data: newStore, error: insertError } = await supabase
        .from('stores')
        .insert(storeDataWithUserId)
        .select('*')
        .single();

      if (insertError) {
        console.error('Erreur lors de l\'insertion de la boutique:', insertError);
        throw new Error(`Erreur lors de l'ajout de la boutique: ${insertError.message}`);
      }

      console.log('Boutique ajoutée avec succès:', newStore);

      // Update the user profile with the store ID - all stores are now free
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          store_id: newStore.id, 
          store_type: formData.isEcommerce ? 'ecommerce' : 'physical',
          needs_subscription: false // Tous les inscriptions sont maintenant gratuites
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Erreur lors de la mise à jour du profil:', profileError);
        // We still consider this a success since the store was added
      }

      // Save store ID to session and local storage
      sessionStorage.setItem('userStoreId', newStore.id);
      localStorage.setItem('userStoreId', newStore.id);
      
      // Also save in session that this store was just added
      sessionStorage.setItem('newlyAddedStore', newStore.id);

      toast({
        title: 'Boutique ajoutée avec succès',
        description: 'Votre boutique a été enregistrée avec succès.'
      });

      // Convert the DB store to a Store object
      const storeObject = convertToStore(newStore);
      
      console.log("Boutique convertie en objet Store:", storeObject);

      if (onSuccess) {
        console.log("Appel de la fonction onSuccess");
        await onSuccess(storeObject);
      }

      // Return result with both storeId and store properties for consistent access
      return { 
        success: true, 
        message: 'Boutique ajoutée avec succès',
        storeId: newStore.id, // Make sure storeId is returned
        id: newStore.id, // Also keep id for backward compatibility
        store: storeObject
      };

    } catch (err) {
      console.error('Erreur de soumission du formulaire:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive'
      });
      
      // Include message and storeId (as null) properties for consistent return type
      return { 
        success: false, 
        message: errorMessage,
        storeId: undefined 
      };
    } finally {
      setIsLoading(false);
      console.log("Fin de handleSubmit dans useFormSubmit");
    }
  };

  return { handleSubmit, isLoading, error };
};
