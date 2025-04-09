
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, ClientUser, StoreUser } from "@/types/auth";
import { badges } from "@/components/badges/UserBadges";

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

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem("cbdUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("cbdUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll simulate a successful login
      // In a real app, this would make an API call to your backend
      const mockUser: ClientUser = {
        id: "user-" + Math.floor(Math.random() * 10000),
        email,
        name: email.split("@")[0],
        role: "client",
        createdAt: new Date().toISOString(),
        favorites: [],
        favoriteProducts: [],
        tickets: 3,
        rewards: 0,
        badges: [
          {
            id: badges[0].id,
            name: badges[0].name,
            description: badges[0].description,
            icon: badges[0].icon,
            earnedAt: new Date().toISOString()
          }
        ]
      };
      
      setUser(mockUser);
      localStorage.setItem("cbdUser", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login error:", error);
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
      // For demo purposes, we'll simulate a successful registration
      // In a real app, this would make an API call to your backend
      const mockUser: any = {
        id: "user-" + Math.floor(Math.random() * 10000),
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
        profileCompleted: false,
        isVerified: role === "client", // Clients are verified by default, stores and producers need verification
        badges: [
          {
            id: badges[0].id,
            name: badges[0].name,
            description: badges[0].description,
            icon: badges[0].icon,
            earnedAt: new Date().toISOString()
          }
        ]
      };
      
      // Add role-specific fields
      if (role === "client") {
        mockUser.favorites = [];
        mockUser.favoriteProducts = [];
        mockUser.tickets = 3;
        mockUser.rewards = 0;
      } else if (role === "store") {
        mockUser.storeType = roleSpecificData?.storeType || 'physical';
        mockUser.siretVerified = false;
        mockUser.partnerFavorites = [];
        mockUser.needsSubscription = 
          mockUser.storeType === 'ecommerce' || mockUser.storeType === 'both';
      } else if (role === "partner") {
        mockUser.partnerCategory = roleSpecificData?.partnerCategory || '';
        mockUser.verified = false;
      }
      
      setUser(mockUser);
      localStorage.setItem("cbdUser", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Registration error:", error);
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
    if (!user) throw new Error("User not logged in");
    
    // Update user preferences
    const updatedUser = { ...user, ...preferences };
    setUser(updatedUser);
    localStorage.setItem("cbdUser", JSON.stringify(updatedUser));
    
    return Promise.resolve();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cbdUser");
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
