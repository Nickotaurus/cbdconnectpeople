
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from '@/types/store';
import Map from '@/components/Map';

interface StoreOverviewTabProps {
  store: Store;
  onEditClick: () => void;
  onViewMapClick: () => void;
}

const StoreOverviewTab = ({ store, onEditClick, onViewMapClick }: StoreOverviewTabProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{store.name}</CardTitle>
          <CardDescription>Informations générales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {store.photo_url && (
              <img 
                src={store.photo_url} 
                alt={store.name} 
                className="w-full h-40 object-cover rounded-md mb-4"
              />
            )}
            <p><strong>Adresse:</strong> {store.address}, {store.postalCode} {store.city}</p>
            <p><strong>Téléphone:</strong> {store.phone || 'Non renseigné'}</p>
            <p><strong>Site web:</strong> {store.website || 'Non renseigné'}</p>
            {store.hasGoogleBusinessProfile && (
              <div className="mt-4 bg-blue-50 p-3 rounded-md">
                <p className="text-blue-800 font-semibold">✓ Profil Google Business connecté</p>
              </div>
            )}
            {store.isEcommerce && (
              <div className="mt-4 bg-green-50 p-3 rounded-md">
                <p className="text-green-800 font-semibold">✓ Boutique e-commerce active</p>
                <p className="text-green-700 text-sm">
                  URL: {store.ecommerceUrl || store.website}
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onEditClick}>Modifier les informations</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Visibilité sur la carte</CardTitle>
          <CardDescription>Prévisualisation de votre boutique</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <Map 
            stores={[store]} 
            selectedStoreId={store.id}
          />
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={onViewMapClick}>
            Voir sur la carte complète
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StoreOverviewTab;
