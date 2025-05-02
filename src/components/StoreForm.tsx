
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StoreFormTabs from '@/components/store-form/StoreFormTabs';
import { useStoreForm } from '@/hooks/useStoreForm';
import { Store } from '@/types/store';

interface StoreFormProps {
  isEdit?: boolean;
  storeId?: string;
  onSuccess?: (store: Store) => Promise<void>;
  storeType?: string;
}

const StoreForm = ({ isEdit = false, storeId, onSuccess, storeType }: StoreFormProps) => {
  const navigate = useNavigate();
  
  const {
    activeTab,
    setActiveTab,
    formData,
    isLoading,
    hasSearched,
    setHasSearched,
    handleInputChange,
    handleStoreSelect,
    handleSubmit: submitForm
  } = useStoreForm({ isEdit, storeId, onSuccess, storeType });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitForm(e);
    
    if (result.success) {
      if (result.store && onSuccess) {
        await onSuccess(result.store);
      } else if (result.id) {
        navigate(`/store/${result.id}`);
      }
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Modifier ma boutique' : 'Ajouter une boutique'}
      </h1>
      
      <StoreFormTabs 
        isEdit={isEdit}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        handleInputChange={handleInputChange}
        handleStoreSelect={handleStoreSelect}
        setHasSearched={setHasSearched}
        hasSearched={hasSearched}
        isLoading={isLoading}
        navigate={navigate}
        handleSubmit={handleSubmit}
        storeType={storeType}
      />
    </div>
  );
};

export default StoreForm;
