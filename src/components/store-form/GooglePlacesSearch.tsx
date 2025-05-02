
import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, AlertCircle, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getGoogleMapsApiKey } from '@/services/googleApiService';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([]);

  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps && window.google.maps.places && window.google.maps.places.PlacesService) {
        console.log("Google Places API fully loaded");
        setIsApiLoaded(true);
        return true;
      }
      return false;
    };
    
    const loadGoogleMapsAPI = async () => {
      if (checkGoogleMapsLoaded()) {
        return;
      }
      
      try {
        const apiKey = await getGoogleMapsApiKey();
        if (!apiKey) {
          throw new Error("No API key returned");
        }
        
        return new Promise<void>((resolve, reject) => {
          if (document.querySelector('script[src*="maps.googleapis.com"]')) {
            console.log("Google Maps script already exists, waiting...");
            const checkInterval = setInterval(() => {
              if (checkGoogleMapsLoaded()) {
                clearInterval(checkInterval);
                resolve();
              }
            }, 500);
            return;
          }
          
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            console.log('Google Maps API loaded successfully');
            setIsApiLoaded(true);
            resolve();
          };
          
          script.onerror = (err) => {
            console.error('Failed to load Google Maps API:', err);
            reject(new Error('Failed to load Google Maps API'));
          };
          
          document.head.appendChild(script);
        });
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger l'API Google Maps",
          variant: "destructive"
        });
      }
    };
    
    loadGoogleMapsAPI();
    
    if (!checkGoogleMapsLoaded()) {
      const interval = setInterval(() => {
        if (checkGoogleMapsLoaded()) {
          clearInterval(interval);
        } else {
          setApiCheckAttempts(prev => prev + 1);
        }
      }, 1000);
      
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

    const searchQuery = `${formData.address}, ${formData.city}, ${formData.postalCode || ''}`;
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const mapDiv = document.createElement('div');
      mapDiv.style.width = '1px';
      mapDiv.style.height = '1px';
      mapDiv.style.position = 'absolute';
      mapDiv.style.top = '0';
      mapDiv.style.left = '0';
      mapDiv.style.visibility = 'hidden';
      document.body.appendChild(mapDiv);
      
      console.log("Creating Places service with div:", mapDiv);
      const service = new window.google.maps.places.PlacesService(mapDiv);

      console.log("Searching for place with query:", searchQuery);
      service.textSearch(
        {
          query: searchQuery
        },
        (results, status) => {
          setIsSearching(false);
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            console.log("Places found:", results);
            setSearchResults(results);
            
            // If only one result, automatically select it
            if (results.length === 1) {
              onPlaceSelect(results[0]);
              toast({
                title: "Établissement trouvé",
                description: `"${results[0].name}" a été trouvé avec succès`,
              });
            }
          } else {
            console.warn("Place search result:", status);
            
            service.findPlaceFromQuery(
              {
                query: searchQuery,
                fields: ['place_id', 'name', 'formatted_address', 'geometry']
              },
              (findResults, findStatus) => {
                if (findStatus === window.google.maps.places.PlacesServiceStatus.OK && 
                    findResults && findResults.length > 0) {
                  console.log("Place found with alternate method:", findResults[0]);
                  setSearchResults(findResults);
                  
                  if (findResults.length === 1) {
                    onPlaceSelect(findResults[0]);
                    toast({
                      title: "Établissement trouvé",
                      description: `"${findResults[0].name}" a été trouvé avec succès`,
                    });
                  }
                } else {
                  toast({
                    title: "Aucun établissement trouvé",
                    description: "Vérifiez l'adresse saisie et réessayez",
                    variant: "destructive"
                  });
                }
              }
            );
          }
          
          document.body.removeChild(mapDiv);
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

  const handleResultSelect = (place: google.maps.places.PlaceResult) => {
    onPlaceSelect(place);
    setSearchResults([]);
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
      
      {searchResults.length > 0 && (
        <div className="mt-4 border rounded-md divide-y">
          <p className="p-2 bg-muted/50 font-medium text-sm">Établissements trouvés ({searchResults.length})</p>
          {searchResults.map((result, index) => (
            <div 
              key={result.place_id || index} 
              className="p-3 hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => handleResultSelect(result)}
            >
              <h4 className="font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-primary/70" />
                {result.name}
              </h4>
              <p className="text-sm text-muted-foreground ml-5">{result.formatted_address}</p>
            </div>
          ))}
        </div>
      )}
      
      {!isApiLoaded && apiCheckAttempts > 3 && (
        <Alert variant="warning" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            L'API Google Maps prend du temps à se charger. Essayez de rafraîchir la page ou vérifiez votre connexion internet.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default GooglePlacesSearch;
