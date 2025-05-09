
import { Store } from '@/types/store';

/**
 * Combines and deduplicates stores from local and database sources
 * @param localStores Local store data
 * @param dbStores Database store data
 * @param userLocation User location coordinates
 * @returns Deduplicated array of stores
 */
export const combineAndDeduplicateStores = (
  localStores: Store[], 
  dbStores: Store[], 
  userLocation: { latitude: number, longitude: number }
): Store[] => {
  // Utiliser un objet standard pour stocker les boutiques uniques
  const storeMap = {} as Record<string, Store>;
  
  // Tracer les compteurs pour le débogage
  console.log(`Nombre de boutiques locales: ${localStores.length}`);
  console.log(`Nombre de boutiques depuis supabase: ${dbStores ? dbStores.length : 0}`);
  
  // Ensemble de suivi pour éviter le traitement en double
  const processedIds = new Set<string>();
  const processedPlaceIds = new Set<string>();
  const processedCoordinates = new Set<string>();
  
  // Fonction pour traiter une boutique et l'ajouter au Map si elle est unique
  const processStore = (store: Store, priority: number) => {
    // Ne pas traiter la même boutique deux fois
    if (processedIds.has(store.id)) return;
    processedIds.add(store.id);
    
    // Déterminer la clé de déduplication
    let key: string;
    
    if (store.placeId && store.placeId.trim() !== '') {
      // Clé basée sur Place ID
      key = `place_${store.placeId}`;
      if (processedPlaceIds.has(store.placeId)) return;
      processedPlaceIds.add(store.placeId);
    }
    else if (store.latitude && store.longitude) {
      // Clé basée sur coordonnées
      const lat = Math.round(store.latitude * 100000) / 100000;
      const lng = Math.round(store.longitude * 100000) / 100000;
      key = `geo_${lat}_${lng}`;
      
      const coordKey = `${lat}_${lng}`;
      if (processedCoordinates.has(coordKey)) return;
      processedCoordinates.add(coordKey);
    }
    else {
      // Clé basée sur nom et adresse
      const normalizedName = store.name.toLowerCase().replace(/\s+/g, '');
      const normalizedAddress = store.address.toLowerCase().replace(/\s+/g, '');
      const normalizedCity = store.city.toLowerCase().replace(/\s+/g, '');
      key = `name_${normalizedName}_addr_${normalizedAddress}_${normalizedCity}`;
    }
    
    // Stocker la boutique dans notre map avec la priorité appropriée
    if (!storeMap[key] || (priority > (storeMap[key]?.id.includes('-') ? 2 : 1))) {
      storeMap[key] = store;
    }
  };
  
  // Traiter d'abord les boutiques de la base de données (priorité plus élevée)
  if (dbStores && dbStores.length > 0) {
    dbStores.forEach(store => processStore(store, 2));
  }
  
  // Puis traiter les boutiques locales (priorité plus basse)
  localStores.forEach(store => processStore(store, 1));
  
  console.log(`Nombre final de boutiques après déduplication: ${Object.keys(storeMap).length}`);
  
  // Convertir notre objet en tableau
  return Object.values(storeMap) as Store[];
};
