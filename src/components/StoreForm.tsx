
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { addStore } from '@/utils/storeUtils';
import { Store } from '@/types/store';
import DescriptionField from './store-form/DescriptionField';
import FormAccordion from './store-form/FormAccordion';
import FormActions from './store-form/FormActions';
import StoreImageUpload from './store/StoreImageUpload';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ManualStoreSearch from './store/ManualStoreSearch';
import ManualAddressForm from './store/ManualAddressForm';

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
    latitude: 48.8566, // Paris par défaut
    longitude: 2.3522, // Paris par défaut
    phone: '',
    website: '',
    description: '',
    placeId: '',
    logoUrl: '',
    photoUrl: '',
    // Champs supplémentaires pour les incitations et prix de loterie
    originalIncentive: '',
    incentiveDescription: '',
    lotteryPrizeName: '',
    lotteryPrizeDescription: '',
    lotteryPrizeValue: '',
    // Données de profil Google Business
    googlePhotos: [] as string[],
    rating: 0,
    reviewCount: 0,
    reviews: [] as any[],
    openingHours: [] as string[]
  });
  
  const [autoImages, setAutoImages] = useState({
    logo: false,
    photo: false
  });

  const [step, setStep] = useState<'search' | 'address' | 'details'>('search');
  const [selectedReviews, setSelectedReviews] = useState<any[]>([]);

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
    reviews?: any[];
    openingHours?: string[];
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
        googlePhotos: store.photos || [],
        reviews: store.reviews || [],
        openingHours: store.openingHours || []
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

    // Si nous avons des avis, ajoutons-les au formulaire
    if (store.reviews && store.reviews.length > 0) {
      setSelectedReviews(store.reviews);
    }

    if (store.address === 'À compléter') {
      // Si c'est une saisie manuelle, passer à l'étape de l'adresse
      setStep('address');
    } else {
      // Si on a déjà l'adresse, passer directement à l'étape des détails
      setStep('details');
    }

    toast({
      title: "Établissement sélectionné",
      description: "Les informations ont été automatiquement remplies",
    });
  };

  const handleAddressSubmit = (addressData: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      address: addressData.address,
      city: addressData.city,
      postalCode: addressData.postalCode
    }));
    
    setStep('details');
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
    
    if (!formData.logoUrl || !formData.photoUrl) {
      toast({
        title: "Erreur",
        description: "Veuillez télécharger un logo et une photo de votre boutique",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convertir les avis Google en avis de la boutique
      const reviewsData = selectedReviews.map((review, index) => ({
        id: `review-${index}`,
        author: review.author_name || "Client",
        date: new Date(review.time * 1000).toISOString().split('T')[0],
        rating: review.rating,
        text: review.text,
        category: "experience"
      }));

      // Convertir les horaires Google en horaires de la boutique
      const openingHoursData = formData.openingHours.length > 0 
        ? formData.openingHours.map(day => {
            const parts = day.split(': ');
            return {
              day: parts[0],
              hours: parts[1] || "10:00 - 19:00"
            };
          })
        : [
            { day: "Lundi", hours: "11:00 - 19:00" },
            { day: "Mardi", hours: "11:00 - 19:00" },
            { day: "Mercredi", hours: "11:00 - 19:00" },
            { day: "Jeudi", hours: "11:00 - 19:00" },
            { day: "Vendredi", hours: "11:00 - 19:00" },
            { day: "Samedi", hours: "10:00 - 19:00" },
            { day: "Dimanche", hours: "Fermé" },
          ];

      const storeData: Omit<Store, 'id'> = {
        ...formData,
        imageUrl: formData.photoUrl,
        // Mise à jour des noms de propriétés pour correspondre au type Store
        logo_url: formData.logoUrl,
        photo_url: formData.photoUrl,
        rating: formData.rating || 0,
        reviewCount: formData.reviewCount || 0,
        openingHours: openingHoursData,
        reviews: reviewsData,
        products: [
          { category: "Fleurs", origin: "France", quality: "Bio" },
          { category: "Huiles", origin: "France", quality: "Premium" },
        ],
        isEcommerce: storeType === 'ecommerce' || storeType === 'both',
        coupon: {
          code: `WELCOME${Math.floor(Math.random() * 1000)}`,
          discount: "10%",
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isAffiliate: false
        }
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
    <div className="space-y-6 max-w-2xl mx-auto">
      {step === 'search' && (
        <ManualStoreSearch 
          onStoreSelect={handleStoreSelect} 
          isRegistration={true} 
        />
      )}

      {step === 'address' && (
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Veuillez saisir votre adresse</h3>
          <ManualAddressForm
            initialData={{
              address: formData.address !== 'À compléter' ? formData.address : '',
              city: formData.city,
              postalCode: formData.postalCode
            }}
            onSubmit={handleAddressSubmit}
          />
        </Card>
      )}

      {step === 'details' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Informations de base</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Nom de la boutique*</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="website">Site web</Label>
                  <Input 
                    id="website" 
                    name="website" 
                    type="url"
                    value={formData.website} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <div>
                <Label>Adresse complète</Label>
                <div className="bg-muted p-2 rounded text-sm mt-1">
                  {formData.address}, {formData.postalCode} {formData.city}, France
                </div>
              </div>

              {formData.openingHours.length > 0 && (
                <div>
                  <Label>Horaires d'ouverture</Label>
                  <div className="bg-muted p-2 rounded text-sm mt-1">
                    {formData.openingHours.map((day, index) => (
                      <div key={index}>{day}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          {formData.googlePhotos.length > 0 && (
            <Alert className="bg-primary/5 border-primary/10">
              <AlertTitle className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-primary" />
                Photos Google disponibles
              </AlertTitle>
              <AlertDescription>
                <div className="grid grid-cols-3 gap-2 mt-2">
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
              </AlertDescription>
            </Alert>
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
          
          {formData.reviews && formData.reviews.length > 0 && (
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Avis clients</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Nous avons trouvé {formData.reviews.length} avis pour votre établissement. 
                Ces avis seront importés dans votre fiche.
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {formData.reviews.map((review, index) => (
                  <div key={index} className="bg-muted p-3 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">{review.author_name}</span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span 
                            key={i} 
                            className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm line-clamp-2 mt-1">{review.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
          
          <DescriptionField description={formData.description} handleChange={handleChange} />
          
          <FormAccordion formData={formData} handleChange={handleChange} storeType={storeType} />
          
          <FormActions storeType={storeType} />
        </form>
      )}
    </div>
  );
};

export default StoreForm;
