
import { FormData } from '@/types/store-form';
import { Store } from "@/types/store";

export const initialFormData: FormData = {
  id: '',
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
  ecommerceUrl: '',
  hasGoogleBusinessProfile: false,
  openingHours: []
};

export const convertToStore = (storeData: any): Store => {
  return {
    id: storeData.id,
    name: storeData.name,
    address: storeData.address,
    city: storeData.city,
    postalCode: storeData.postal_code || '',
    latitude: storeData.latitude,
    longitude: storeData.longitude,
    phone: storeData.phone || '',
    website: storeData.website || '',
    description: storeData.description || '',
    imageUrl: storeData.photo_url || '',
    logo_url: storeData.logo_url || '',
    photo_url: storeData.photo_url || '',
    rating: 0,
    reviewCount: 0,
    placeId: storeData.google_place_id || '',
    isPremium: storeData.is_premium || false,
    premiumUntil: storeData.premium_until || undefined,
    isEcommerce: storeData.is_ecommerce || false,
    ecommerceUrl: storeData.ecommerce_url || undefined,
    hasGoogleBusinessProfile: storeData.has_google_profile || false,
    reviews: [],
    openingHours: (storeData.opening_hours || []).map((hour: string) => {
      const parts = hour.split(':');
      return {
        day: parts[0] || '',
        hours: parts.length > 1 ? parts.slice(1).join(':').trim() : ''
      };
    }),
    products: []
  };
};

export const createFormDataFromStoreDB = (storeData: any): FormData => {
  return {
    id: storeData.id,
    name: storeData.name,
    address: storeData.address,
    city: storeData.city,
    postalCode: storeData.postal_code || '',
    latitude: storeData.latitude,
    longitude: storeData.longitude,
    description: storeData.description || '',
    phone: storeData.phone || '',
    website: storeData.website || '',
    logoUrl: storeData.logo_url || '',
    photoUrl: storeData.photo_url || '',
    placeId: storeData.google_place_id || '',
    isEcommerce: storeData.is_ecommerce || false,
    ecommerceUrl: storeData.website || '', // Default to website if not provided
    hasGoogleBusinessProfile: storeData.has_google_profile || false,
    openingHours: (storeData.opening_hours || []).map((hour: string) => {
      const parts = hour.split(':');
      return {
        day: parts[0] || '',
        hours: parts.length > 1 ? parts.slice(1).join(':').trim() : ''
      };
    })
  };
};

export const createStoreDataFromForm = (formData: FormData) => {
  // Convertir les objets d'heures d'ouverture en tableau de chaînes
  const formattedHours = formData.openingHours ? formData.openingHours.map(hour => 
    `${hour.day}:${hour.hours}`
  ) : [];
  
  return {
    name: formData.name,
    address: formData.address,
    city: formData.city,
    postal_code: formData.postalCode,
    latitude: formData.latitude,
    longitude: formData.longitude,
    phone: formData.phone,
    website: formData.website,
    description: formData.description,
    logo_url: formData.logoUrl,
    photo_url: formData.photoUrl,
    google_place_id: formData.placeId,
    is_ecommerce: formData.isEcommerce,
    ecommerce_url: formData.ecommerceUrl || formData.website, // Use ecommerceUrl or fallback to website
    has_google_profile: formData.hasGoogleBusinessProfile,
    opening_hours: formattedHours,
    is_verified: true // Pour s'assurer que la boutique apparaît sur la carte
  };
};
