export type UserRole = 'client' | 'store' | 'partner' | 'admin';

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
  storeType: 'physical' | 'ecommerce' | 'both';
  siretVerified: boolean;
  partnerFavorites: string[];
  isVerified: boolean;
  needsSubscription: boolean;
}

// Extend the base User interface for partner-specific properties
export interface PartnerUser extends User {
  role: 'partner';
  partnerCategory: string;
  verified: boolean;
  certifications: string[];
}
