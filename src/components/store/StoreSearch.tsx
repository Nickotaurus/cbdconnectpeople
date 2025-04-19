
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface StoreSearchProps {
  onStoreSelect: (store: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    placeId: string;
  }) => void;
}

const StoreSearch = ({ onStoreSelect }: StoreSearchProps) => {
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([]);

  const handleSearch = () => {
    if (!window.google?.maps?.places) {
      toast({
        title: "Erreur",
        description: "Le service Google Maps n'est pas disponible",
        variant: "destructive"
      });
      return;
    }

    const france = new google.maps.LatLng(46.603354, 1.888334);
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    service.nearbySearch({
      location: france,
      radius: 500000,
      keyword: 'cbd shop',
    }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setSearchResults(results);
      } else {
        toast({
          title: "Aucun résultat",
          description: "Aucune boutique CBD n'a été trouvée",
          variant: "destructive"
        });
      }
    });
  };

  const handleStoreSelect = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location || !place.formatted_address) {
      toast({
        title: "Erreur",
        description: "Les informations de la boutique sont incomplètes",
        variant: "destructive"
      });
      return;
    }

    const addressComponents = place.formatted_address.split(',');
    const city = addressComponents[1]?.trim() || '';
    const postalCode = addressComponents[0]?.match(/\d{5}/)?.[ 0 ] || '';

    onStoreSelect({
      name: place.name || '',
      address: addressComponents[0]?.trim() || '',
      city,
      postalCode,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      placeId: place.place_id || ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Button onClick={handleSearch} className="w-full">
          <MapPin className="w-4 h-4 mr-2" />
          Rechercher ma boutique CBD
        </Button>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Sélectionnez votre boutique dans la liste :
          </p>
          <div className="space-y-2">
            {searchResults.map((place) => (
              <Card
                key={place.place_id}
                className="p-4 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleStoreSelect(place)}
              >
                <h3 className="font-medium">{place.name}</h3>
                <p className="text-sm text-muted-foreground">{place.formatted_address}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreSearch;
