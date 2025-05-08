
// This file re-exports all data and utilities from the refactored modules
// to maintain backward compatibility with existing code

// Store types and data
export type { Store } from '@/types/store';
export { storesData as stores } from '@/data/storesData';

// Subscription data
export { subscriptionPlans } from '@/data/subscriptionData';

// Guide content
export { guideContent } from '@/data/guideData';

// Geo utilities
export { filterUserLocation, calculateDistance } from '@/utils/geoUtils';

// Store operations
export { 
  addStore, 
  updateStore, 
  deleteStore, 
  getStoresByDistance, 
  getStoreById, 
  getReviewsByCategory,
  isStoreDuplicate,
  associateStoreWithUser
} from '@/utils/storeUtils';
