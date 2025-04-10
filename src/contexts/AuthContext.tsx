
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, ClientUser, StoreUser, PartnerUser } from "@/types/auth";
import { badges } from "@/components/badges/UserBadges";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
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

  // Fonction pour charger les données du profil utilisateur depuis Supabase
  const loadUserProfile = async (userId: string) => {
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

      // Construction de l'objet utilisateur en fonction du rôle
      let userObj: User;
      
      switch (data.role) {
        case 'client':
          userObj = {
            id: data.id,
            email: data.email,
            name: data.name,
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
            email: data.email,
            name: data.name,
            role: 'store',
            createdAt: data.created_at,
            storeType: data.store_type || 'physical',
            siretVerified: data.siret_verified || false,
            partnerFavorites: data.partner_favorites || [],
            isVerified: data.is_verified || false,
            needsSubscription: data.store_type === 'ecommerce' || data.store_type === 'both'
          } as StoreUser;
          break;
        case 'partner':
          userObj = {
            id: data.id,
            email: data.email,
            name: data.name,
            role: 'partner',
            createdAt: data.created_at,
            partnerCategory: data.partner_category || '',
            verified: data.is_verified || false,
            certifications: data.certifications || []
          } as PartnerUser;
          break;
        default:
          userObj = {
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role as UserRole,
            createdAt: data.created_at,
            isVerified: data.is_verified || false
          };
      }

      return userObj;
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      return null;
    }
  };

  useEffect(() => {
    // Configurer l'écouteur d'événements d'authentification Supabase
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

    // Vérifier si l'utilisateur est déjà connecté
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        const userProfile = await loadUserProfile(session.user.id);
        if (userProfile) {
          setUser(userProfile);
          localStorage.setItem("cbdUser", JSON.stringify(userProfile));
        }
      } else {
        // Vérifier si les données sont stockées localement (pour la rétrocompatibilité)
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const userProfile = await loadUserProfile(data.user.id);
        if (userProfile) {
          setUser(userProfile);
          localStorage.setItem("cbdUser", JSON.stringify(userProfile));
        }
      }
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
      // Préparation des métadonnées utilisateur pour la création du profil via le trigger
      const userData = {
        name,
        role,
        ...(roleSpecificData?.storeType && { storeType: roleSpecificData.storeType }),
        ...(roleSpecificData?.partnerCategory && { partnerCategory: roleSpecificData.partnerCategory }),
      };

      // Inscription avec Supabase
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
        // Attendre un moment pour permettre au trigger de créer le profil
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mettre à jour le profil avec les données spécifiques au rôle
        if (role === 'store' && roleSpecificData?.storeType) {
          await supabase
            .from('profiles')
            .update({ 
              store_type: roleSpecificData.storeType,
              siret_verified: false,
              needs_subscription: roleSpecificData.storeType === 'ecommerce' || roleSpecificData.storeType === 'both',
              is_verified: role === 'client' // Les clients sont vérifiés par défaut
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
        
        // Charger le profil complet
        const userProfile = await loadUserProfile(data.user.id);
        if (userProfile) {
          setUser(userProfile);
          localStorage.setItem("cbdUser", JSON.stringify(userProfile));
        }
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
  
  const updateUserPreferences = async (
    preferences: Partial<{ 
      favorites: string[], 
      favoriteProducts: string[], 
      partnerFavorites: string[] 
    }>
  ) => {
    if (!user) throw new Error("Utilisateur non connecté");
    
    try {
      // Mise à jour dans Supabase
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
      
      // Mise à jour de l'état local
      const updatedUser = { ...user, ...preferences };
      setUser(updatedUser);
      localStorage.setItem("cbdUser", JSON.stringify(updatedUser));
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem("cbdUser");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, updateUserPreferences }}>
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
