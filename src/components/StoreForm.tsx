import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { addStore } from '@/utils/storeUtils';
import { Store } from '@/types/store';
import FormActions from './store-form/FormActions';
import StoreImageUpload from './store/StoreImageUpload';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ManualStoreSearch from './store/ManualStoreSearch';
import ManualAddressForm from './store/ManualAddressForm';
import { useAuth } from '@/contexts/auth';
import { supabase } from "@/integrations/supabase/client";

interface StoreFormProps {
  onSuccess?: (store: Store) => void;
  storeType?: string;
}

const StoreForm = ({ onSuccess, storeType = 'physical' }: StoreFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
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
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [step, setStep] = useState<'search' | 'address' | 'details'>('search');
  const [selectedReviews, setSelectedReviews] = useState<any[]>([]);

  useEffect(() => {
    // Vérifier si la boutique existe déjà lorsque l'adresse et les coordonnées sont définies
    const checkForDuplicate = async () => {
      if (!formData.address || !formData.latitude || !formData.longitude) {
        return;
      }

      try {
        // Vérifier par placeId d'abord (le plus précis)
        if (formData.placeId) {
          const { data: placeData } = await supabase
            .from('stores')
            .select('id, name')
            .eq('google_place_id', formData.placeId)
            .limit(1);

          if (placeData && placeData.length > 0) {
            setIsDuplicate(true);
            toast({
              title: "Boutique déjà enregistrée",
              description: `Une boutique avec ce Google Place ID existe déjà : ${placeData[0].name}`,
              variant: "destructive",
            });
            return;
          }
        }

        // Vérifier aussi par l'adresse exacte
        const { data: addressData } = await supabase
          .from('stores')
          .select('id, name')
          .eq('address', formData.address)
          .eq('city', formData.city)
          .eq('postal_code', formData.postalCode)
          .limit(1);

        if (addressData && addressData.length > 0) {
          setIsDuplicate(true);
          toast({
            title: "Boutique déjà enregistrée",
            description: `Une boutique à cette adresse existe déjà : ${addressData[0].name}`,
            variant: "destructive",
          });
          return;
        }

        // Vérifier par proximité géographique (dans un rayon de ~50m)
        const latDiff = 0.0005; // Environ 50m
        const lngDiff = 0.0005; // Environ 50m

        const { data: geoData } = await supabase
          .from('stores')
          .select('id, name, latitude, longitude')
          .gte('latitude', formData.latitude - latDiff)
          .lte('latitude', formData.latitude + latDiff)
          .gte('longitude', formData.longitude - lngDiff)
          .lte('longitude', formData.longitude + lngDiff)
          .limit(1);

        if (geoData && geoData.length > 0) {
          setIsDuplicate(true);
          toast({
            title: "Boutique potentiellement déjà enregistrée",
            description: `Une boutique similaire existe déjà à proximité : ${geoData[0].name}`,
            variant: "destructive",
          });
        } else {
          setIsDuplicate(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification des doublons:", error);
      }
    };

    checkForDuplicate();
  }, [formData.address, formData.latitude, formData.longitude, formData.placeId, formData.city, formData.postalCode, toast]);

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

    if (isDuplicate) {
      toast({
        title: "Boutique déjà existante",
        description: "Cette boutique semble déjà être enregistrée dans notre système. Veuillez vérifier les informations saisies.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convertir les avis Google en avis de la boutique
      const reviewsData = selectedReviews.map((review, index) => {
        // Determiner une catégorie valide pour chaque avis
        const validCategories = ["experience", "flowers", "oils", "originality"] as const;
        const categoryIndex = index % validCategories.length;
        
        return {
          id: `review-${index}`,
          author: review.author_name || "Client",
          date: new Date(review.time * 1000).toISOString().split('T')[0],
          rating: review.rating || 4,
          text: review.text || "Bonne expérience",
          category: validCategories[categoryIndex]
        };
      });

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
          usageCount: 0,
          isAffiliate: false
        }
      };

      // 1. Ajouter la boutique à nos données locales
      const newStore = addStore(storeData);

      // 2. Si nous avons un utilisateur connecté et Supabase, enregistrer également la boutique dans Supabase
      if (user && user.id) {
        try {
          // Insérer la boutique dans Supabase
          const { data: storeData, error: storeError } = await supabase
            .from('stores')
            .insert({
              name: newStore.name,
              address: newStore.address,
              city: newStore.city,
              postal_code: newStore.postalCode,
              latitude: newStore.latitude,
              longitude: newStore.longitude,
              phone: newStore.phone,
              website: newStore.website,
              description: newStore.description,
              logo_url: newStore.logo_url,
              photo_url: newStore.photo_url,
              user_id: user.id,
              is_verified: true
            })
            .select()
            .single();

          if (storeError) {
            console.error("Erreur lors de l'enregistrement de la boutique dans Supabase:", storeError);
            throw storeError;
          }

          // Mettre à jour le profil utilisateur avec l'ID de la boutique
          if (storeData) {
            const { error: profileError } = await supabase
              .from('profiles')
              .update({ 
                store_id: storeData.id,
                store_type: storeType 
              })
              .eq('id', user.id);

            if (profileError) {
              console.error("Erreur lors de la mise à jour du profil utilisateur:", profileError);
              throw profileError;
            }

            // Stocker l'ID de la boutique dans sessionStorage pour une utilisation immédiate
            sessionStorage.setItem('userStoreId', storeData.id);
            localStorage.setItem('userStoreId', storeData.id);
          }
        } catch (supabaseError) {
          console.error("Erreur Supabase complète:", supabaseError);
          toast({
            title: "Erreur de synchronisation",
            description: "Votre boutique a été créée localement mais n'a pas pu être synchronisée avec votre compte. Veuillez réessayer plus tard.",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Boutique ajoutée",
        description: `La boutique "${newStore.name}" a été ajoutée avec succès.`,
      });

      // Afficher le message de bienvenue
      setTimeout(() => {
        toast({
          title: "Bravo et bienvenue dans le réseau !",
          description: "En rejoignant la plateforme, vous faites un pas concret vers plus de visibilité, de connexions utiles et d'entraide entre pros du CBD. Ensemble, on va plus loin.",
          duration: 8000,
        });
      }, 1500);

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
    } finally {
      setIsSubmitting(false);
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

              {isDuplicate && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Attention</AlertTitle>
                  <AlertDescription>
                    Une boutique à cette adresse ou très similaire existe déjà dans notre système.
                  </AlertDescription>
                </Alert>
              )}

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
          
          <FormActions storeType={storeType} isSubmitting={isSubmitting} />
        </form>
      )}
    </div>
  );
};

export default StoreForm;
