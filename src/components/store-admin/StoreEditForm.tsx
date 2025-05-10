
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StoreForm from '@/components/StoreForm';
import { Store } from '@/types/store/store';
import { StoreData } from '@/types/store/store-data';

interface StoreEditFormProps {
  id?: string;
  store: Store;
  onCancel: () => void;
  onSuccess: (store: Store) => Promise<void>;
  convertStoreToStoreData: () => StoreData;
}

const StoreEditForm = ({ id, store, onCancel, onSuccess, convertStoreToStoreData }: StoreEditFormProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Modifier votre boutique</CardTitle>
            <CardDescription>Modifiez les informations de votre boutique</CardDescription>
          </div>
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            Annuler
          </Button>
        </CardHeader>
        <CardContent>
          <StoreForm 
            isEdit={true} 
            storeId={id}
            onSuccess={onSuccess}
            initialStoreData={convertStoreToStoreData()}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreEditForm;
