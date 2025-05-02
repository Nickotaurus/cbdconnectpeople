
import { FormData } from '@/types/store-form';
import { Store } from '@/types/store';
import { StoreData, StoreDBType } from '@/types/store-types';

// Default placeholder image when no image is available
export const placeholderImageUrl = "https://via.placeholder.com/150x150?text=CBD+Store";

export const createStoreDataFromForm = (formData: FormData): {
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
  is_premium?: boolean;
  premium_until?: string;
  has_google_profile?: boolean;
} => {
  return {
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
    has_google_profile: formData.hasGoogleBusinessProfile
  };
};

export const convertToStore = (data: StoreDBType): Store => {
  return {
    id: data.id,
    name: data.name,
    address: data.address,
    city: data.city,
    postalCode: data.postal_code || '',
    latitude: data.latitude,
    longitude: data.longitude,
    phone: data.phone || '',
    website: data.website || '',
    imageUrl: data.photo_url || placeholderImageUrl,
    logo_url: data.logo_url || '',
    photo_url: data.photo_url || '',
    description: data.description || '',
    openingHours: [],
    rating: 0,
    reviewCount: 0,
    placeId: data.google_place_id || '',
    reviews: [],
    products: [],
    isEcommerce: data.is_ecommerce || false,
    ecommerceUrl: data.ecommerce_url || '',
    isPremium: data.is_premium || false,
    premiumUntil: data.premium_until || undefined,
    hasGoogleBusinessProfile: data.has_google_profile || false
  };
};

export const createFormDataFromStoreDB = (storeData: StoreDBType): FormData => {
  return {
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
    ecommerceUrl: storeData.ecommerce_url || '',
    hasGoogleBusinessProfile: storeData.has_google_profile || false,
    openingHours: storeData.opening_hours || []
  };
};

export const initialFormData: FormData = {
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
  hasGoogleBusinessProfile: false
};
