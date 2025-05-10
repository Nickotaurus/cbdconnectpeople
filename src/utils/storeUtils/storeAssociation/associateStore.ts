
import { supabase } from '@/integrations/supabase/client';
import { AssociationResult } from './types';
import { 
  searchStoreInDatabase, 
  searchStoreInLocalData, 
  checkForExistingStoreByLocation,
  isStoreClaimed
} from './searchStore';
import {
  createHistoireDeChanvreStore,
  createBasicStore,
  createStoreFromLocalData
} from './createStore';

/**
 * Check if user already has a store association
 */
export const checkExistingUserAssociation = async (userId: string): Promise<AssociationResult | null> => {
  try {
    // Get user profile
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('store_id')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error finding profile:', userError);
      return null;
    }

    if (userData?.store_id) {
      // User already has an associated store
      console.log("Store already associated:", userData.store_id);
      
      // Check if this store still exists
      const { data: storeData, error: storeCheckError } = await supabase
        .from('stores')
        .select('id, name')
        .eq('id', userData.store_id)
        .single();
      
      if (!storeCheckError && storeData) {
        // Store local IDs
        localStorage.setItem('userStoreId', userData.store_id);
        sessionStorage.setItem('userStoreId', userData.store_id);
        
        return { 
          success: true, 
          message: `This profile is already associated with store ${storeData.name}`,
          storeId: userData.store_id
        };
      } else {
        // If store no longer exists, reset the association
        await supabase
          .from('profiles')
          .update({ store_id: null })
          .eq('id', userId);
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error checking for existing association:", error);
    return null;
  }
};

/**
 * Associate a store with a user profile
 */
export const associateStoreWithProfile = async (storeId: string, userId: string): Promise<boolean> => {
  try {
    // Update the user profile with the store ID
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ store_id: storeId, store_type: 'physical' })
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return false;
    }

    // Store the store ID in localStorage and sessionStorage
    localStorage.setItem('userStoreId', storeId);
    sessionStorage.setItem('userStoreId', storeId);
    
    return true;
  } catch (error) {
    console.error('Error associating store with profile:', error);
    return false;
  }
};

/**
 * Main function to associate a store with a user
 */
export const associateStoreWithUser = async (
  storeName: string,
  city: string,
  userId: string
): Promise<AssociationResult> => {
  console.log(`Attempting to associate store "${storeName}" in ${city}`);
  
  try {
    if (!userId) {
      return { success: false, message: 'User ID not provided' };
    }

    // 1. Check if user already has a store association
    const existingAssociation = await checkExistingUserAssociation(userId);
    if (existingAssociation) {
      return existingAssociation;
    }

    // Special case for Histoire de Chanvre - reset any existing association for testing
    if (storeName.toLowerCase().includes('histoire de chanvre')) {
      // Remove store_id association from profile
      await supabase
        .from('profiles')
        .update({ store_id: null })
        .eq('id', userId);
        
      // Clean store association if it exists
      const { data: storeData } = await supabase
        .from('stores')
        .select('id')
        .ilike('name', '%Histoire de Chanvre%');
        
      if (storeData && storeData.length > 0) {
        await supabase
          .from('stores')
          .update({ user_id: null, claimed_by: null })
          .eq('id', storeData[0].id);
      }
      
      // Clean local storage
      localStorage.removeItem('userStoreId');
      sessionStorage.removeItem('userStoreId');
    }

    // 2. Search for the store in the Supabase database
    const storeData = await searchStoreInDatabase(storeName, city);
    
    if (storeData && storeData.length > 0) {
      const store = storeData[0];
      
      // Check if store is already claimed by someone else
      if (isStoreClaimed(store, userId)) {
        return { success: false, message: 'This store has already been claimed by another user' };
      }
      
      // Update the store with the user's ID
      const { error: updateError } = await supabase
        .from('stores')
        .update({ user_id: userId, claimed_by: userId })
        .eq('id', store.id);

      if (updateError) {
        console.error('Error updating store:', updateError);
        return { success: false, message: 'Error associating store' };
      }

      // Associate the store with the user profile
      const success = await associateStoreWithProfile(store.id, userId);
      if (!success) {
        return { success: false, message: 'Error updating user profile' };
      }

      return { 
        success: true, 
        message: 'Store successfully associated with profile',
        storeId: store.id
      };
    }

    // 3. Search in local data if not found in database
    const localStore = searchStoreInLocalData(storeName, city);

    if (localStore) {
      // Check if a store with similar coordinates already exists
      const existingStore = await checkForExistingStoreByLocation(localStore.latitude, localStore.longitude);
      
      if (existingStore) {
        // Check if already claimed
        if (isStoreClaimed(existingStore, userId)) {
          return { 
            success: false, 
            message: `A similar store "${existingStore.name}" at this address has already been claimed by another user` 
          };
        }
        
        // Associate this existing store with the user
        const { error: updateError } = await supabase
          .from('stores')
          .update({ user_id: userId, claimed_by: userId })
          .eq('id', existingStore.id);
        
        if (updateError) {
          console.error('Error updating store:', updateError);
          return { success: false, message: 'Error associating store' };
        }
        
        // Associate with user profile
        const success = await associateStoreWithProfile(existingStore.id, userId);
        if (!success) {
          return { success: false, message: 'Error updating user profile' };
        }
        
        return { 
          success: true, 
          message: `Store "${existingStore.name}" successfully associated with profile`,
          storeId: existingStore.id
        };
      }
      
      // Create new store from local data
      const newStore = await createStoreFromLocalData(localStore, userId);
      if (!newStore) {
        return { success: false, message: 'Error adding store to database' };
      }

      // Associate with user profile
      const success = await associateStoreWithProfile(newStore.id, userId);
      if (!success) {
        return { success: false, message: 'Error updating user profile' };
      }

      return { 
        success: true, 
        message: 'Store added and successfully associated with profile',
        storeId: newStore.id
      };
    }

    // 4. Special case for Histoire de Chanvre
    if (storeName.toLowerCase().includes('histoire') && storeName.toLowerCase().includes('chanvre')) {
      // Create a Histoire de Chanvre store
      const newStore = await createHistoireDeChanvreStore(userId, city);
      if (!newStore) {
        return { success: false, message: 'Error creating store' };
      }

      // Associate with user profile
      const success = await associateStoreWithProfile(newStore.id, userId);
      if (!success) {
        return { success: false, message: 'Error updating user profile' };
      }
      
      return { 
        success: true, 
        message: 'Store "Histoire de Chanvre" created and successfully associated',
        storeId: newStore.id
      };
    }

    // 5. Create a basic store with provided information
    if (storeName && city) {
      const newStore = await createBasicStore(storeName, city, userId);
      if (!newStore) {
        return { success: false, message: 'Error creating store' };
      }

      // Associate with user profile
      const success = await associateStoreWithProfile(newStore.id, userId);
      if (!success) {
        return { success: false, message: 'Error updating user profile' };
      }
      
      return { 
        success: true, 
        message: `New store "${storeName}" created and successfully associated`,
        storeId: newStore.id
      };
    }

    // If no match found
    return { 
      success: false, 
      message: `Store "${storeName}"${city ? ` in ${city}` : ''} not found. Please check spelling or try another name.` 
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};
