
import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface GooglePlacesSearchProps {
  formData: {
    address: string;
    city: string;
    postalCode: string;
    placeId?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
}

const GooglePlacesSearch: React.FC<GooglePlacesSearchProps> = ({ 
  formData, 
  handleChange,
  onPlaceSelect 
}) => {
  const { toast } = useToast();
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  // Vérifier si l'API Google Maps est chargée
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsApiLoaded(true);
      } else {
        // Réessayer après un court délai
        setTimeout(checkGoogleMapsLoaded, 500);
      }
    };
    
    checkGoogleMapsLoaded();
    
    return () => {
      // Cleanup si nécessaire
    };
  }, []);

  const handleSearch = () => {
    if (!isApiLoaded) {
      toast({
        title: "API Google Maps non disponible",
        description: "Veuillez patienter pendant le chargement de l'API ou rafraîchir la page",
        variant: "destructive"
      });
      return;
    }

    const searchQuery = `${formData.address}, ${formData.city}`;
    
    try {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      service.findPlaceFromQuery(
        {
          query: searchQuery,
          fields: ['place_id', 'name', 'formatted_address', 'geometry']
        },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            onPlaceSelect(results[0]);
          } else {
            toast({
              title: "Aucun établissement trouvé",
              description: "Vérifiez l'adresse saisie et réessayez",
              variant: "destructive"
            });
          }
        }
      );
    } catch (error) {
      console.error("Erreur lors de la recherche Google Places:", error);
      toast({
        title: "Erreur de recherche",
        description: "Une erreur est survenue lors de la recherche. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Adresse complète*</Label>
        <Input 
          id="address" 
          name="address" 
          value={formData.address} 
          onChange={handleChange} 
          placeholder="123 rue du Commerce"
          required 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ville*</Label>
          <Input 
            id="city" 
            name="city" 
            value={formData.city} 
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postalCode">Code postal*</Label>
          <Input 
            id="postalCode" 
            name="postalCode" 
            value={formData.postalCode} 
            onChange={handleChange}
            required 
          />
        </div>
      </div>

      <Button 
        type="button" 
        variant="outline" 
        className="w-full"
        onClick={handleSearch}
        disabled={!isApiLoaded}
      >
        <Search className="w-4 h-4 mr-2" />
        {isApiLoaded ? "Rechercher l'établissement" : "Chargement de Google Maps..."}
      </Button>
      
      {!isApiLoaded && (
        <p className="text-xs text-muted-foreground text-center">
          L'API Google Maps est en cours de chargement. Merci de patienter...
        </p>
      )}
    </div>
  );
};

export default GooglePlacesSearch;
