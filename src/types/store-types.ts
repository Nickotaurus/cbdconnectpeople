
export interface StoreData {
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
}

export interface BusinessDetails {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
  photos?: string[];
  phone?: string;
  website?: string;
  rating?: number;
  totalReviews?: number;
}
