
import { useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { createPlacesServiceDiv } from '@/services/googleMapsService';

// Global service registry (same pattern as in MarkerManager)
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
  const { toast } = useToast();
  const serviceRef = useRef<google.maps.places.PlacesService | null>(null);
  
  // Get or create the service only when needed
  const getService = () => {
    if (!serviceRef.current) {
      serviceRef.current = serviceRegistry.getService();
    }
    return serviceRef.current;
  };

  // Fonction de recherche automatique - ne fait plus rien
  const searchStores = async () => {
    console.log("Recherche automatique désactivée");
    return;
  };

  const textSearch = async (query: string) => {
    // Si la requête est vide, ne rien faire
    if (!query.trim()) {
      console.log("Requête de recherche vide, opération annulée");
      return;
    }
    
    const service = getService();
    if (!service) {
      console.error("Places service not initialized for text search");
      toast({
        title: "Erreur d'initialisation",
        description: "Le service de recherche n'est pas disponible",
        variant: "destructive"
      });
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const request = {
        query: `${query}`,
        location: userLocation,
        radius: 50000,
        fields: ['name', 'geometry', 'formatted_address', 'place_id', 'rating', 'user_ratings_total', 'vicinity']
      };
      
      console.log(`Executing text search for: "${query}"`, request);
      
      await new Promise<void>((resolve) => {
        service.textSearch(request, (results, status) => {
          console.log("Text search status:", status, results?.length || 0);
          
          if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            console.log(`Trouvé ${results.length} établissements pour la recherche "${query}"`, results);
            setHasResults(true);
            
            results.forEach(place => {
              onAddMarker(place, service);
            });
            
            toast({
              title: "Recherche terminée",
              description: `${results.length} établissements trouvés`,
              variant: "default"
            });
          } else {
            console.warn(`Statut de recherche textuelle: ${status}`, results);
            setHasResults(false);
            
            const nearbyRequest = {
              location: userLocation,
              radius: 50000,
              keyword: query
            };
            
            console.log("Trying fallback nearbySearch", nearbyRequest);
            
            service.nearbySearch(nearbyRequest, (nearbyResults, nearbyStatus) => {
              console.log("Nearby search status:", nearbyStatus, nearbyResults?.length || 0);
              
              if (nearbyStatus === google.maps.places.PlacesServiceStatus.OK && nearbyResults && nearbyResults.length > 0) {
                console.log(`Recherche à proximité a trouvé ${nearbyResults.length} résultats`);
                setHasResults(true);
                
                nearbyResults.forEach(place => {
                  onAddMarker(place, service);
                });
                
                toast({
                  title: "Recherche terminée",
                  description: `${nearbyResults.length} établissements trouvés à proximité`,
                  variant: "default"
                });
              } else {
                console.warn(`Recherche à proximité a échoué: ${nearbyStatus}`);
                setHasResults(false);
                
                toast({
                  title: "Aucun résultat",
                  description: "Aucun établissement trouvé pour cette recherche. Essayez d'autres termes ou ajoutez manuellement votre boutique.",
                  variant: "default"
                });
              }
              resolve();
            });
          }
        });
      });
    } catch (error) {
      console.error(`Erreur lors de la recherche textuelle:`, error);
      setHasResults(false);
      
      toast({
        title: "Erreur de recherche",
        description: "Une erreur est survenue lors de la recherche. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return { searchStores, textSearch };
};

export default PlacesSearchService;
