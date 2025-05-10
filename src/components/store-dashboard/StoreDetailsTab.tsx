
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from '@/types/store';

interface StoreDetailsTabProps {
  store: Store;
  onEditClick: () => void;
}

const StoreDetailsTab = ({ store, onEditClick }: StoreDetailsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails de la boutique</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{store.description || 'Aucune description disponible.'}</p>
          </div>
          
          {store.openingHours && store.openingHours.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Horaires d'ouverture</h3>
              <ul className="space-y-1">
                {store.openingHours.map((hours, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium">{hours.day}:</span> {hours.hours}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {store.isEcommerce && (
            <div className="bg-green-50 p-3 rounded-md">
              <h3 className="font-semibold text-green-800">Boutique E-commerce</h3>
              <p className="text-green-700">
                Url: {store.ecommerceUrl || store.website || 'Non renseignée'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onEditClick}>Modifier les détails</Button>
      </CardFooter>
    </Card>
  );
};

export default StoreDetailsTab;
