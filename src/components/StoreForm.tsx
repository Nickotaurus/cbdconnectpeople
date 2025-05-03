
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StoreFormTabs from '@/components/store-form/StoreFormTabs';
import { useStoreForm } from '@/hooks/useStoreForm';
import { Store } from '@/types/store';
import { StoreData } from '@/types/store-types';

interface StoreFormProps {
  isEdit?: boolean;
  storeId?: string;
  onSuccess?: (store: Store) => Promise<void>;
  storeType?: string;
  initialStoreData?: StoreData;
}

const StoreForm = ({ isEdit = false, storeId, onSuccess, storeType, initialStoreData }: StoreFormProps) => {
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
  } = useStoreForm({ isEdit, storeId, onSuccess, storeType, initialStoreData });
  
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
    <div className="container mx-auto px-4 py-4">
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
        skipSearch={!!initialStoreData}
      />
    </div>
  );
};

export default StoreForm;
