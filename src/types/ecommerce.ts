
export interface EcommerceStore {
  id: string;
  name: string;
  url: string;
  description: string;
  logo: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  isPremium?: boolean;
  paymentMethods?: string[];
  shippingCountries: string[];
  userId?: string;
  isPhysicalStore?: boolean;
  googlePlaceId?: string; // Ajout du Google Place ID
}
