
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
  
  // Fonction de recherche textuelle robuste qui fonctionne même sans géolocalisation
  const textSearch = async (query: string) => {    
    if (!query) {
      console.log("Aucun terme de recherche fourni");
      return;
    }
    
    setIsSearching(true);
    
    try {
      const service = serviceRegistry.getService();
      console.log("Service créé pour la recherche:", service);
      
      // Toujours utiliser une position par défaut si nécessaire
      const searchLocation = userLocation || { lat: 48.8566, lng: 2.3522 }; // Paris par défaut
      
      const request = {
        query: query,
        location: searchLocation,
        radius: 50000,
      };
      
      console.log("Requête de recherche:", request);
      
      service.textSearch(request, (results, status) => {
        console.log("Résultats de recherche:", status, results?.length);
        setIsSearching(false);
        
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          setHasResults(true);
          
          results.forEach(place => {
            if (place) {
              onAddMarker(place, service);
            }
          });
        } else {
          setHasResults(false);
          console.log("Aucun résultat trouvé avec textSearch, essai avec nearbySearch");
          
          // Essayer une recherche à proximité comme fallback
          const nearbyRequest = {
            location: searchLocation,
            radius: 50000,
            keyword: query
          };
          
          service.nearbySearch(nearbyRequest, (nearbyResults, nearbyStatus) => {
            if (nearbyStatus === google.maps.places.PlacesServiceStatus.OK && 
                nearbyResults && nearbyResults.length > 0) {
              setHasResults(true);
              
              nearbyResults.forEach(place => {
                if (place) {
                  onAddMarker(place, service);
                }
              });
            } else {
              setHasResults(false);
              console.log("Aucun résultat trouvé avec nearbySearch non plus");
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
