
import React, { createContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { loadUserProfile } from "@/hooks/useUserProfile";
import { useAuthState } from "./useAuthState";
import type { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    setUser,
    isLoading,
    setIsLoading,
    handleLogin,
    handleLogout,
    handleRegister,
    handleUpdateUserPreferences
  } = useAuthState();

  useEffect(() => {
    // Set up Supabase auth event listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user?.id) {
            const userProfile = await loadUserProfile(session.user.id);
            if (userProfile) {
              setUser(userProfile);
              localStorage.setItem("cbdUser", JSON.stringify(userProfile));
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem("cbdUser");
        }
        
        setIsLoading(false);
      }
    );

    // Check if user is already logged in
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        const userProfile = await loadUserProfile(session.user.id);
        if (userProfile) {
          setUser(userProfile);
          localStorage.setItem("cbdUser", JSON.stringify(userProfile));
        }
      } else {
        // Check if user data is stored locally (for backward compatibility)
        const storedUser = localStorage.getItem("cbdUser");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error("Erreur lors de l'analyse de l'utilisateur stocké:", error);
            localStorage.removeItem("cbdUser");
          }
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser, setIsLoading]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login: handleLogin, 
      logout: handleLogout, 
      register: handleRegister, 
      updateUserPreferences: handleUpdateUserPreferences 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
