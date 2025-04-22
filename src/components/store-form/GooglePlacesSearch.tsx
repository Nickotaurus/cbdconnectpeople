
import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, AlertCircle } from "lucide-react";
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
  const [isSearching, setIsSearching] = useState(false);
  const [apiCheckAttempts, setApiCheckAttempts] = useState(0);

  // Vérifier si l'API Google Maps est chargée
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps && window.google.maps.places && window.google.maps.places.PlacesService) {
        console.log("Google Places API fully loaded");
        setIsApiLoaded(true);
        return true;
      }
      return false;
    };
    
    // Vérifier immédiatement
    if (!checkGoogleMapsLoaded()) {
      // Si pas chargé, vérifier périodiquement avec un délai croissant
      const interval = setInterval(() => {
        if (checkGoogleMapsLoaded()) {
          clearInterval(interval);
        } else {
          setApiCheckAttempts(prev => prev + 1);
          // Après 10 tentatives (5s), afficher un message d'erreur
          if (apiCheckAttempts > 10) {
            console.error("Google Maps API not loaded after multiple attempts");
            toast({
              title: "API non disponible",
              description: "L'API Google Maps n'a pas pu être chargée correctement",
              variant: "destructive"
            });
            clearInterval(interval);
          }
        }
      }, 500);
      
      // Nettoyer l'intervalle si le composant est démonté
      return () => clearInterval(interval);
    }
  }, [toast, apiCheckAttempts]);

  const handleSearch = () => {
    if (!isApiLoaded) {
      toast({
        title: "API Google Maps non disponible",
        description: "Veuillez patienter pendant le chargement de l'API ou rafraîchir la page",
        variant: "destructive"
      });
      return;
    }

    if (!formData.address || !formData.city) {
      toast({
        title: "Champs requis",
        description: "Veuillez renseigner l'adresse et la ville pour effectuer une recherche",
        variant: "destructive"
      });
      return;
    }

    const searchQuery = `${formData.address}, ${formData.city}`;
    setIsSearching(true);
    
    try {
      // Créer un div temporaire pour le service
      const mapDiv = document.createElement('div');
      mapDiv.style.display = 'none';
      document.body.appendChild(mapDiv);
      
      const service = new window.google.maps.places.PlacesService(mapDiv);

      service.findPlaceFromQuery(
        {
          query: searchQuery,
          fields: ['place_id', 'name', 'formatted_address', 'geometry']
        },
        (results, status) => {
          setIsSearching(false);
          // Suppression du div temporaire
          document.body.removeChild(mapDiv);
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            console.log("Place found:", results[0]);
            onPlaceSelect(results[0]);
            toast({
              title: "Établissement trouvé",
              description: `"${results[0].name}" a été trouvé avec succès`,
            });
          } else {
            console.warn("Place search result:", status);
            toast({
              title: "Aucun établissement trouvé",
              description: "Vérifiez l'adresse saisie et réessayez",
              variant: "destructive"
            });
          }
        }
      );
    } catch (error) {
      setIsSearching(false);
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
        disabled={!isApiLoaded || isSearching}
      >
        {isSearching ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Recherche en cours...
          </>
        ) : (
          <>
            <Search className="w-4 h-4 mr-2" />
            {isApiLoaded ? "Rechercher l'établissement" : "Chargement de Google Maps..."}
          </>
        )}
      </Button>
      
      {!isApiLoaded && apiCheckAttempts > 5 && (
        <div className="border border-amber-200 bg-amber-50 p-3 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800 font-medium">Problème de chargement</p>
            <p className="text-xs text-amber-700">
              L'API Google Maps semble prendre du temps à se charger. Vous pouvez essayer de rafraîchir la page ou utiliser la recherche sur carte.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GooglePlacesSearch;
