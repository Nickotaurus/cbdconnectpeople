
import { BaseStore, StoreOpeningHours } from './base-types';

/**
 * StoreData interface represents store data from external sources (like Google Places API)
 * or intermediate formats used in form handling
 */
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
  openingHours?: string[];  // Format: "day:hours"
  description?: string;
  logo_url?: string;
  photo_url?: string;
  is_ecommerce?: boolean;
  ecommerce_url?: string;
  is_premium?: boolean;
  premium_until?: string;
  google_place_id?: string;
  has_google_profile?: boolean;
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
  openingHours?: string[];  // Format: "day:hours"
}

/**
 * Interface representing the database stores schema
 */
export interface StoreDBType {
  address: string;
  city: string;
  claimed_by: string | null;
  description: string | null;
  id: string;
  is_verified: boolean | null;
  latitude: number;
  logo_url: string | null;
  longitude: number;
  name: string;
  phone: string | null;
  photo_url: string | null;
  postal_code: string;
  registration_date: string | null;
  user_id: string | null;
  website: string | null;
  google_place_id?: string | null;
  is_ecommerce?: boolean | null;
  ecommerce_url?: string | null;
  is_premium?: boolean | null;
  premium_until?: string | null;
  has_google_profile?: boolean | null;
  opening_hours?: string[] | null;  // Format: "day:hours"
}
