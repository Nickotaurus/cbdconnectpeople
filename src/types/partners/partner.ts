
import { Store } from '../store/store';

export interface Partner {
  id: string;
  name: string;
  description: string;
  specialties?: string[];
  category: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  logo?: string;
  logoUrl?: string;
  storeId?: string;
  store?: Store;
  isPremium?: boolean;
  followers?: number;
  ratingsAverage?: number;
  ratingsCount?: number;
  isVerified?: boolean;
}

export interface PartnerCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface PartnerSubscription {
  id: string;
  name: string;
  price: number;
  priceUnit: string;
  benefits: string[];
  isPopular?: boolean;
  callToAction: string;
}
