
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { StoreData, StoreDBType } from '@/types/store-types';
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

interface UseStoreFormProps {
  isEdit?: boolean;
  storeId?: string;
  onSuccess?: (store: Store) => Promise<void>;
  storeType?: string;
}

export const useStoreForm = ({ isEdit = false, storeId, onSuccess, storeType }: UseStoreFormProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('search');
  const [formData, setFormData] = useState<FormData>({
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
  });
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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

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
      const storeData: {
        name: string;
        address: string;
        city: string;
        postal_code: string;
        latitude: number;
        longitude: number;
        description: string;
        phone: string;
        website: string;
        logo_url: string;
        photo_url: string;
        google_place_id: string;
        is_ecommerce: boolean;
        ecommerce_url: string;
      } = {
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
        
        return { success: true, id: storeId };
      } else {
        const { data, error } = await supabase
          .from('stores')
          .insert([storeData])
          .select();
        
        if (error) throw error;
        
        if (data && data.length > 0) {
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
            ecommerceUrl: data[0].ecommerce_url || '',
            isPremium: data[0].is_premium || false,
            premiumUntil: data[0].premium_until || undefined
          };
          
          return { success: true, store: storeForCallback };
        }
      }
      
      return { success: false };
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la boutique.",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Load store data if editing
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
            const storeData = data as StoreDBType;
            setFormData({
              id: storeData.id,
              name: storeData.name,
              address: storeData.address,
              city: storeData.city,
              postalCode: storeData.postal_code || '',
              latitude: storeData.latitude || null,
              longitude: storeData.longitude || null,
              description: storeData.description || '',
              phone: storeData.phone || '',
              website: storeData.website || '',
              logoUrl: storeData.logo_url || '',
              photoUrl: storeData.photo_url || '',
              placeId: storeData.google_place_id || '',
              isEcommerce: storeData.is_ecommerce || false,
              ecommerceUrl: storeData.ecommerce_url || ''
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

  return {
    activeTab,
    setActiveTab,
    formData,
    isLoading,
    isAddressValid,
    hasSearched,
    setHasSearched,
    handleInputChange,
    handleStoreSelect,
    handleSubmit
  };
};
