
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface PlacesSearchServiceProps {
  map: google.maps.Map;
  userLocation: google.maps.LatLngLiteral;
  onAddMarker: (
    place: google.maps.places.PlaceResult,
    service: google.maps.places.PlacesService
  ) => void;
  setIsSearching: (value: boolean) => void;
  setHasResults: (value: boolean) => void;
}

const PlacesSearchService = ({
  map,
  userLocation,
  onAddMarker,
  setIsSearching,
  setHasResults
}: PlacesSearchServiceProps) => {
  const { toast } = useToast();
  const [service] = useState(new google.maps.places.PlacesService(map));

  const searchStores = async () => {
    const searchTerms = [
      { keyword: 'boutique CBD', radius: 50000 },
      { keyword: 'shop CBD', radius: 50000 },
      { keyword: 'CBD store', radius: 50000 },
      { keyword: 'CBD', radius: 30000 }
    ];

    setIsSearching(true);
    
    for (const term of searchTerms) {
      const request = {
        location: userLocation,
        radius: term.radius,
        keyword: term.keyword
      };
      
      console.log(`Recherche de: ${term.keyword} dans un rayon de ${term.radius}m`);
      
      try {
        await new Promise((resolve, reject) => {
          service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              console.log(`Trouvé ${results.length} établissements pour "${term.keyword}"`);
              setHasResults(true);
              
              results.forEach(place => {
                onAddMarker(place, service);
              });
            }
            resolve(true);
          });
        });
        
        // Add delay between searches to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        console.error(`Erreur lors de la recherche pour ${term.keyword}:`, error);
      }
    }
    
    setIsSearching(false);
  };

  return { searchStores };
};

export default PlacesSearchService;
