
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StoreFormTabs from '@/components/store-form/StoreFormTabs';
import { useStoreForm } from '@/hooks/store-form';
import { Store } from '@/types/store';
import { StoreData } from '@/types/store-types';
import { useStoreDuplicateCheck } from '@/hooks/useStoreDuplicateCheck';
import { useToast } from "@/components/ui/use-toast";

interface StoreFormProps {
  isEdit?: boolean;
  storeId?: string;
  onSuccess?: (store: Store) => Promise<void>;
  storeType?: string;
  initialStoreData?: StoreData;
}

const StoreForm = ({ isEdit = false, storeId, onSuccess, storeType, initialStoreData }: StoreFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  // Utiliser notre hook de vérification des doublons
  const { isDuplicate } = useStoreDuplicateCheck(formData);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Empêcher la soumission si un doublon est détecté
    if (isDuplicate) {
      toast({
        title: "Boutique déjà enregistrée",
        description: "Cette boutique semble déjà être enregistrée dans notre base de données.",
        variant: "destructive"
      });
      return;
    }
    
    // Empêcher les clics multiples
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    console.log("Soumission du formulaire dans StoreForm");
    
    try {
      const result = await submitForm(e);
      
      console.log("Résultat de la soumission:", result);
      
      if (result.success) {
        // Set the newly registered store flag
        sessionStorage.setItem('newlyRegisteredStore', 'true');
        
        if (result.store && onSuccess) {
          await onSuccess(result.store);
        } else if (result.id) {
          console.log("Navigation vers la page du tableau de bord");
          // Navigate to store dashboard after successful submission
          navigate('/store-dashboard');
        }
      }
    } finally {
      setIsSubmitting(false);
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
        isDuplicate={isDuplicate}
      />
    </div>
  );
};

export default StoreForm;
