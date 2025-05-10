
import { EcommerceStore } from '@/types/ecommerce';

/**
 * Filter stores by search term and specialty
 */
export const filterStores = (
  stores: EcommerceStore[], 
  searchTerm: string, 
  specialty: string | null
): EcommerceStore[] => {
  let result = [...stores];
  
  if (searchTerm.trim()) {
    const lowerTerm = searchTerm.toLowerCase();
    result = result.filter(
      store => 
        store.name.toLowerCase().includes(lowerTerm) || 
        store.description.toLowerCase().includes(lowerTerm)
    );
  }
  
  if (specialty) {
    result = result.filter(store => 
      store.specialties.some(s => s.toLowerCase() === specialty.toLowerCase())
    );
  }
  
  return result;
};

/**
 * Extract all unique specialties from stores
 */
export const extractAllSpecialties = (stores: EcommerceStore[]): string[] => {
  return Array.from(
    new Set(stores.flatMap(store => store.specialties))
  ).sort();
};
