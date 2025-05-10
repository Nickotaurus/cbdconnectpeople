
/**
 * Base store type interfaces used throughout the application
 */

// Common opening hours format used in the Store interface
export interface StoreOpeningHours {
  day: string;
  hours: string;
}

// Base store type with essential properties
export interface BaseStore {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

// Store review format
export interface StoreReview {
  id: string;
  author: string;
  date: string;
  rating: number;
  text: string;
  category: "flowers" | "oils" | "experience" | "originality";
}

// Store product format
export interface StoreProduct {
  category: string;
  origin: string;
  quality: string;
}

// Store incentive format
export interface StoreIncentive {
  title: string;
  description: string;
  validUntil: string;
  usageCount?: number;
  isAffiliate?: boolean;
}

// Store coupon format
export interface StoreCoupon {
  code: string;
  discount: string;
  validUntil: string;
  usageCount?: number;
  isAffiliate?: boolean;
}

// Store lottery prize format
export interface StoreLotteryPrize {
  name: string;
  description: string;
  value?: string;
}
