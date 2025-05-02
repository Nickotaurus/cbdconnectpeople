
import { Store } from './store';
import { StoreData, StoreDBType } from './store-types';

export interface FormData {
  id?: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  phone: string;
  website: string;
  logoUrl: string;
  photoUrl: string;
  placeId: string;
  isEcommerce: boolean;
  ecommerceUrl: string;
  hasGoogleBusinessProfile?: boolean;
  openingHours?: string[];
}

export interface UseStoreFormProps {
  isEdit?: boolean;
  storeId?: string;
  onSuccess?: (store: Store) => Promise<void>;
  storeType?: string;
}

export interface StoreFormSubmitResult {
  success: boolean;
  id?: string;
  store?: Store;
  error?: any;
}

export interface UseStoreFormReturn {
  activeTab: string;
  setActiveTab: (value: string) => void;
  formData: FormData;
  isLoading: boolean;
  isAddressValid: boolean;
  hasSearched: boolean;
  setHasSearched: (value: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStoreSelect: (store: StoreData) => void;
  handleSubmit: (e: React.FormEvent) => Promise<StoreFormSubmitResult>;
}
