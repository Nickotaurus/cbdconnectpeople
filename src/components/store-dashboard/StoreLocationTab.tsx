
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from '@/types/store';
import Map from '@/components/Map';

interface StoreLocationTabProps {
  store: Store;
}

const StoreLocationTab = ({ store }: StoreLocationTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Localisation</CardTitle>
        <CardDescription>Adresse et coordonnées de votre boutique</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Adresse complète</h3>
            <p>{store.address}</p>
            <p>{store.postalCode} {store.city}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Coordonnées</h3>
            <p>Latitude: {store.latitude}</p>
            <p>Longitude: {store.longitude}</p>
          </div>
          
          <div className="h-64 mt-4">
            <Map 
              stores={[store]}
              selectedStoreId={store.id}
              zoom={15}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreLocationTab;
