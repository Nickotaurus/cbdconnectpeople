
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
    console.log("Loading profile for user:", userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error("Error loading profile:", error);
      return null;
    }

    if (!data) {
      console.log("No profile found for user:", userId);
      return null;
    }

    console.log("Profile data loaded:", data);
    
    // Build user object based on role
    let userObj: User;
    
    switch (data.role) {
      case 'client':
        userObj = {
          id: data.id,
          email: data.email || '',
          name: data.name || '',
          role: 'client',
          createdAt: data.created_at,
          favorites: data.favorites || [],
          favoriteProducts: data.favorite_products || [],
          tickets: data.tickets || 3,
          rewards: data.rewards || 0,
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
          id: data.id,
          email: data.email || '',
          name: data.name || '',
          role: 'store',
          createdAt: data.created_at,
          storeType: data.store_type || 'physical',
          siretVerified: data.siret_verified || false,
          partnerFavorites: data.partner_favorites || [],
          isVerified: data.is_verified || false,
          needsSubscription: data.store_type === 'ecommerce' || data.store_type === 'both',
          storeId: data.store_id || undefined
        } as StoreUser;
        break;
      case 'partner':
        const partnerId = data.partner_id;
        console.log("Creating partner user with partner_id:", partnerId);
        
        userObj = {
          id: data.id,
          email: data.email || '',
          name: data.name || '',
          role: 'partner',
          createdAt: data.created_at,
          partnerCategory: data.partner_category || '',
          verified: data.is_verified || false,
          certifications: data.certifications || [],
          partnerId: partnerId
        } as PartnerUser;
        console.log("Created partner user object:", userObj);
        break;
      default:
        userObj = {
          id: data.id,
          email: data.email || '',
          name: data.name || '',
          role: (data.role as UserRole) || 'client',
          createdAt: data.created_at,
          isVerified: data.is_verified || false
        };
    }

    return userObj;
  } catch (error) {
    console.error("Error loading profile:", error);
    return null;
  }
};
