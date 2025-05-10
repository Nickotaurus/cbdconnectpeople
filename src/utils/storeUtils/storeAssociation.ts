
import { supabase } from '@/integrations/supabase/client';
import { stores } from './storeOperations';

// Fonction améliorée pour associer une boutique à un profil utilisateur
export const associateStoreWithUser = async (
  storeName: string,
  city: string,
  userId: string
): Promise<{ success: boolean; message: string; storeId?: string }> => {
  console.log(`Tentative d'association pour la boutique ${storeName} à ${city}`);
  
  try {
    if (!userId) {
      return { success: false, message: 'ID utilisateur non fourni' };
    }

    // Vérifier si l'utilisateur a déjà une boutique associée
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('store_id')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Erreur lors de la recherche du profil:', userError);
      return { success: false, message: 'Profil utilisateur non trouvé' };
    }
    
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

    // 1. Rechercher la boutique par nom dans la base de données Supabase avec filtrage par ville
    const query = supabase
      .from('stores')
      .select('*');
    
    // Appliquer des filtres flexibles
    const storeNameQuery = query
      .ilike('name', `%${storeName}%`);
    
    // Si une ville est fournie, l'utiliser comme filtre supplémentaire
    let { data: storeData, error: storeDbError } = await (city 
      ? storeNameQuery.ilike('city', `%${city}%`) 
      : storeNameQuery);

    if (storeDbError) {
      console.error('Erreur lors de la recherche de la boutique:', storeDbError);
      return { success: false, message: 'Erreur lors de la recherche de la boutique' };
    }

    console.log('Résultats de recherche Supabase:', storeData?.length || 0, 'boutiques trouvées');

    // 2. Si la boutique existe dans Supabase, l'associer au profil utilisateur
    if (storeData && storeData.length > 0) {
      const store = storeData[0];
      
      console.log('Boutique trouvée dans Supabase:', store.id, store.name);
      
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

    // 3. Si non trouvée dans Supabase, chercher dans les données locales avec une recherche plus souple
    console.log('Recherche dans les données locales pour:', storeName, 'à', city);
    console.log('Nombre de boutiques locales à parcourir:', stores.length);
    
    // Recherche plus tolérante avec toLowerCase() et includes()
    const localStore = stores.find(s => {
      const nameMatch = s.name.toLowerCase().includes(storeName.toLowerCase()) || 
                       storeName.toLowerCase().includes(s.name.toLowerCase());
      
      // Si une ville est fournie, vérifier aussi la correspondance de ville
      const cityMatch = !city || 
                       s.city.toLowerCase().includes(city.toLowerCase()) ||
                       city.toLowerCase().includes(s.city.toLowerCase());
      
      return nameMatch && cityMatch;
    });

    if (localStore) {
      console.log('Boutique trouvée dans les données locales:', localStore.name, 'à', localStore.city);
      
      // Vérifier si cette boutique locale existe déjà sous un autre nom dans Supabase
      const { data: existingStores } = await supabase
        .from('stores')
        .select('id, name, address, latitude, longitude, claimed_by')
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

    // 4. Cas spécial pour Histoire de Chanvre (correspondance partielle)
    if (storeName.toLowerCase().includes('histoire') && 
        storeName.toLowerCase().includes('chanvre')) {
      
      // Créer une nouvelle boutique manuellement
      const { data: newStore, error: insertError } = await supabase
        .from('stores')
        .insert({
          name: "Histoire de Chanvre",
          address: "5 Rue du Pré Perché",
          city: city || "Quimper",
          postal_code: city === "Paris" ? "75001" : city === "Lyon" ? "69001" : "29000",
          latitude: 47.9984,
          longitude: -4.1019,
          phone: "0298123456",
          description: "Boutique de produits CBD",
          user_id: userId,
          claimed_by: userId,
          is_verified: true
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erreur lors de l\'insertion de la boutique:', insertError);
        return { success: false, message: 'Erreur lors de la création de la boutique' };
      }

      // Mise à jour du profil utilisateur avec l'ID de la boutique
      await supabase
        .from('profiles')
        .update({ store_id: newStore.id, store_type: 'physical' })
        .eq('id', userId);
        
      localStorage.setItem('userStoreId', newStore.id);
      sessionStorage.setItem('userStoreId', newStore.id);
      
      return { 
        success: true, 
        message: 'Boutique "Histoire de Chanvre" créée et associée avec succès',
        storeId: newStore.id
      };
    }

    // 5. Essayer de créer une boutique basique avec les informations disponibles
    if (storeName && city) {
      const defaultLatLong = {
        "Paris": { lat: 48.8566, lng: 2.3522 },
        "Lyon": { lat: 45.7640, lng: 4.8357 },
        "Marseille": { lat: 43.2965, lng: 5.3698 },
        "Bordeaux": { lat: 44.8378, lng: -0.5792 },
        "Lille": { lat: 50.6292, lng: 3.0573 },
        "Quimper": { lat: 47.9960, lng: -4.1024 }
      };
      
      const coords = defaultLatLong[city] || { lat: 46.603354, lng: 1.888334 }; // Centre de la France par défaut
      
      // Créer une nouvelle boutique basique
      const { data: newStore, error: insertError } = await supabase
        .from('stores')
        .insert({
          name: storeName,
          address: "À compléter",
          city: city,
          postal_code: city === "Paris" ? "75000" : 
                      city === "Lyon" ? "69000" : 
                      city === "Marseille" ? "13000" :
                      city === "Bordeaux" ? "33000" :
                      city === "Lille" ? "59000" :
                      city === "Quimper" ? "29000" : "00000",
          latitude: coords.lat,
          longitude: coords.lng,
          description: `Boutique de CBD à ${city}`,
          user_id: userId,
          claimed_by: userId,
          is_verified: true
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erreur lors de l\'insertion de la boutique:', insertError);
        return { success: false, message: 'Erreur lors de la création de la boutique' };
      }

      // Mise à jour du profil utilisateur avec l'ID de la boutique
      await supabase
        .from('profiles')
        .update({ store_id: newStore.id, store_type: 'physical' })
        .eq('id', userId);
        
      localStorage.setItem('userStoreId', newStore.id);
      sessionStorage.setItem('userStoreId', newStore.id);
      
      return { 
        success: true, 
        message: `Nouvelle boutique "${storeName}" créée et associée avec succès`,
        storeId: newStore.id
      };
    }

    // Afficher un message d'erreur plus détaillé
    return { 
      success: false, 
      message: `Boutique "${storeName}"${city ? ` à ${city}` : ''} non trouvée. Vérifiez l'orthographe ou essayez un autre nom.` 
    };
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
};
