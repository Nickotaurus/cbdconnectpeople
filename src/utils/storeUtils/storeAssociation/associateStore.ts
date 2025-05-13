
import { supabase } from '@/integrations/supabase/client';
import { StoreBasicInfo, AssociationResult } from './types';

/**
 * Associate a store with a user profile
 */
export const associateStoreWithProfile = async (
  userId: string,
  storeData: StoreBasicInfo,
  storeType: 'physical' | 'ecommerce' | 'both' = 'physical'
): Promise<AssociationResult> => {
  try {
    console.log(`Associating store "${storeData.name}" with user ID ${userId}`);
    
    // Check if store already exists in stores table
    let storeId: string;
    let storeExists = false;
    
    // Si on a une sourceTable et un sourceId, cela signifie que la boutique existe déjà
    // dans une table source spécifique (comme cbd_shops)
    if (storeData.sourceTable && storeData.sourceId) {
      console.log(`Store from source table ${storeData.sourceTable} with ID ${storeData.sourceId}`);
      
      if (storeData.sourceTable === 'cbd_shops') {
        // Pour une boutique de cbd_shops, vérifions d'abord si elle a déjà été migrée
        const { data: existingStore } = await supabase
          .from('stores')
          .select('id')
          .eq('source_table', 'cbd_shops')
          .eq('source_id', storeData.sourceId)
          .single();
        
        if (existingStore) {
          console.log(`CBD shop already migrated to stores table with ID ${existingStore.id}`);
          storeId = existingStore.id;
          storeExists = true;
        } else {
          // Migrer depuis cbd_shops vers stores
          const { data: cbdShop, error: cbdShopError } = await supabase
            .from('cbd_shops')
            .select('*')
            .eq('id', parseInt(storeData.sourceId))
            .single();
          
          if (cbdShopError || !cbdShop) {
            console.error(`Error fetching CBD shop with ID ${storeData.sourceId}:`, cbdShopError);
            return { success: false, message: `Boutique introuvable dans la base de données` };
          }
          
          // Insérer dans la table stores
          const { data: newStore, error: insertError } = await supabase
            .from('stores')
            .insert({
              name: cbdShop.name,
              address: cbdShop.address || '',
              city: cbdShop.city || '',
              postal_code: '',
              latitude: cbdShop.lat,
              longitude: cbdShop.lng,
              user_id: userId,
              claimed_by: userId,
              is_verified: true,
              source_table: 'cbd_shops',
              source_id: cbdShop.id.toString()
            })
            .select()
            .single();
          
          if (insertError) {
            console.error(`Error inserting store from CBD shop:`, insertError);
            return { success: false, message: `Erreur lors de l'enregistrement de la boutique` };
          }
          
          storeId = newStore.id;
        }
      } else {
        // Pour d'autres tables source, utiliser le processus existant...
        storeId = storeData.id;
        storeExists = true;
      }
    } else {
      // Pour les nouvelles boutiques sans source spécifique
      const { data: newStore, error: insertError } = await supabase
        .from('stores')
        .insert({
          name: storeData.name,
          address: storeData.address || '',
          city: storeData.city || '',
          postal_code: storeData.postalCode || '',
          latitude: storeData.latitude,
          longitude: storeData.longitude,
          phone: storeData.phone || '',
          website: storeData.website || '',
          description: storeData.description || '',
          photo_url: storeData.imageUrl || '',
          is_ecommerce: storeType === 'ecommerce' || storeType === 'both',
          user_id: userId,
          claimed_by: userId,
          is_verified: true
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error inserting store:', insertError);
        return { success: false, message: `Erreur lors de l'enregistrement de la boutique` };
      }
      
      storeId = newStore.id;
    }
    
    // Mise à jour du profil utilisateur avec l'ID de la boutique
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ store_id: storeId, store_type: storeType })
      .eq('id', userId);
    
    if (profileError) {
      console.error('Erreur lors de la mise à jour du profil:', profileError);
      return { success: false, message: 'Erreur lors de la mise à jour du profil' };
    }
    
    // Stockage de l'ID de boutique dans localStorage et sessionStorage
    localStorage.setItem('userStoreId', storeId);
    sessionStorage.setItem('userStoreId', storeId);
    
    return {
      success: true,
      message: storeExists
        ? 'Boutique associée avec succès au profil'
        : 'Boutique créée et associée avec succès au profil',
      storeId: storeId
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
};
