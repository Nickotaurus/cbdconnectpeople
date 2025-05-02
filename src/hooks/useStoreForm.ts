
import { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { StoreData } from '@/types/store-types';
import { Store } from '@/types/store';
import { FormData, UseStoreFormProps, UseStoreFormReturn, StoreFormSubmitResult } from '@/types/store-form';
import { useStoreDuplicateCheck } from './useStoreDuplicateCheck';
import { useStoreDataFetcher } from './useStoreDataFetcher';
import { createStoreDataFromForm, convertToStore, initialFormData } from '@/utils/storeFormUtils';

export const useStoreForm = ({ isEdit = false, storeId, onSuccess, storeType }: UseStoreFormProps): UseStoreFormReturn => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('search');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isGoogleBusiness, setIsGoogleBusiness] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState<any[]>([]);

  // Check for duplicate stores
  useStoreDuplicateCheck(formData);

  // Fetch store data when in edit mode
  const { formData: fetchedFormData, isLoading: isLoadingData } = useStoreDataFetcher({ isEdit, storeId });
  
  // Update form data when fetched data is available
  if (fetchedFormData && !formData.id) {
    setFormData(fetchedFormData);
    setIsAddressValid(true);
    setHasSearched(true);
  }
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleStoreSelect = (store: StoreData) => {
    setFormData({
      ...formData,
      name: store.name || '',
      address: store.address || '',
      city: store.city || '',
      postalCode: store.postalCode || '',
      latitude: store.latitude || null,
      longitude: store.longitude || null,
      description: store.description || '',
      phone: store.phone || '',
      website: store.website || '',
      logoUrl: store.logo_url || '',
      photoUrl: store.photo_url || '',
      placeId: store.placeId || '',
    });
    
    if (store.photos && store.photos.length > 0) {
      setIsGoogleBusiness(true);
    }
    
    setIsAddressValid(true);
    setActiveTab('details');
    setHasSearched(true);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<StoreFormSubmitResult> => {
    e.preventDefault();
    
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
      
      if (isEdit && storeId) {
        const { error } = await supabase
          .from('stores')
          .update(storeData)
          .eq('id', storeId);
        
        if (error) throw error;
        
        toast({
          title: "Boutique mise à jour",
          description: "Les informations de votre boutique ont été mises à jour avec succès.",
        });
        
        return { success: true, id: storeId };
      } else {
        const { data, error } = await supabase
          .from('stores')
          .insert([storeData])
          .select();
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          toast({
            title: "Boutique ajoutée",
            description: "Votre boutique a été ajoutée avec succès.",
          });
          
          // Convert to Store type for onSuccess callback
          const storeForCallback = convertToStore(data[0]);
          
          if (onSuccess) {
            await onSuccess(storeForCallback);
          }
          
          return { success: true, store: storeForCallback };
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
    activeTab,
    setActiveTab,
    formData,
    isLoading: isLoading || isLoadingData,
    isAddressValid,
    hasSearched,
    setHasSearched,
    handleInputChange,
    handleStoreSelect,
    handleSubmit
  };
};
