
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { addStore } from '@/utils/storeUtils';
import { Store } from '@/types/store';
import BasicInfoFields from './store-form/BasicInfoFields';
import GooglePlacesSearch from './store-form/GooglePlacesSearch';
import DescriptionField from './store-form/DescriptionField';
import EcommerceField from './store-form/EcommerceField';
import FormAccordion from './store-form/FormAccordion';
import FormActions from './store-form/FormActions';

interface StoreFormProps {
  onSuccess?: (store: Store) => void;
  storeType?: string;
}

const StoreForm: React.FC<StoreFormProps> = ({ onSuccess, storeType = 'physical' }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    website: '',
    description: '',
    placeId: '',
    latitude: 0,
    longitude: 0,
    originalIncentive: '',
    incentiveDescription: '',
    lotteryPrizeName: '',
    lotteryPrizeDescription: '',
    lotteryPrizeValue: '',
    ecommerceUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les coordonnées de l'établissement",
        variant: "destructive",
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      placeId: place.place_id || '',
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      address: place.formatted_address?.split(',')[0] || prev.address,
    }));

    toast({
      title: "Établissement trouvé",
      description: "Les coordonnées ont été automatiquement ajoutées",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.placeId) {
      toast({
        title: "Erreur",
        description: "Veuillez rechercher et sélectionner votre établissement",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    
    try {
      // Prepare the complete store object
      const storeData: Omit<Store, 'id'> = {
        ...formData,
        imageUrl: "https://images.unsplash.com/photo-1603726623530-8a99ef1f1d93?q=80&w=1000", // Default image
        rating: 0, // Default rating for new store
        reviewCount: 0, // Default review count for new store
        openingHours: [
          { day: "Lundi", hours: "11:00 - 19:00" },
          { day: "Mardi", hours: "11:00 - 19:00" },
          { day: "Mercredi", hours: "11:00 - 19:00" },
          { day: "Jeudi", hours: "11:00 - 19:00" },
          { day: "Vendredi", hours: "11:00 - 19:00" },
          { day: "Samedi", hours: "10:00 - 19:00" },
          { day: "Dimanche", hours: "Fermé" },
        ],
        // Replace coupon with new incentive structure
        incentive: {
          title: formData.originalIncentive,
          description: formData.incentiveDescription,
          validUntil: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
        },
        reviews: [],
        products: [
          { category: "Fleurs", origin: "France", quality: "Bio" },
          { category: "Huiles", origin: "France", quality: "Premium" },
        ],
        // Add the store type information
        isEcommerce: storeType === 'ecommerce' || storeType === 'both',
        ecommerceUrl: storeType === 'ecommerce' || storeType === 'both' ? formData.ecommerceUrl : undefined,
      };
      
      // Add lottery prize if provided
      if (formData.lotteryPrizeName && formData.lotteryPrizeDescription) {
        storeData.lotteryPrize = {
          name: formData.lotteryPrizeName,
          description: formData.lotteryPrizeDescription,
          value: formData.lotteryPrizeValue || undefined
        };
      }
      
      const newStore = addStore(storeData);
      
      toast({
        title: "Boutique ajoutée avec succès",
        description: `La boutique "${newStore.name}" a été ajoutée.`,
        duration: 3000,
      });
      
      if (onSuccess) {
        onSuccess(newStore);
      }
      
      // Reset form
      setFormData({
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
        originalIncentive: '',
        incentiveDescription: '',
        lotteryPrizeName: '',
        lotteryPrizeDescription: '',
        lotteryPrizeValue: '',
        ecommerceUrl: ''
      });
      
    } catch (error) {
      console.error("Erreur lors de l'ajout de la boutique:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la boutique.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <BasicInfoFields formData={formData} handleChange={handleChange} />
      
      <GooglePlacesSearch 
        formData={formData} 
        handleChange={handleChange}
        onPlaceSelect={handlePlaceSelect}
      />
      
      <DescriptionField description={formData.description} handleChange={handleChange} />
      
      {(storeType === 'ecommerce' || storeType === 'both') && (
        <EcommerceField ecommerceUrl={formData.ecommerceUrl} handleChange={handleChange} />
      )}
      
      <FormAccordion formData={formData} handleChange={handleChange} storeType={storeType} />
      
      <FormActions storeType={storeType} />
    </form>
  );
};

export default StoreForm;
