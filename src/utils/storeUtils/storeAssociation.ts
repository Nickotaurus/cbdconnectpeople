
import { supabase } from '@/integrations/supabase/client';
import { stores } from './storeOperations';

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
      } else {
        // Si la boutique n'existe plus, réinitialiser l'association
        await supabase
          .from('profiles')
          .update({ store_id: null })
          .eq('id', userId);
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
      
      // Vérifier si cette boutique locale existe déjà sous un autre nom dans Supabase
      const { data: existingStores } = await supabase
        .from('stores')
        .select('id, name, address, latitude, longitude')
        .eq('latitude', localStore.latitude)
        .eq('longitude', localStore.longitude);
      
      if (existingStores && existingStores.length > 0) {
        // Une boutique avec les mêmes coordonnées existe déjà
        const existingStore = existingStores[0];
        
        console.log('Boutique similaire déjà existante:', existingStore.name);
        
        // Vérifier si elle est déjà réclamée
        if (existingStore.claimed_by && existingStore.claimed_by !== userId) {
          return { 
            success: false, 
            message: `Une boutique similaire "${existingStore.name}" à cette adresse a déjà été réclamée par un autre utilisateur` 
          };
        }
        
        // Associer cette boutique existante à l'utilisateur
        const { error: updateError } = await supabase
          .from('stores')
          .update({ user_id: userId, claimed_by: userId })
          .eq('id', existingStore.id);
        
        if (updateError) {
          console.error('Erreur lors de la mise à jour de la boutique:', updateError);
          return { success: false, message: 'Erreur lors de l\'association de la boutique' };
        }
        
        // Mise à jour du profil utilisateur
        await supabase
          .from('profiles')
          .update({ store_id: existingStore.id, store_type: 'physical' })
          .eq('id', userId);
          
        localStorage.setItem('userStoreId', existingStore.id);
        sessionStorage.setItem('userStoreId', existingStore.id);
        
        return { 
          success: true, 
          message: `Boutique "${existingStore.name}" associée avec succès au profil`,
          storeId: existingStore.id
        };
      }
      
      // Si trouvée dans les données locales et pas de doublon, l'ajouter à Supabase puis l'associer
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

    return { success: false, message: 'Boutique non trouvée' };
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
};
