
export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  description?: string;
  phone?: string;
  website?: string;
  imageUrl?: string;
  photo_url?: string;
  rating?: number;
  reviewCount?: number;
  placeId?: string;
  products?: Array<{
    category: string;
    name?: string;
    price?: number;
  }>;
  isEcommerce?: boolean;
  ecommerceUrl?: string;
  isPremium?: boolean;
  hasGoogleBusinessProfile?: boolean;
}
