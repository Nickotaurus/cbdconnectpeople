
import { createPlacesServiceDiv } from '@/services/googleMapsService';

const serviceRegistry = {
  getDiv: createPlacesServiceDiv,
  getService: (): google.maps.places.PlacesService => {
    const div = createPlacesServiceDiv();
    return new google.maps.places.PlacesService(div);
  }
};

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
  
  // Fonction de recherche textuelle simplifiée sans blocages
  const textSearch = async (query: string) => {    
    setIsSearching(true);
    
    try {
      const service = serviceRegistry.getService();
      console.log("Service créé pour la recherche:", service);
      
      const request = {
        query: query || "magasin",
        location: userLocation,
        radius: 50000,
      };
      
      console.log("Requête de recherche:", request);
      
      service.textSearch(request, (results, status) => {
        console.log("Résultats de recherche:", status, results?.length);
        setIsSearching(false);
        
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          setHasResults(true);
          
          results.forEach(place => {
            onAddMarker(place, service);
          });
        } else {
          setHasResults(false);
          
          // Essayer une recherche à proximité comme fallback
          const nearbyRequest = {
            location: userLocation,
            radius: 50000,
            keyword: query || "magasin"
          };
          
          service.nearbySearch(nearbyRequest, (nearbyResults, nearbyStatus) => {
            if (nearbyStatus === google.maps.places.PlacesServiceStatus.OK && nearbyResults && nearbyResults.length > 0) {
              setHasResults(true);
              
              nearbyResults.forEach(place => {
                onAddMarker(place, service);
              });
            } else {
              setHasResults(false);
            }
          });
        }
      });
    } catch (error) {
      console.error("Erreur de recherche:", error);
      setIsSearching(false);
      setHasResults(false);
    }
  };

  return { textSearch };
};

export default PlacesSearchService;
