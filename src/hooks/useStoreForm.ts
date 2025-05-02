
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
    
    // Handle checkbox for isEcommerce
    if (name === 'isEcommerce') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleStoreSelect = (store: StoreData) => {
    // Check if this is coming from Google Business
    const hasGoogleInfo = Boolean(
      store.photos && store.photos.length > 0 || 
      store.rating || 
      store.totalReviews || 
      store.openingHours
    );
    
    setFormData({
      ...formData,
      name: store.name || '',
      address: store.address || '',
      city: store.city || '',
      postalCode: store.postalCode || '',
      latitude: store.latitude || null,
      longitude: store.longitude || null,
      description: store.description || formData.description,
      phone: store.phone || formData.phone,
      website: store.website || formData.website,
      logoUrl: store.logo_url || formData.logoUrl,
      photoUrl: store.photo_url || (store.photos && store.photos.length > 0 ? store.photos[0] : formData.photoUrl),
      placeId: store.placeId || '',
      hasGoogleBusinessProfile: hasGoogleInfo,
      openingHours: store.openingHours
    });
    
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
