
import React, { useState, useEffect } from 'react';
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
    handleStoreSelect: originalHandleStoreSelect,
    handleSubmit: submitForm
  } = useStoreForm({ isEdit, storeId, onSuccess, storeType, initialStoreData });
  
  // Convert StoreData to Store for handling store selection
  const handleStoreSelect = (store: Store | null) => {
    if (!store) {
      originalHandleStoreSelect(null);
      return;
    }
    
    // Create a compatible object for StoreData
    const convertedStore: StoreData = {
      name: store.name,
      address: store.address,
      city: store.city,
      postalCode: store.postalCode,
      latitude: store.latitude,
      longitude: store.longitude,
      placeId: store.placeId,
      phone: store.phone,
      website: store.website,
      rating: store.rating,
      totalReviews: store.reviewCount,
      description: store.description,
      logo_url: store.logo_url,
      photo_url: store.photo_url,
      is_ecommerce: store.isEcommerce,
      ecommerce_url: store.ecommerceUrl,
      has_google_profile: store.hasGoogleBusinessProfile
    };
    
    originalHandleStoreSelect(convertedStore);
  };
  
  // Utiliser notre hook de vérification des doublons
  const { isDuplicate } = useStoreDuplicateCheck(formData);
  
  useEffect(() => {
    console.log("FormData mis à jour:", formData);
  }, [formData]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Soumission du formulaire dans StoreForm avec les données:", formData);
    
    // Empêcher la soumission si un doublon est détecté
    if (isDuplicate) {
      console.log("Erreur: Boutique en doublon détectée");
      toast({
        title: "Boutique déjà enregistrée",
        description: "Cette boutique semble déjà être enregistrée dans notre base de données.",
        variant: "destructive"
      });
      return;
    }
    
    // Empêcher les clics multiples
    if (isSubmitting) {
      console.log("Déjà en cours de soumission, ignoré");
      return;
    }
    
    // Validation basique des champs obligatoires
    if (!formData.name || !formData.address || !formData.city || !formData.postalCode) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      // Si un champ requis manque, activer l'onglet de base
      setActiveTab('basic');
      return;
    }
    
    setIsSubmitting(true);
    console.log("Début de la soumission du formulaire");
    
    try {
      const result = await submitForm(e);
      
      console.log("Résultat de la soumission:", result);
      
      if (result.success) {
        console.log("Soumission réussie");
        toast({
          title: "Boutique ajoutée avec succès",
          description: "Votre boutique a été enregistrée avec succès.",
        });
        
        // Set the newly registered store flag
        sessionStorage.setItem('newlyRegisteredStore', 'true');
        
        if (result.store && onSuccess) {
          console.log("Appel de la fonction onSuccess");
          await onSuccess(result.store);
        } else if (result.storeId || result.id) { // Check both storeId and id
          const storeIdToUse = result.storeId || result.id; // Use either property
          console.log("Navigation vers la page du tableau de bord, storeId:", storeIdToUse);
          // Navigate to store dashboard after successful submission
          navigate('/store-dashboard');
        }
      } else {
        console.log("Échec de la soumission:", result.message || "Erreur inconnue");
        toast({
          title: "Échec de l'enregistrement",
          description: result.message || "Une erreur est survenue lors de l'enregistrement de la boutique.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Erreur lors de la soumission:", err);
      toast({
        title: "Erreur de soumission",
        description: "Une erreur inattendue est survenue lors de l'enregistrement de la boutique.",
        variant: "destructive"
      });
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
        isLoading={isLoading || isSubmitting}
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
