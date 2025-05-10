
/**
 * Types for store association functionality
 */

export interface AssociationResult {
  success: boolean;
  message: string;
  storeId?: string;
}

export interface StoreCoordinates {
  lat: number;
  lng: number;
}

export interface CityCoordinates {
  [key: string]: StoreCoordinates;
}

export interface StoreBasicInfo {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}
