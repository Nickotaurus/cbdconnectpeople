
export interface StoreBasicInfo {
  id: string;
  name: string;
  address?: string;
  city?: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  description?: string;
  imageUrl?: string;
  // For stores from other tables
  sourceTable?: string;
  sourceId?: string;
}

export interface AssociationResult {
  success?: boolean;
  message?: string;
  storeId?: string;
}

export interface CityCoordinates {
  [city: string]: { lat: number; lng: number };
}
