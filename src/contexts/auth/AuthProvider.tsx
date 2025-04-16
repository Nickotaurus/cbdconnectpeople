
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
    console.log("🔐 AuthProvider initialized");
    console.log("Current user:", user);
    console.log("Loading state:", isLoading);

    // Set up Supabase auth event listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔐 Auth State Change: ${event}`);
        setIsLoading(true);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user?.id) {
            console.log("🔐 User session detected, loading profile");
            const userProfile = await loadUserProfile(session.user.id);
            if (userProfile) {
              console.log("🔐 User profile loaded successfully");
              setUser(userProfile);
              localStorage.setItem("cbdUser", JSON.stringify(userProfile));
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("🔐 User signed out");
          setUser(null);
          localStorage.removeItem("cbdUser");
        }
        
        setIsLoading(false);
      }
    );

    // Check if user is already logged in
    const initializeAuth = async () => {
      console.log("🔐 Initializing authentication");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        console.log("🔐 Existing session found");
        const userProfile = await loadUserProfile(session.user.id);
        if (userProfile) {
          console.log("🔐 Existing user profile loaded");
          setUser(userProfile);
          localStorage.setItem("cbdUser", JSON.stringify(userProfile));
        }
      } else {
        console.log("🔐 No existing session found");
        const storedUser = localStorage.getItem("cbdUser");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error("🔐 Error parsing stored user:", error);
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
