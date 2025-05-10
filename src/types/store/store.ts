
import { 
  BaseStore, 
  StoreOpeningHours, 
  StoreReview, 
  StoreProduct, 
  StoreIncentive, 
  StoreCoupon, 
  StoreLotteryPrize 
} from './base-types';

/**
 * Main Store interface used throughout the application
 */
export interface Store extends BaseStore {
  phone: string;
  website: string;
  openingHours: StoreOpeningHours[];
  description: string;
  imageUrl: string;
  logo_url?: string;
  photo_url?: string;
  rating: number;
  reviewCount: number;
  incentive?: StoreIncentive;
  coupon?: StoreCoupon;
  lotteryPrize?: StoreLotteryPrize;
  isPremium?: boolean;
  premiumUntil?: string;
  isEcommerce?: boolean;
  ecommerceUrl?: string;
  hasGoogleBusinessProfile?: boolean;
  reviews: StoreReview[];
  products: StoreProduct[];
  favoritePartnersCount?: number;
}

// Re-export StoreOpeningHours from base-types to make it available
// Using export type to comply with isolatedModules
export type { StoreOpeningHours };
