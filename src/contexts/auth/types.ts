
import { User, UserRole } from "@/types/auth";

export interface AuthContextType {
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
