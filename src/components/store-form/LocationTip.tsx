
import React from 'react';

const LocationTip: React.FC = () => {
  return (
    <div className="bg-secondary/50 p-4 rounded-lg mt-6">
      <h3 className="text-sm font-medium mb-2">Astuce:</h3>
      <p className="text-sm text-muted-foreground">
        Pour obtenir les coordonnées géographiques (latitude et longitude) d'une adresse, 
        vous pouvez utiliser Google Maps. Recherchez l'adresse, faites un clic droit sur le 
        point exact et sélectionnez "Obtenir l'itinéraire vers ce lieu". Les coordonnées 
        apparaîtront dans la barre d'adresse.
      </p>
    </div>
  );
};

export default LocationTip;
