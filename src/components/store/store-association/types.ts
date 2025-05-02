
import { ReactNode } from 'react';

export interface AssociationResult {
  success?: boolean;
  message?: string;
  storeId?: string;
}

export interface StoreAssociationToolProps {
  defaultEmail?: string;
  defaultStoreName?: string;
  onSuccess?: () => void;
}
