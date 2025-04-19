
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { addStore } from '@/utils/storeUtils';
import { Store } from '@/types/store';
import DescriptionField from './store-form/DescriptionField';
import FormAccordion from './store-form/FormAccordion';
import FormActions from './store-form/FormActions';
import StoreSearch from './store/StoreSearch';
import StoreImageUpload from './store/StoreImageUpload';

interface StoreFormProps {
  onSuccess?: (store: Store) => void;
  storeType?: string;
}

const StoreForm = ({ onSuccess, storeType = 'physical' }: StoreFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    latitude: 0,
    longitude: 0,
    phone: '',
    website: '',
    description: '',
    placeId: '',
    logoUrl: '',
    photoUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStoreSelect = (store: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    placeId: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      ...store
    }));

    toast({
      title: "Boutique sélectionnée",
      description: "Les informations ont été automatiquement remplies",
    });
  };

  const handleImageUpload = (type: 'logo' | 'photo', url: string) => {
    setFormData(prev => ({
      ...prev,
      [type === 'logo' ? 'logoUrl' : 'photoUrl']: url
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.placeId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner votre boutique via Google Maps",
        variant: "destructive",
      });
      return;
    }

    if (!formData.logoUrl || !formData.photoUrl) {
      toast({
        title: "Erreur",
        description: "Veuillez télécharger un logo et une photo de votre boutique",
        variant: "destructive",
      });
      return;
    }

    try {
      const storeData: Omit<Store, 'id'> = {
        ...formData,
        imageUrl: formData.photoUrl,
        logo_url: formData.logoUrl,
        photo_url: formData.photoUrl,
        rating: 0,
        reviewCount: 0,
        openingHours: [
          { day: "Lundi", hours: "11:00 - 19:00" },
          { day: "Mardi", hours: "11:00 - 19:00" },
          { day: "Mercredi", hours: "11:00 - 19:00" },
          { day: "Jeudi", hours: "11:00 - 19:00" },
          { day: "Vendredi", hours: "11:00 - 19:00" },
          { day: "Samedi", hours: "10:00 - 19:00" },
          { day: "Dimanche", hours: "Fermé" },
        ],
        reviews: [],
        products: [
          { category: "Fleurs", origin: "France", quality: "Bio" },
          { category: "Huiles", origin: "France", quality: "Premium" },
        ],
        isEcommerce: storeType === 'ecommerce' || storeType === 'both',
      };

      const newStore = addStore(storeData);

      toast({
        title: "Boutique ajoutée",
        description: `La boutique "${newStore.name}" a été ajoutée avec succès.`,
      });

      if (onSuccess) {
        onSuccess(newStore);
      }

    } catch (error) {
      console.error("Erreur lors de l'ajout de la boutique:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la boutique.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <StoreSearch onStoreSelect={handleStoreSelect} />

      <div className="grid gap-4">
        <StoreImageUpload 
          type="logo" 
          label="Ajouter le logo de la boutique" 
          onImageUpload={handleImageUpload} 
        />
        <StoreImageUpload 
          type="photo" 
          label="Ajouter une photo de la boutique" 
          onImageUpload={handleImageUpload} 
        />
      </div>
      
      <DescriptionField description={formData.description} handleChange={handleChange} />
      
      <FormAccordion formData={formData} handleChange={handleChange} storeType={storeType} />
      
      <FormActions storeType={storeType} />
    </form>
  );
};

export default StoreForm;
