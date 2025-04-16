
import { User, UserRole, ClientUser, StoreUser, PartnerUser } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { badges } from "@/components/badges/UserBadges";
import { Database } from "@/integrations/supabase/types";

// Type for Supabase profile rows
type ProfilesRow = Database['public']['Tables']['profiles']['Row'];

/**
 * Loads a user profile from Supabase based on the user ID
 */
export const loadUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Erreur lors du chargement du profil:", error);
      return null;
    }

    if (!data) return null;

    // Build user object based on role
    let userObj: User;
    
    const profile = data as ProfilesRow;
    
    switch (profile.role) {
      case 'client':
        userObj = {
          id: profile.id,
          email: profile.email || '',
          name: profile.name || '',
          role: 'client',
          createdAt: profile.created_at,
          favorites: profile.favorites || [],
          favoriteProducts: profile.favorite_products || [],
          tickets: profile.tickets || 3,
          rewards: profile.rewards || 0,
          badges: [
            {
              id: badges[0].id,
              name: badges[0].name,
              description: badges[0].description,
              icon: badges[0].icon,
              earnedAt: new Date().toISOString()
            }
          ]
        } as ClientUser;
        break;
      case 'store':
        userObj = {
          id: profile.id,
          email: profile.email || '',
          name: profile.name || '',
          role: 'store',
          createdAt: profile.created_at,
          storeType: profile.store_type || 'physical',
          siretVerified: profile.siret_verified || false,
          partnerFavorites: profile.partner_favorites || [],
          isVerified: profile.is_verified || false,
          needsSubscription: profile.store_type === 'ecommerce' || profile.store_type === 'both',
          storeId: (profile as any).store_id
        } as StoreUser;
        break;
      case 'partner':
        userObj = {
          id: profile.id,
          email: profile.email || '',
          name: profile.name || '',
          role: 'partner',
          createdAt: profile.created_at,
          partnerCategory: profile.partner_category || '',
          verified: profile.is_verified || false,
          certifications: profile.certifications || [],
          partnerId: (profile as any).partner_id
        } as PartnerUser;
        break;
      default:
        userObj = {
          id: profile.id,
          email: profile.email || '',
          name: profile.name || '',
          role: (profile.role as UserRole) || 'client',
          createdAt: profile.created_at,
          isVerified: profile.is_verified || false
        };
    }

    return userObj;
  } catch (error) {
    console.error("Erreur lors du chargement du profil:", error);
    return null;
  }
};
