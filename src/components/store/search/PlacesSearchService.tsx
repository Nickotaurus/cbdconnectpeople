
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
    // Amélioration des termes de recherche pour trouver plus de boutiques CBD
    const searchTerms = [
      { keyword: 'cbd', radius: 50000 },
      { keyword: 'boutique cbd', radius: 50000 },
      { keyword: 'cbd shop', radius: 50000 },
      { keyword: 'chanvre', radius: 30000 },
      { keyword: 'cannabis légal', radius: 30000 },
      { keyword: 'hemp shop', radius: 30000 }
    ];

    setIsSearching(true);
    let totalFound = 0;
    const processedPlaceIds = new Set<string>();
    
    for (const term of searchTerms) {
      const request = {
        location: userLocation,
        radius: term.radius,
        keyword: term.keyword,
        // Fix: use a single type instead of an array
        type: 'store' // Now using a single type string value
      };
      
      console.log(`Recherche de: ${term.keyword} dans un rayon de ${term.radius}m`);
      
      try {
        await new Promise((resolve) => {
          service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              console.log(`Trouvé ${results.length} établissements pour "${term.keyword}"`);
              
              // Filtrage des résultats pour ne pas dupliquer les établissements
              const newResults = results.filter(place => {
                if (!place.place_id || processedPlaceIds.has(place.place_id)) {
                  return false;
                }
                
                // Ajout d'un filtre supplémentaire pour s'assurer de la pertinence
                const name = place.name?.toLowerCase() || '';
                const vicinity = place.vicinity?.toLowerCase() || '';
                const isCbdRelated = 
                  name.includes('cbd') || 
                  name.includes('chanvre') || 
                  name.includes('hemp') || 
                  name.includes('cannabis') ||
                  vicinity.includes('cbd');
                
                if (isCbdRelated) {
                  processedPlaceIds.add(place.place_id);
                  return true;
                }
                
                // Si le terme de recherche est juste 'cbd', acceptons tous les résultats
                // car Google a déjà filtré pour nous
                if (term.keyword === 'cbd') {
                  processedPlaceIds.add(place.place_id);
                  return true;
                }
                
                return false;
              });
              
              if (newResults.length > 0) {
                setHasResults(true);
                totalFound += newResults.length;
                
                newResults.forEach(place => {
                  onAddMarker(place, service);
                });
              }
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              console.log(`Aucun résultat pour "${term.keyword}"`);
            } else {
              console.warn(`Statut de recherche pour ${term.keyword}: ${status}`);
            }
            resolve(true);
          });
        });
        
        // Ajout d'un délai plus long entre les recherches pour respecter les limites d'API
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Erreur lors de la recherche pour ${term.keyword}:`, error);
      }
    }
    
    console.log(`Total des établissements CBD trouvés: ${totalFound}`);
    
    // Notification à l'utilisateur sur le résultat de la recherche
    if (totalFound === 0) {
      toast({
        title: "Aucune boutique CBD trouvée",
        description: "Vous pouvez ajouter votre boutique manuellement",
        variant: "default"
      });
    } else {
      toast({
        title: "Résultats de recherche",
        description: `${totalFound} boutiques CBD trouvées dans votre région`,
        variant: "default"
      });
    }
    
    setIsSearching(false);
  };

  // Fix: Use findPlaceFromQuery instead of textSearch
  const textSearch = async (query: string) => {
    setIsSearching(true);
    
    // Use findPlaceFromQuery instead since textSearch is not available 
    // in the current type definitions
    const request = {
      query: `${query} cbd`,
      fields: ['name', 'geometry', 'formatted_address', 'place_id', 'rating', 'user_ratings_total', 'vicinity']
    };
    
    try {
      await new Promise((resolve) => {
        service.findPlaceFromQuery(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            console.log(`Trouvé ${results.length} établissements pour la recherche "${query}"`);
            setHasResults(results.length > 0);
            
            results.forEach(place => {
              onAddMarker(place, service);
            });
          } else {
            console.warn(`Statut de recherche textuelle: ${status}`);
            setHasResults(false);
          }
          resolve(true);
        });
      });
    } catch (error) {
      console.error(`Erreur lors de la recherche textuelle:`, error);
      setHasResults(false);
    }
    
    setIsSearching(false);
  };

  return { searchStores, textSearch };
};

export default PlacesSearchService;
