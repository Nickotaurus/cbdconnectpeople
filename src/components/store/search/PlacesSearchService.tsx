
import { useState, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Global service registry (same pattern as in MarkerManager)
const serviceRegistry = {
  mainDiv: null as HTMLDivElement | null,
  getDiv: (): HTMLDivElement => {
    if (!serviceRegistry.mainDiv) {
      serviceRegistry.mainDiv = document.createElement('div');
      serviceRegistry.mainDiv.id = 'places-service-global-div';
      serviceRegistry.mainDiv.style.width = '1px';
      serviceRegistry.mainDiv.style.height = '1px';
      serviceRegistry.mainDiv.style.position = 'absolute';
      serviceRegistry.mainDiv.style.visibility = 'hidden';
      document.body.appendChild(serviceRegistry.mainDiv);
    }
    return serviceRegistry.mainDiv;
  },
  getService: (): google.maps.places.PlacesService => {
    const div = serviceRegistry.getDiv();
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

  const searchStores = async () => {
    const service = getService();
    if (!service) {
      console.error("Places service not initialized");
      toast({
        title: "Erreur d'initialisation",
        description: "Le service de recherche n'est pas disponible",
        variant: "destructive"
      });
      setIsSearching(false);
      return;
    }

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
    
    try {
      for (const term of searchTerms) {
        const request = {
          location: userLocation,
          radius: term.radius,
          keyword: term.keyword,
          type: 'store'
        };
        
        console.log(`Recherche de: ${term.keyword} dans un rayon de ${term.radius}m`);
        
        try {
          await new Promise<void>((resolve) => {
            if (!service) {
              console.error("Service not available during search execution");
              resolve();
              return;
            }

            service.nearbySearch(request, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                console.log(`Trouvé ${results.length} établissements pour "${term.keyword}"`);
                
                const newResults = results.filter(place => {
                  if (!place.place_id || processedPlaceIds.has(place.place_id)) {
                    return false;
                  }
                  
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
                    if (service) {
                      onAddMarker(place, service);
                    }
                  });
                }
              } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                console.log(`Aucun résultat trouvé pour "${term.keyword}"`);
              } else {
                console.warn(`Erreur de recherche pour "${term.keyword}": ${status}`);
              }
              resolve();
            });
          });
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`Erreur lors de la recherche pour ${term.keyword}:`, error);
        }
      }
      
      if (totalFound === 0) {
        setHasResults(false);
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
    } catch (error) {
      console.error('Erreur globale lors de la recherche:', error);
      toast({
        title: "Erreur de recherche",
        description: "Une erreur est survenue lors de la recherche d'établissements",
        variant: "destructive"
      });
      setHasResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const textSearch = async (query: string) => {
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
