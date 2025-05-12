
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Globe, Clock, Pencil } from "lucide-react";
import { Store } from '@/types/store';

interface StoreDetailsTabProps {
  store: Store;
  onEditClick: () => void;
  isStoreOwner?: boolean;
}

const StoreDetailsTab = ({ store, onEditClick, isStoreOwner = false }: StoreDetailsTabProps) => {
  // Format opening hours for display
  const formatOpeningHours = () => {
    if (!store.openingHours || store.openingHours.length === 0) {
      return <p className="text-muted-foreground">Aucun horaire renseigné</p>;
    }

    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    return (
      <div className="grid grid-cols-1 gap-2">
        {days.map((day, index) => {
          const dayHours = store.openingHours.find(h => h.day === day);
          return (
            <div key={index} className="flex justify-between py-1">
              <span className="font-medium">{day}</span>
              <span>{dayHours?.hours || "Fermé"}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Détails de la boutique</CardTitle>
          <CardDescription>
            Informations détaillées sur la boutique
          </CardDescription>
        </div>
        {isStoreOwner && (
          <Button onClick={onEditClick}>
            <Pencil className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Informations générales</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{store.address}</p>
                  <p>{store.postalCode} {store.city}</p>
                </div>
              </div>
              
              {store.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <p>{store.phone}</p>
                </div>
              )}
              
              {store.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <a 
                    href={store.website.startsWith('http') ? store.website : `https://${store.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {store.website}
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Horaires d'ouverture
            </h3>
            {formatOpeningHours()}
          </div>
        </div>
        
        {store.description && (
          <div>
            <h3 className="text-lg font-medium mb-2">À propos de la boutique</h3>
            <p className="text-muted-foreground">{store.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreDetailsTab;
