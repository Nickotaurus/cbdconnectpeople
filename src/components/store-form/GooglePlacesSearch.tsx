
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
  const handleSearch = () => {
    const searchQuery = `${formData.address}, ${formData.city}`;
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    service.findPlaceFromQuery(
      {
        query: searchQuery,
        fields: ['place_id', 'name', 'formatted_address', 'geometry']
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
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
      >
        <Search className="w-4 h-4 mr-2" />
        Rechercher l'établissement
      </Button>
    </div>
  );
};

export default GooglePlacesSearch;
