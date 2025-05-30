
export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  website?: string;
  description?: string;
  imageUrl?: string;
  logo_url?: string;
  photo_url?: string;
  rating: number;
  reviewCount: number;
  placeId?: string;
  isPremium?: boolean;
  premiumUntil?: string;
  isEcommerce?: boolean;
  ecommerceUrl?: string;
  hasGoogleBusinessProfile?: boolean;
  reviews: any[];
  openingHours: OpeningHour[];
  products?: any[];
  favoritePartnersCount?: number;
  userId?: string; // ID de l'utilisateur propriétaire
  claimedBy?: string; // ID de l'utilisateur qui a revendiqué cette boutique
  coupon?: StoreCoupon; // Ajout de la propriété coupon
  // Nouvelles propriétés pour identifier la source
  sourceTable?: string;
  sourceId?: string;
}

export interface OpeningHour {
  day: string;
  hours: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  user: {
    name: string;
    avatar?: string;
  };
  category?: string;
}

export interface StoreCoupon {
  code: string;
  discount: string;
  validUntil: string;
  usageCount?: number;
  isAffiliate?: boolean;
}
