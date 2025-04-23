
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
    // Additional fields for incentives and lottery prizes
    originalIncentive: '',
    incentiveDescription: '',
    lotteryPrizeName: '',
    lotteryPrizeDescription: '',
    lotteryPrizeValue: '',
    // Google Business Profile data
    googlePhotos: [] as string[],
    rating: 0,
    reviewCount: 0
  });
  
  const [autoImages, setAutoImages] = useState({
    logo: false,
    photo: false
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
    photos?: string[];
    phone?: string;
    website?: string;
    rating?: number;
    totalReviews?: number;
  }) => {
    // Mise à jour du formulaire avec les données récupérées
    setFormData(prev => {
      const newData = {
        ...prev,
        name: store.name,
        address: store.address,
        city: store.city,
        postalCode: store.postalCode,
        latitude: store.latitude,
        longitude: store.longitude,
        placeId: store.placeId,
        phone: store.phone || prev.phone,
        website: store.website || prev.website,
        rating: store.rating || 0,
        reviewCount: store.totalReviews || 0,
        googlePhotos: store.photos || []
      };
      
      // Si nous avons des photos Google et pas encore de logo/photo, les utiliser automatiquement
      if (store.photos && store.photos.length > 0) {
        if (!prev.photoUrl) {
          newData.photoUrl = store.photos[0];
          setAutoImages(current => ({ ...current, photo: true }));
        }
        
        if (!prev.logoUrl && store.photos.length > 1) {
          newData.logoUrl = store.photos[1];
          setAutoImages(current => ({ ...current, logo: true }));
        }
      }
      
      return newData;
    });

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
    
    // Si l'image est chargée manuellement, désactiver l'auto-image
    setAutoImages(prev => ({
      ...prev,
      [type]: false
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
        // Update property names to match Store type
        logo_url: formData.logoUrl,
        photo_url: formData.photoUrl,
        rating: formData.rating || 0,
        reviewCount: formData.reviewCount || 0,
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
      <StoreSearch onStoreSelect={handleStoreSelect} isRegistration={true} />

      {formData.googlePhotos.length > 0 && (
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 mb-4">
          <h3 className="text-sm font-medium mb-2">Photos Google disponibles :</h3>
          <div className="grid grid-cols-3 gap-2">
            {formData.googlePhotos.slice(0, 6).map((photo, index) => (
              <div 
                key={index} 
                className="relative aspect-video bg-muted rounded-md overflow-hidden cursor-pointer group"
                onClick={() => handleImageUpload(index === 0 ? 'photo' : 'logo', photo)}
              >
                <img src={photo} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <p className="text-white text-xs font-medium">Utiliser</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4">
        <StoreImageUpload 
          type="logo" 
          label="Ajouter le logo de la boutique" 
          onImageUpload={handleImageUpload}
          previewUrl={autoImages.logo ? formData.logoUrl : undefined}
        />
        <StoreImageUpload 
          type="photo" 
          label="Ajouter une photo de la boutique" 
          onImageUpload={handleImageUpload}
          previewUrl={autoImages.photo ? formData.photoUrl : undefined}
        />
      </div>
      
      <DescriptionField description={formData.description} handleChange={handleChange} />
      
      <FormAccordion formData={formData} handleChange={handleChange} storeType={storeType} />
      
      <FormActions storeType={storeType} />
    </form>
  );
};

export default StoreForm;
