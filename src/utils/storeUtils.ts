
import { Store } from '@/types/store';
import { storesData } from '@/data/storesData';
import { calculateDistance } from './geoUtils';

// Export the stores array directly
export const stores = storesData;

export const addStore = (store: Omit<Store, 'id'>): Store => {
  const newId = (Math.max(...stores.map(s => parseInt(s.id))) + 1).toString();
  const newStore: Store = {
    ...store,
    id: newId
  };
  
  storesData.push(newStore);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('cbd-stores', JSON.stringify(storesData));
  }
  
  return newStore;
};

export const updateStore = (store: Store): Store => {
  const index = storesData.findIndex(s => s.id === store.id);
  if (index !== -1) {
    storesData[index] = store;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('cbd-stores', JSON.stringify(storesData));
    }
    
    return store;
  }
  throw new Error(`Store with id ${store.id} not found`);
};

export const deleteStore = (id: string): boolean => {
  const initialLength = storesData.length;
  const filteredStores = storesData.filter(s => s.id !== id);
  
  if (filteredStores.length < initialLength) {
    // Update the array in place (maintaining the reference)
    storesData.length = 0;
    storesData.push(...filteredStores);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('cbd-stores', JSON.stringify(storesData));
    }
    
    return true;
  }
  
  return false;
};

export const getStoresByDistance = (userLat: number, userLng: number, customStores?: Store[]) => {
  const storesToSort = customStores || [...stores];
  
  return storesToSort.sort((a, b) => {
    const distA = calculateDistance(userLat, userLng, a.latitude, a.longitude);
    const distB = calculateDistance(userLat, userLng, b.latitude, b.longitude);
    return distA - distB;
  });
};

export const getStoreById = (id: string) => {
  return stores.find(store => store.id === id);
};

export const getReviewsByCategory = (reviews: Store['reviews'], category: string) => {
  return reviews.filter(review => review.category === category);
};

// Nouvelle fonction pour vérifier les doublons par nom
export const isStoreDuplicate = (name: string): boolean => {
  // Convertir le nom en minuscules et supprimer les espaces pour la comparaison
  const normalizedName = name.toLowerCase().replace(/\s+/g, '');
  
  return stores.some(store => {
    const storeName = store.name.toLowerCase().replace(/\s+/g, '');
    return storeName === normalizedName;
  });
};
