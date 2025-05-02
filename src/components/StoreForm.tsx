
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import BasicInfoFields from '@/components/store-form/BasicInfoFields';
import EcommerceField from '@/components/store-form/EcommerceField';
import FormActions from '@/components/store-form/FormActions';
import StoreSearch from '@/components/store/StoreSearch';
import { StoreData } from '@/types/store-types';
import { Store } from '@/types/store';

// Default placeholder image when no image is available
const placeholderImageUrl = "https://via.placeholder.com/150x150?text=CBD+Store";

interface FormData {
  id?: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  phone: string;
  website: string;
  logoUrl: string;
  photoUrl: string;
  placeId: string;
  isEcommerce: boolean;
  ecommerceUrl: string;
}

const initialFormData: FormData = {
  name: '',
  address: '',
  city: '',
  postalCode: '',
  latitude: null,
  longitude: null,
  description: '',
  phone: '',
  website: '',
  logoUrl: '',
  photoUrl: '',
  placeId: '',
  isEcommerce: false,
  ecommerceUrl: ''
};

interface StoreFormProps {
  isEdit?: boolean;
  storeId?: string;
  onSuccess?: (store: Store) => Promise<void>;
  storeType?: string;
}

const StoreForm = ({ isEdit = false, storeId, onSuccess, storeType }: StoreFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('search');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isGoogleBusiness, setIsGoogleBusiness] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState<any[]>([]);
  
  const duplicateCheckRunRef = useRef(false);

  useEffect(() => {
    const checkForDuplicate = async () => {
      if (!formData.address || !formData.latitude || !formData.longitude || duplicateCheckRunRef.current) {
        return;
      }
      
      duplicateCheckRunRef.current = true;
      
      try {
        const { data } = await supabase
          .from('stores')
          .select('id, name, address')
          .eq('address', formData.address)
          .eq('latitude', formData.latitude)
          .eq('longitude', formData.longitude);
        
        if (data && data.length > 0) {
          toast({
            title: "Boutique existante",
            description: "Une boutique existe déjà à cette adresse.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error checking for duplicate:", error);
      }
    };
    
    checkForDuplicate();
  }, [formData.address, formData.latitude, formData.longitude, toast]);
  
  const handleStoreSelect = (store: StoreData) => {
    setFormData({
      ...formData,
      name: store.name || '',
      address: store.address || '',
      city: store.city || '',
      postalCode: store.postalCode || '',
      latitude: store.latitude || null,
      longitude: store.longitude || null,
      description: store.description || '',
      phone: store.phone || '',
      website: store.website || '',
      logoUrl: store.logo_url || '',
      photoUrl: store.photo_url || '',
      placeId: store.placeId || '',
    });
    
    if (store.photos && store.photos.length > 0) {
      setIsGoogleBusiness(true);
    }
    
    setIsAddressValid(true);
    setActiveTab('details');
    setHasSearched(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAddressValid && !isEdit) {
      toast({
        title: "Adresse requise",
        description: "Veuillez sélectionner une adresse valide",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const storeData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postalCode,
        latitude: formData.latitude || 0,
        longitude: formData.longitude || 0,
        description: formData.description,
        phone: formData.phone,
        website: formData.website,
        logo_url: formData.logoUrl || placeholderImageUrl,
        photo_url: formData.photoUrl || placeholderImageUrl,
        google_place_id: formData.placeId,
        is_ecommerce: formData.isEcommerce,
        ecommerce_url: formData.ecommerceUrl,
      };
      
      if (isEdit && storeId) {
        const { error } = await supabase
          .from('stores')
          .update(storeData)
          .eq('id', storeId);
        
        if (error) throw error;
        
        toast({
          title: "Boutique mise à jour",
          description: "Les informations de votre boutique ont été mises à jour avec succès.",
        });
        
        navigate(`/store/${storeId}`);
      } else {
        const { data, error } = await supabase
          .from('stores')
          .insert([storeData])
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          toast({
            title: "Boutique ajoutée",
            description: "Votre boutique a été ajoutée avec succès.",
          });
          
          // Convert to Store type for onSuccess callback
          const storeForCallback: Store = {
            id: data[0].id,
            name: data[0].name,
            address: data[0].address,
            city: data[0].city,
            postalCode: data[0].postal_code || '',
            latitude: data[0].latitude,
            longitude: data[0].longitude,
            phone: data[0].phone || '',
            website: data[0].website || '',
            imageUrl: data[0].photo_url || placeholderImageUrl,
            logo_url: data[0].logo_url || '',
            photo_url: data[0].photo_url || '',
            description: data[0].description || '',
            openingHours: [],
            rating: 0,
            reviewCount: 0,
            placeId: data[0].google_place_id || '',
            reviews: [],
            products: [],
            isEcommerce: data[0].is_ecommerce || false,
            ecommerceUrl: data[0].ecommerce_url || ''
          };
          
          if (onSuccess) {
            await onSuccess(storeForCallback);
          } else {
            navigate(`/store/${data[0].id}`);
          }
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la boutique.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  useEffect(() => {
    if (isEdit && storeId) {
      setIsLoading(true);
      
      const fetchStoreData = async () => {
        try {
          const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('id', storeId)
            .single();

          if (error) {
            console.error("Error fetching store data:", error);
            toast({
              title: "Erreur",
              description: "Impossible de charger les informations de la boutique.",
              variant: "destructive"
            });
          } else if (data) {
            setFormData({
              id: data.id,
              name: data.name,
              address: data.address,
              city: data.city,
              postalCode: data.postal_code || '',
              latitude: data.latitude || null,
              longitude: data.longitude || null,
              description: data.description || '',
              phone: data.phone || '',
              website: data.website || '',
              logoUrl: data.logo_url || '',
              photoUrl: data.photo_url || '',
              placeId: data.google_place_id || '',
              isEcommerce: data.is_ecommerce || false,
              ecommerceUrl: data.ecommerce_url || ''
            });
            setIsAddressValid(true);
            setHasSearched(true);
          }
        } catch (error) {
          console.error("Error in fetch:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchStoreData();
    }
  }, [isEdit, storeId, toast]);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Modifier ma boutique' : 'Ajouter une boutique'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search" disabled={isEdit}>Rechercher une boutique</TabsTrigger>
            <TabsTrigger value="details">Détails de la boutique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-4">
            {!isEdit && (
              <>
                <div className="rounded-lg bg-card p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Rechercher votre boutique</h3>
                  <p className="text-muted-foreground mb-4">
                    Recherchez votre boutique pour récupérer automatiquement les informations de Google Business.
                  </p>
                  
                  <StoreSearch 
                    onStoreSelect={handleStoreSelect} 
                    isRegistration={true}
                  />
                  
                  <div className="mt-6 flex justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mr-2"
                      onClick={() => navigate(-1)}
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => {
                        setActiveTab('details');
                        setHasSearched(true);
                      }}
                    >
                      Continuer manuellement
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6">
            <div className="rounded-lg bg-card p-6 shadow-sm space-y-6">
              <BasicInfoFields 
                formData={formData} 
                handleChange={handleInputChange}
              />
              
              <EcommerceField 
                ecommerceUrl={formData.ecommerceUrl}
                onChange={handleInputChange}
              />
              
              <FormActions 
                isLoading={isLoading}
                onCancel={() => navigate(-1)}
                storeType={storeType}
              />
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default StoreForm;
