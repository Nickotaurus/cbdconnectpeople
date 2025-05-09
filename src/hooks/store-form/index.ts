
import { useState } from 'react';
import { useFormData } from './useFormData';
import { useFormSubmit } from './useFormSubmit';
import { useStoreDuplicateCheck } from '../useStoreDuplicateCheck';
import { useStoreDataFetcher } from '../useStoreDataFetcher';
import { UseStoreFormProps, UseStoreFormReturn } from '@/types/store-form';

export const useStoreForm = ({ isEdit = false, storeId, onSuccess, storeType, initialStoreData }: UseStoreFormProps): UseStoreFormReturn => {
  const [activeTab, setActiveTab] = useState(initialStoreData ? 'details' : 'search');
  
  // Handle form data
  const {
    formData,
    setFormData,
    isAddressValid,
    hasSearched,
    setHasSearched,
    handleInputChange,
    handleStoreSelect
  } = useFormData({ initialStoreData });
  
  // Check for duplicate stores
  useStoreDuplicateCheck(formData);
  
  // Fetch store data when in edit mode
  const { formData: fetchedFormData, isLoading: isLoadingData } = useStoreDataFetcher({ isEdit, storeId });
  
  // Form submission
  const formSubmitHandler = onSuccess ? { onSuccess } : {};
  const { handleSubmit, isLoading: isSubmitting, error } = useFormSubmit(formSubmitHandler);
  
  // Update form data when fetched data is available
  if (fetchedFormData && !formData.id) {
    setFormData(fetchedFormData);
  }
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    return await handleSubmit(formData);
  };
  
  return {
    activeTab,
    setActiveTab,
    formData,
    isLoading: isSubmitting || isLoadingData,
    isAddressValid,
    hasSearched,
    setHasSearched,
    handleInputChange,
    handleStoreSelect,
    handleSubmit: handleFormSubmit
  };
};

export * from './useFormData';
export * from './useFormSubmit';
