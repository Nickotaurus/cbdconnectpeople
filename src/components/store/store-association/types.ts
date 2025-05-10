
export interface StoreAssociationToolProps {
  defaultStoreName?: string;
  defaultCity?: string;
  onSuccess?: (storeId: string) => void;
}

export interface AssociationResult {
  success?: boolean;
  message?: string;
  storeId?: string;
}
