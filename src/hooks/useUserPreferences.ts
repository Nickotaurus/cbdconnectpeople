
import { User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates user preferences in Supabase
 */
export const updateUserPreferences = async (
  user: User | null,
  preferences: Partial<{ 
    favorites: string[], 
    favoriteProducts: string[], 
    partnerFavorites: string[] 
  }>
): Promise<User> => {
  if (!user) throw new Error("Utilisateur non connecté");
  
  try {
    // Update in Supabase
    const updateData: Record<string, any> = {};
    
    if (preferences.favorites !== undefined) {
      updateData.favorites = preferences.favorites;
    }
    
    if (preferences.favoriteProducts !== undefined) {
      updateData.favorite_products = preferences.favoriteProducts;
    }
    
    if (preferences.partnerFavorites !== undefined) {
      updateData.partner_favorites = preferences.partnerFavorites;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);
      
    if (error) throw error;
    
    // Update local user state
    const updatedUser = { ...user, ...preferences };
    return updatedUser;
    
  } catch (error) {
    console.error("Erreur lors de la mise à jour des préférences:", error);
    throw error;
  }
};
