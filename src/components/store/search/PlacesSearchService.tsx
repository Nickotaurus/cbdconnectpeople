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
    // Termes de recherche plus neutres et diversifiés
    const searchTerms = [
      { keyword: 'bien-être chanvre', radius: 50000 },
      { keyword: 'herboristerie bien-être', radius: 50000 },
      { keyword: 'boutique naturelle', radius: 50000 },
      { keyword: 'magasin chanvre', radius: 30000 },
      { keyword: 'produits naturels', radius: 30000 },
      { keyword: 'herboristerie', radius: 30000 }
    ];

    setIsSearching(true);
    let totalFound = 0;
    const processedPlaceIds = new Set<string>();
    
    for (const term of searchTerms) {
      const request = {
        location: userLocation,
        radius: term.radius,
        keyword: term.keyword,
        type: 'store'
      };
      
      console.log(`Recherche de: ${term.keyword} dans un rayon de ${term.radius}m`);
      
      try {
        await new Promise((resolve) => {
          service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              console.log(`Trouvé ${results.length} établissements pour "${term.keyword}"`);
              
              // Filtrage des résultats pertinents
              const newResults = results.filter(place => {
                if (!place.place_id || processedPlaceIds.has(place.place_id)) {
                  return false;
                }
                
                // Filtre plus inclusif avec les nouveaux termes
                const name = place.name?.toLowerCase() || '';
                const vicinity = place.vicinity?.toLowerCase() || '';
                const isRelevant = 
                  name.includes('bien-être') || 
                  name.includes('naturel') || 
                  name.includes('chanvre') || 
                  name.includes('herboristerie') ||
                  vicinity.includes('naturel') ||
                  vicinity.includes('bien-être');
                
                if (isRelevant) {
                  processedPlaceIds.add(place.place_id);
                  return true;
                }
                
                // Si le terme est générique, vérifions d'autres critères
                if (term.keyword === 'herboristerie' || term.keyword === 'produits naturels') {
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
            }
            resolve(true);
          });
        });
        
        // Délai entre les recherches
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Erreur lors de la recherche pour ${term.keyword}:`, error);
      }
    }
    
    if (totalFound === 0) {
      toast({
        title: "Aucun établissement trouvé",
        description: "Vous pouvez ajouter votre boutique manuellement",
        variant: "default"
      });
    } else {
      toast({
        title: "Résultats de recherche",
        description: `${totalFound} établissements trouvés dans votre région`,
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
