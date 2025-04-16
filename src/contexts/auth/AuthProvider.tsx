
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
    
    let isAuthenticated = false;
    let authInitialized = false;

    // Set up Supabase auth event listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔐 Auth State Change: ${event}`);
        
        // Don't process events until initialization is complete
        if (!authInitialized && event !== 'INITIAL_SESSION') {
          console.log("Skipping auth event until initialization is complete");
          return;
        }
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setIsLoading(true);
          isAuthenticated = true;
          
          if (session?.user?.id) {
            console.log("🔐 User session detected, loading profile");
            try {
              const userProfile = await loadUserProfile(session.user.id);
              if (userProfile) {
                console.log("🔐 User profile loaded successfully");
                setUser(userProfile);
                localStorage.setItem("cbdUser", JSON.stringify(userProfile));
              }
            } catch (error) {
              console.error("Error loading user profile:", error);
            } finally {
              setIsLoading(false); // Always reset loading state
            }
          } else {
            setIsLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("🔐 User signed out");
          setUser(null);
          localStorage.removeItem("cbdUser");
          isAuthenticated = false;
          setIsLoading(false); // Reset loading state after signout
        } else {
          // For any other auth events, ensure loading state is reset
          setIsLoading(false);
        }
      }
    );

    // Check if user is already logged in
    const initializeAuth = async () => {
      console.log("🔐 Initializing authentication");
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          isAuthenticated = true;
          console.log("🔐 Existing session found");
          try {
            const userProfile = await loadUserProfile(session.user.id);
            if (userProfile) {
              console.log("🔐 Existing user profile loaded");
              setUser(userProfile);
              localStorage.setItem("cbdUser", JSON.stringify(userProfile));
            }
          } catch (error) {
            console.error("Error loading user profile:", error);
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
      } catch (error) {
        console.error("🔐 Error initializing auth:", error);
      } finally {
        // Always reset loading state when initialization completes
        setIsLoading(false);
        authInitialized = true;
      }
    };

    initializeAuth();

    return () => {
      console.log("🔐 Cleaning up auth provider");
      authListener.subscription.unsubscribe();
    };
  }, [setUser, setIsLoading]);

  // Create a value object with all the context properties
  const contextValue: AuthContextType = {
    user, 
    isLoading, 
    login: handleLogin, 
    logout: handleLogout, 
    register: handleRegister, 
    updateUserPreferences: handleUpdateUserPreferences
  };

  console.log("🔐 Rendering AuthProvider with context:", { 
    user: user ? `User ${user.id} (${user.role})` : "No user", 
    isLoading 
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
