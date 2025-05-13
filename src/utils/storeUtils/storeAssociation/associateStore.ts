
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
    
    // If we have a sourceTable and sourceId, it means the store already exists
    // in a specific source table (like cbd_shops)
    if (storeData.sourceTable && storeData.sourceId) {
      console.log(`Store from source table ${storeData.sourceTable} with ID ${storeData.sourceId}`);
      
      if (storeData.sourceTable === 'cbd_shops') {
        try {
          // First check if the store has already been migrated
          const { data: existingStore, error: existingStoreError } = await supabase
            .from('stores')
            .select('id')
            .eq('source_table', 'cbd_shops')
            .eq('source_id', storeData.sourceId)
            .maybeSingle();
          
          if (existingStoreError) {
            console.error(`Error checking for existing store: ${existingStoreError.message}`);
            // Continue with the process, we'll try to create a new one
          } else if (existingStore) {
            console.log(`CBD shop already migrated to stores table with ID ${existingStore.id}`);
            storeId = existingStore.id;
            storeExists = true;
          } else {
            // Migrate from cbd_shops to stores
            const { data: cbdShops, error: cbdShopError } = await supabase
              .from('cbd_shops')
              .select('*')
              .eq('id', parseInt(storeData.sourceId))
              .maybeSingle();
            
            if (cbdShopError || !cbdShops) {
              console.error(`Error fetching CBD shop with ID ${storeData.sourceId}:`, cbdShopError);
              return { success: false, message: `Boutique introuvable dans la base de données` };
            }
            
            // Insert into stores table
            const insertData = {
              name: cbdShops.name,
              address: cbdShops.address || '',
              city: cbdShops.city || '',
              postal_code: '',
              latitude: cbdShops.lat,
              longitude: cbdShops.lng,
              user_id: userId,
              claimed_by: userId,
              is_verified: true,
              source_table: 'cbd_shops',
              source_id: cbdShops.id.toString()
            };
            
            const { error: insertError } = await supabase
              .from('stores')
              .insert(insertData);
              
            if (insertError) {
              console.error(`Error inserting store from CBD shop:`, insertError);
              return { success: false, message: `Erreur lors de l'enregistrement de la boutique` };
            }
            
            // Get the inserted row with a separate query
            const { data: newStore, error: selectError } = await supabase
              .from('stores')
              .select('id')
              .eq('source_table', 'cbd_shops')
              .eq('source_id', cbdShops.id.toString())
              .maybeSingle();
              
            if (selectError || !newStore) {
              console.error(`Error retrieving inserted store:`, selectError);
              return { success: false, message: `Erreur lors de l'enregistrement de la boutique` };
            }
            
            storeId = newStore.id;
          }
        } catch (error) {
          console.error('Unexpected error during CBD shop processing:', error);
          return { success: false, message: `Erreur lors du traitement des données de la boutique` };
        }
      } else {
        // For other source tables, use the existing process...
        storeId = storeData.id || '';
        storeExists = true;
      }
    } else {
      // For new stores without a specific source
      const insertData = {
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
      };
      
      try {
        // Insert as a separate step
        const { error: insertError } = await supabase
          .from('stores')
          .insert(insertData);
          
        if (insertError) {
          console.error('Error inserting store:', insertError);
          return { success: false, message: `Erreur lors de l'enregistrement de la boutique` };
        }
        
        // Query for the inserted store as a separate step
        const { data: newlyCreatedStores, error: selectError } = await supabase
          .from('stores')
          .select('id')
          .eq('name', storeData.name)
          .eq('user_id', userId)
          .order('registration_date', { ascending: false })
          .limit(1);
          
        if (selectError || !newlyCreatedStores || newlyCreatedStores.length === 0) {
          console.error('Error retrieving inserted store:', selectError);
          return { success: false, message: `Erreur lors de l'enregistrement de la boutique` };
        }
        
        storeId = newlyCreatedStores[0].id;
      } catch (error) {
        console.error('Unexpected error during store creation:', error);
        return { success: false, message: `Erreur lors de l'enregistrement de la boutique` };
      }
    }
    
    // Update user profile with store ID
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ store_id: storeId, store_type: storeType })
        .eq('id', userId);
      
      if (updateError) {
        console.error('Erreur lors de la mise à jour du profil:', updateError);
        return { success: false, message: 'Erreur lors de la mise à jour du profil' };
      }
    } catch (error) {
      console.error('Unexpected error during profile update:', error);
      return { success: false, message: 'Erreur lors de la mise à jour du profil' };
    }
    
    // Store the store ID in localStorage and sessionStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userStoreId', storeId);
      sessionStorage.setItem('userStoreId', storeId);
    }
    
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
