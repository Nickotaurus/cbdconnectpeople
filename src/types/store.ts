
export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  website: string;
  openingHours: {
    day: string;
    hours: string;
  }[];
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  coupon: {
    code: string;
    discount: string;
    validUntil: string;
    usageCount?: number;
    isAffiliate?: boolean;
  };
  lotteryPrize?: {
    name: string;
    description: string;
    value?: string;
  };
  isPremium?: boolean;
  premiumUntil?: string;
  isEcommerce?: boolean;
  ecommerceUrl?: string;
  reviews: {
    id: string;
    author: string;
    date: string;
    rating: number;
    text: string;
    category: "flowers" | "oils" | "experience" | "originality";
  }[];
  products: {
    category: string;
    origin: string;
    quality: string;
  }[];
}
