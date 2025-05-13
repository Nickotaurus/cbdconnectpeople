
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
        // Handle CBD shops special case
        const result = await processCbdShop(userId, storeData);
        return result;
      } else {
        // For other source tables, use the existing process...
        storeId = storeData.id || '';
        storeExists = true;
      }
    } else {
      // For new stores without a specific source
      const newStoreResult = await createNewStore(userId, storeData, storeType);
      if (!newStoreResult.success) {
        return newStoreResult;
      }
      storeId = newStoreResult.storeId || '';
    }
    
    // Update user profile with store ID
    try {
      const updateResult = await updateUserProfile(userId, storeId, storeType);
      if (!updateResult.success) {
        return updateResult;
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

/**
 * Update user profile with store ID
 */
async function updateUserProfile(
  userId: string, 
  storeId: string, 
  storeType: 'physical' | 'ecommerce' | 'both'
): Promise<AssociationResult> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ store_id: storeId, store_type: storeType })
      .eq('id', userId);
    
    if (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return { success: false, message: 'Erreur lors de la mise à jour du profil' };
    }
    
    return { success: true, message: 'Profil mis à jour avec succès' };
  } catch (error) {
    console.error('Unexpected error during profile update:', error);
    return { success: false, message: 'Erreur lors de la mise à jour du profil' };
  }
}

/**
 * Process CBD shop specific association
 */
async function processCbdShop(
  userId: string,
  storeData: StoreBasicInfo
): Promise<AssociationResult> {
  try {
    // First check if the store has already been migrated
    const { data: existingStoreData, error: existingStoreError } = await supabase
      .from('stores')
      .select('id')
      .eq('source_table', 'cbd_shops')
      .eq('source_id', storeData.sourceId || '')
      .maybeSingle();
    
    if (existingStoreError) {
      console.error(`Error checking for existing store: ${existingStoreError.message}`);
      // Continue with the process, we'll try to create a new one
    } else if (existingStoreData) {
      console.log(`CBD shop already migrated to stores table with ID ${existingStoreData.id}`);
      return { 
        success: true, 
        message: 'Boutique associée avec succès au profil', 
        storeId: existingStoreData.id 
      };
    }
    
    // Fetch the CBD shop
    const { data: cbdShops, error: cbdShopError } = await supabase
      .from('cbd_shops')
      .select('*')
      .eq('id', parseInt(storeData.sourceId || '0'))
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
    
    // Insert the store
    const { error: insertError } = await supabase
      .from('stores')
      .insert(insertData);
    
    if (insertError) {
      console.error(`Error inserting store from CBD shop:`, insertError);
      return { success: false, message: `Erreur lors de l'enregistrement de la boutique` };
    }
    
    // Get the inserted store
    const { data: newStoreData, error: newStoreError } = await supabase
      .from('stores')
      .select('id')
      .eq('source_table', 'cbd_shops')
      .eq('source_id', cbdShops.id.toString())
      .maybeSingle();
    
    if (newStoreError || !newStoreData) {
      console.error(`Error retrieving inserted store:`, newStoreError);
      return { success: false, message: `Erreur lors de l'enregistrement de la boutique` };
    }
    
    return { 
      success: true, 
      message: 'Boutique créée et associée avec succès au profil', 
      storeId: newStoreData.id 
    };
  } catch (error) {
    console.error('Unexpected error during CBD shop processing:', error);
    return { success: false, message: `Erreur lors du traitement des données de la boutique` };
  }
}

/**
 * Create a new store
 */
async function createNewStore(
  userId: string,
  storeData: StoreBasicInfo,
  storeType: 'physical' | 'ecommerce' | 'both'
): Promise<AssociationResult> {
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
    // Insert the store
    const { error: insertError } = await supabase
      .from('stores')
      .insert(insertData);
    
    if (insertError) {
      console.error('Error inserting store:', insertError);
      return { success: false, message: `Erreur lors de l'enregistrement de la boutique` };
    }
    
    // Query for the inserted store
    const { data: newStoreData, error: newStoreError } = await supabase
      .from('stores')
      .select('id')
      .eq('name', storeData.name)
      .eq('user_id', userId)
      .order('registration_date', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (newStoreError || !newStoreData) {
      console.error('Error retrieving inserted store:', newStoreError);
      return { success: false, message: `Erreur lors de l'enregistrement de la boutique` };
    }
    
    return { 
      success: true, 
      message: 'Boutique créée avec succès', 
      storeId: newStoreData.id 
    };
  } catch (error) {
    console.error('Unexpected error during store creation:', error);
    return { success: false, message: `Erreur lors de l'enregistrement de la boutique` };
  }
}
