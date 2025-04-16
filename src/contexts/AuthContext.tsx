
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/authService";
import { loadUserProfile } from "@/hooks/useUserProfile";
import { updateUserPreferences } from "@/hooks/useUserPreferences";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole,
    roleSpecificData?: {
      storeType?: string;
      partnerCategory?: string;
    }
  ) => Promise<void>;
  updateUserPreferences: (
    preferences: Partial<{ 
      favorites: string[], 
      favoriteProducts: string[],
      partnerFavorites: string[] 
    }>
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
      const { data: { session } } = await authService.getSession();
      
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
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userProfile = await authService.login(email, password);
      
      if (userProfile) {
        setUser(userProfile);
        localStorage.setItem("cbdUser", JSON.stringify(userProfile));
        return userProfile;
      }
      return null;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole,
    roleSpecificData?: {
      storeType?: string;
      partnerCategory?: string;
    }
  ) => {
    setIsLoading(true);
    try {
      const userProfile = await authService.register(
        email, 
        password, 
        name, 
        role, 
        roleSpecificData
      );
      
      if (userProfile) {
        setUser(userProfile);
        localStorage.setItem("cbdUser", JSON.stringify(userProfile));
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateUserPreferences = async (
    preferences: Partial<{ 
      favorites: string[], 
      favoriteProducts: string[], 
      partnerFavorites: string[] 
    }>
  ) => {
    try {
      const updatedUser = await updateUserPreferences(user, preferences);
      setUser(updatedUser);
      localStorage.setItem("cbdUser", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem("cbdUser");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      register, 
      updateUserPreferences: handleUpdateUserPreferences 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
