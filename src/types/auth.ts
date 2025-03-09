
export type UserRole = "client" | "store" | "producer" | "partner";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified?: boolean;
  createdAt: string;
  profileCompleted?: boolean;
}

export interface StoreUser extends User {
  role: "store";
  storeId?: string;
  siretVerified?: boolean;
}

export interface ProducerUser extends User {
  role: "producer";
  producerId?: string;
  certifications?: string[];
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
