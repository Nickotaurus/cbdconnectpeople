
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
    console.log(`Attempting login for email: ${email}`);
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
      
      // Specific debug for checking if this user exists in profiles
      try {
        const { data: profileCheck, error: profileError } = await supabase
          .from('profiles')
          .select('id, role, partner_id, partner_category')
          .eq('id', data.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error("Error fetching profile directly:", profileError);
        } else {
          console.log("Direct profile check result:", profileCheck);
        }
      } catch (e) {
        console.error("Exception during profile check:", e);
      }
      
      // Add a small delay to ensure database trigger has completed
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const userProfile = await loadUserProfile(data.user.id);
      console.log("Full user profile loaded:", userProfile);
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
    console.log("Registration data:", { email, name, role, roleSpecificData });
    
    // Prepare user metadata for profile creation via trigger
    const userData = {
      name,
      role,
      ...(roleSpecificData?.storeType && { storeType: roleSpecificData.storeType }),
      ...(roleSpecificData?.partnerCategory && { partnerCategory: roleSpecificData.partnerCategory }),
    };

    console.log("Sending user metadata:", userData);

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      }
    });

    if (error) {
      console.error("Registration error:", error);
      throw error;
    }

    if (data.user) {
      console.log("User registered successfully:", data.user.id);
      
      // Wait for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
        console.log("Updating partner profile with category:", roleSpecificData.partnerCategory);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            partner_category: roleSpecificData.partnerCategory,
            is_verified: false,
            partner_id: null // Explicitly set to null at registration
          })
          .eq('id', data.user.id);
        
        if (updateError) {
          console.error("Error updating partner profile:", updateError);
        }
      }
      
      // Load the complete profile
      const userProfile = await loadUserProfile(data.user.id);
      console.log("User profile after registration:", userProfile);
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
