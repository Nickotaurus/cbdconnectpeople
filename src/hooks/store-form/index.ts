
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
  const { isLoading: isSubmitting, handleSubmit } = useFormSubmit({
    formData,
    isEdit,
    storeId,
    isAddressValid,
    onSuccess
  });
  
  // Update form data when fetched data is available
  if (fetchedFormData && !formData.id) {
    setFormData(fetchedFormData);
  }
  
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
    handleSubmit
  };
};

export * from './useFormData';
export * from './useFormSubmit';
