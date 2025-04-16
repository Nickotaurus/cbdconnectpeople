export type ClassifiedType = 'buy' | 'sell' | 'service';
export type ClassifiedCategory = 'store' | 'ecommerce' | 'realestate' | 'employer' | 'employee' | 'bank' | 'accountant' | 'legal' | 'insurance' | 'logistics' | 'breeder' | 'label' | 'association' | 'media' | 'laboratory' | 'production' | 'realEstate' | 'other';
export type ClassifiedStatus = 'pending' | 'approved' | 'rejected';

export interface ClassifiedImage {
  id: string;
  url: string;
  name: string;
}

export interface Classified {
  id: string;
  type: ClassifiedType;
  category: ClassifiedCategory;
  title: string;
  description: string;
  location: string;
  price?: string;
  date: string;
  status: ClassifiedStatus;
  user: {
    name: string;
    id: string;
    email: string;
  };
  isPremium: boolean;
  images?: ClassifiedImage[];
}

export interface storeImage {
  name: string;
  url: string;
}

export interface ClassifiedFormData {
  type: ClassifiedType;
  category: ClassifiedCategory;
  title: string;
  description: string;
  location: string;
  price?: string;
  isPremium: boolean;
  images: File[];
  jobType?: string;
  salary?: string;
  experience?: string;
  contractType?: string;
  companyName?: string;
  contactEmail?: string;
}
