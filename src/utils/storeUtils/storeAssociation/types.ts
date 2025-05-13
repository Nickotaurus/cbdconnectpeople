
export interface StoreBasicInfo {
  id?: string;
  name: string;
  address?: string;
  city?: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  description?: string;
  imageUrl?: string;
  phone?: string;
  website?: string;
  sourceTable?: string;
  sourceId?: string;
}

export interface AssociationResult {
  success: boolean;
  message: string;
  storeId?: string;
}

export interface StoreSearchResult {
  id: string;
  name: string;
  address: string;
  city?: string;
  source?: string;
  imageUrl?: string;
}

export interface CityCoordinates {
  lat: number;
  lng: number;
}

export interface StoreFormData {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  website: string;
  description: string;
  imageFile: File | null;
  imageUrl: string;
  isEcommerce: boolean;
  ecommerceUrl: string;
}
