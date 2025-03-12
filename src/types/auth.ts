
export type UserRole = "client" | "store" | "partner";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified?: boolean;
  createdAt: string;
  profileCompleted?: boolean;
  badges?: Badge[];
}

export interface StoreUser extends User {
  role: "store";
  storeId?: string;
  siretVerified?: boolean;
}

export interface ClientUser extends User {
  role: "client";
  favorites?: string[];
}

export interface PartnerUser extends User {
  role: "partner";
  partnerId?: string;
  category?: PartnerCategory;
  description?: string;
  website?: string;
  certifications?: string[];
  contactInfo?: {
    email: string;
    phone?: string;
    address?: string;
  };
}

export type PartnerCategory = 
  | "bank"
  | "accountant"
  | "legal"
  | "insurance"
  | "logistics"
  | "breeder"
  | "label"
  | "association"
  | "media"
  | "laboratory"
  | "production"
  | "realEstate";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}
