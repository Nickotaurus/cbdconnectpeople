
export type UserRole = "client" | "store" | "producer";

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
