
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
  reviews?: ReviewData[];
  openingHours?: string[];
}

export interface ReviewData {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description?: string;
  profile_photo_url?: string;
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
  reviews?: ReviewData[];
  openingHours?: string[];
}
