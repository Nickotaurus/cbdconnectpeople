
export type UserRole = 'client' | 'store' | 'producer' | 'partner';
export type PartnerCategory = 'bank' | 'accountant' | 'lawyer' | 'insurance' | 'logistics' | 'breeder' | 'label' | 'association' | 'media' | 'laboratory' | 'realEstate';
export type StoreType = 'physical' | 'ecommerce' | 'both';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  badges?: Badge[];
  isVerified?: boolean; // Added isVerified property
}

export interface ClientUser extends User {
  role: 'client';
  favorites: string[];
  favoriteProducts: string[];
  tickets: number;
  rewards: number;
}

export interface StoreUser extends User {
  role: 'store';
  storeId?: string;
  storeType: StoreType;
  siretVerified: boolean;
  needsSubscription: boolean;
  partnerFavorites: string[];
}

export interface ProducerUser extends User {
  role: 'producer';
  producerId?: string;
  verified: boolean;
  certifications?: string[]; // Added certifications property
}

export interface PartnerUser extends User {
  role: 'partner';
  partnerId?: string;
  partnerCategory: PartnerCategory;
  verified: boolean;
  certifications?: string[]; // Added certifications property
}
