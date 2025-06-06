
import { useState } from "react";
import { User } from "@/types/auth";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/authService";
import { loadUserProfile } from "@/hooks/useUserProfile";
import { updateUserPreferences as updatePreferences } from "@/hooks/useUserPreferences";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log(`Login attempt initiated for: ${email}`);
      const userProfile = await authService.login(email, password);
      
      if (userProfile) {
        console.log("Login successful, user profile data:", userProfile);
        setUser(userProfile);
        localStorage.setItem("cbdUser", JSON.stringify(userProfile));
        return userProfile;
      } else {
        console.log("No user profile returned from login");
        setIsLoading(false); // Explicitly reset loading state when no profile
      }
      return null;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
      setIsLoading(false); // Reset loading state on error
      throw error;
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem("cbdUser");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    } finally {
      setIsLoading(false); // Reset loading state after logout attempt
    }
  };

  const handleRegister = async (
    email: string, 
    password: string, 
    name: string, 
    role: any,
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
      
      return userProfile;
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false); // Always reset loading state when finished
    }
  };

  const handleUpdateUserPreferences = async (
    preferences: Partial<{ 
      favorites: string[], 
      favoriteProducts: string[], 
      partnerFavorites: string[] 
    }>
  ) => {
    setIsLoading(true);
    try {
      const updatedUser = await updatePreferences(user, preferences);
      setUser(updatedUser);
      localStorage.setItem("cbdUser", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      throw error;
    } finally {
      setIsLoading(false); // Always reset loading state when finished
    }
  };

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    handleLogin,
    handleLogout,
    handleRegister,
    handleUpdateUserPreferences
  };
};
