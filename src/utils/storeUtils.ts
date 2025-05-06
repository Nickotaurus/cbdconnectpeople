
import { Store } from '@/types/store';
import { storesData } from '@/data/storesData';
import { calculateDistance } from './geoUtils';
import { supabase } from '@/integrations/supabase/client';

// Export the stores array directly
export const stores = storesData;

// Placeholder image URL for stores without images
export const placeholderImageUrl = "https://via.placeholder.com/150x150?text=CBD+Store";

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

// Fonction améliorée pour associer une boutique à un profil utilisateur
export const associateStoreWithUser = async (
  email: string,
  storeName: string
): Promise<{ success: boolean; message: string; storeId?: string }> => {
  console.log(`Tentative d'association pour ${email} avec la boutique ${storeName}`);
  
  try {
    // 1. Trouver l'ID utilisateur à partir de l'email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, store_id')
      .eq('email', email)
      .single();

    if (userError) {
      console.error('Erreur lors de la recherche du profil:', userError);
      return { success: false, message: 'Profil utilisateur non trouvé' };
    }

    const userId = userData?.id;
    if (!userId) {
      return { success: false, message: 'ID utilisateur non trouvé' };
    }
    
    // Vérifier si l'utilisateur a déjà une boutique associée
    if (userData.store_id) {
      console.log('Boutique déjà associée:', userData.store_id);
      
      // Vérifier si cette boutique existe toujours
      const { data: storeData, error: storeCheckError } = await supabase
        .from('stores')
        .select('id, name')
        .eq('id', userData.store_id)
        .single();
      
      if (!storeCheckError && storeData) {
        // Stocker l'ID de boutique dans localStorage et sessionStorage
        localStorage.setItem('userStoreId', userData.store_id);
        sessionStorage.setItem('userStoreId', userData.store_id);
        
        return { 
          success: true, 
          message: `Ce profil est déjà associé à la boutique ${storeData.name}`,
          storeId: userData.store_id
        };
      }
    }

    // 2. Rechercher la boutique par nom dans la base de données Supabase
    const { data: storeData, error: storeDbError } = await supabase
      .from('stores')
      .select('*')
      .ilike('name', `%${storeName}%`);

    if (storeDbError) {
      console.error('Erreur lors de la recherche de la boutique:', storeDbError);
      return { success: false, message: 'Erreur lors de la recherche de la boutique' };
    }

    // 3. Si la boutique existe dans Supabase, l'associer au profil utilisateur
    if (storeData && storeData.length > 0) {
      const store = storeData[0];
      
      console.log('Boutique trouvée dans Supabase:', store.id);
      
      // Vérifier si la boutique est déjà réclamée par quelqu'un d'autre
      if (store.claimed_by && store.claimed_by !== userId) {
        return { 
          success: false, 
          message: 'Cette boutique a déjà été réclamée par un autre utilisateur' 
        };
      }
      
      // Mise à jour du champ user_id de la boutique
      const { error: updateError } = await supabase
        .from('stores')
        .update({ user_id: userId, claimed_by: userId })
        .eq('id', store.id);

      if (updateError) {
        console.error('Erreur lors de la mise à jour de la boutique:', updateError);
        return { success: false, message: 'Erreur lors de l\'association de la boutique' };
      }

      // Mise à jour du profil utilisateur avec l'ID de la boutique
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ store_id: store.id, store_type: 'physical' })
        .eq('id', userId);

      if (profileError) {
        console.error('Erreur lors de la mise à jour du profil:', profileError);
        return { success: false, message: 'Erreur lors de la mise à jour du profil' };
      }

      // Stockage de l'ID de boutique dans localStorage et sessionStorage
      localStorage.setItem('userStoreId', store.id);
      sessionStorage.setItem('userStoreId', store.id);

      return { 
        success: true, 
        message: 'Boutique associée avec succès au profil',
        storeId: store.id
      };
    }

    // 4. Si non trouvée dans Supabase, chercher dans les données locales
    const localStore = stores.find(s => 
      s.name.toLowerCase().includes(storeName.toLowerCase())
    );

    if (localStore) {
      console.log('Boutique trouvée dans les données locales:', localStore.name);
      
      // Si trouvée dans les données locales, l'ajouter à Supabase puis l'associer
      const { data: newStore, error: insertError } = await supabase
        .from('stores')
        .insert({
          name: localStore.name,
          address: localStore.address,
          city: localStore.city,
          postal_code: localStore.postalCode,
          latitude: localStore.latitude,
          longitude: localStore.longitude,
          phone: localStore.phone || '',
          website: localStore.website || '',
          description: localStore.description || '',
          photo_url: localStore.imageUrl || '',
          user_id: userId,
          claimed_by: userId,
          is_verified: true
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erreur lors de l\'insertion de la boutique:', insertError);
        return { success: false, message: 'Erreur lors de l\'ajout de la boutique à la base de données' };
      }

      // Mise à jour du profil utilisateur avec l'ID de la boutique
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ store_id: newStore.id, store_type: 'physical' })
        .eq('id', userId);

      if (profileError) {
        console.error('Erreur lors de la mise à jour du profil:', profileError);
        return { success: false, message: 'Erreur lors de la mise à jour du profil' };
      }

      // Stockage de l'ID de boutique dans localStorage et sessionStorage
      localStorage.setItem('userStoreId', newStore.id);
      sessionStorage.setItem('userStoreId', newStore.id);

      return { 
        success: true, 
        message: 'Boutique ajoutée et associée avec succès au profil',
        storeId: newStore.id
      };
    }

    // 5. Si on arrive ici et que c'est "CBD Histoire de Chanvre", on ne crée plus automatiquement
    // Nous avons supprimé la création automatique pour cette boutique

    return { success: false, message: 'Boutique non trouvée' };
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
};
