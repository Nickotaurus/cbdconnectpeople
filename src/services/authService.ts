import { UserRole } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { loadUserProfile } from "@/hooks/useUserProfile";

/**
 * Service responsible for authentication operations
 */
export const authService = {
  /**
   * Sign in with email and password
   */
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Supabase auth error:", error);
      throw error;
    }

    if (data.user) {
      console.log("Supabase auth success for user:", data.user.id);
      const userProfile = await loadUserProfile(data.user.id);
      console.log("Loaded user profile:", userProfile);
      return userProfile;
    }
    
    return null;
  },

  /**
   * Sign up a new user
   */
  register: async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole,
    roleSpecificData?: {
      storeType?: string;
      partnerCategory?: string;
    }
  ) => {
    // Prepare user metadata for profile creation via trigger
    const userData = {
      name,
      role,
      ...(roleSpecificData?.storeType && { storeType: roleSpecificData.storeType }),
      ...(roleSpecificData?.partnerCategory && { partnerCategory: roleSpecificData.partnerCategory }),
    };

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      }
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      // Wait for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update profile with role-specific data
      if (role === 'store' && roleSpecificData?.storeType) {
        await supabase
          .from('profiles')
          .update({ 
            store_type: roleSpecificData.storeType,
            siret_verified: false,
            needs_subscription: roleSpecificData.storeType === 'ecommerce' || roleSpecificData.storeType === 'both',
            is_verified: false
          })
          .eq('id', data.user.id);
      } else if (role === 'partner' && roleSpecificData?.partnerCategory) {
        await supabase
          .from('profiles')
          .update({ 
            partner_category: roleSpecificData.partnerCategory,
            is_verified: false
          })
          .eq('id', data.user.id);
      }
      
      // Load the complete profile
      const userProfile = await loadUserProfile(data.user.id);
      return userProfile;
    }
    
    return null;
  },

  /**
   * Sign out the current user
   */
  logout: async () => {
    return await supabase.auth.signOut();
  },

  /**
   * Get the current session
   */
  getSession: async () => {
    return await supabase.auth.getSession();
  }
};
