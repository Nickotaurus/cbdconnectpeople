
export interface StoreBasicInfo {
  id?: string;
  name: string;
  address?: string;
  city: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  imageUrl?: string;
  description?: string;
  sourceTable?: string;
  sourceId?: string;
}

export interface AssociationResult {
  success: boolean;
  message: string;
  storeId?: string;
}
