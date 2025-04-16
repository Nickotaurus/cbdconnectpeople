
export type UserRole = 'client' | 'store' | 'partner' | 'admin';
export type StoreType = 'physical' | 'ecommerce' | 'both';
export type PartnerCategory = 'bank' | 'accountant' | 'legal' | 'insurance' | 'logistics' | 'breeder' | 'label' | 'association' | 'media' | 'laboratory' | 'production' | 'realEstate' | 'other';

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

// Base interface for all users
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  isVerified?: boolean;
  favoriteProducts?: string[];
  badges?: UserBadge[];
}

// Extend the base User interface for client-specific properties
export interface ClientUser extends User {
  role: 'client';
  favorites: string[];
  favoriteProducts: string[];
  tickets: number;
  rewards: number;
  badges: UserBadge[];
}

// Extend the base User interface for store-specific properties
export interface StoreUser extends User {
  role: 'store';
  storeType: StoreType;
  siretVerified: boolean;
  partnerFavorites: string[];
  isVerified: boolean;
  needsSubscription: boolean;
  storeId?: string;
}

// Extend the base User interface for partner-specific properties
export interface PartnerUser extends User {
  role: 'partner';
  partnerCategory: PartnerCategory;
  verified: boolean;
  certifications: string[];
  partnerId: string | null;
}
