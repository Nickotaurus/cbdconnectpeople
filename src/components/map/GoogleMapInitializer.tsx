import { useEffect, useRef, useState } from 'react';
import { Store } from '@/types/store';
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createStoreMarker, createUserLocationMarker } from '@/utils/mapUtils';

interface GoogleMapInitializerProps {
  userLocation: { latitude: number; longitude: number };
  stores: Store[];
  onSelectStore?: (store: Store) => void;
  selectedStoreId?: string;
}

const GoogleMapInitializer = ({ 
  userLocation, 
  stores, 
  onSelectStore, 
  selectedStoreId 
}: GoogleMapInitializerProps) => {
  const { toast } = useToast();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markers = useRef<any[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [isRefererError, setIsRefererError] = useState<boolean>(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    try {
      // Create the map
      if (!window.google || !window.google.maps || !window.google.maps.Map) {
        throw new Error("Google Maps API not loaded");
      }
      
      const mapOptions = {
        center: { lat: userLocation.latitude, lng: userLocation.longitude },
        zoom: 13,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        mapId: 'cbd_store_map'
      };
      
      mapInstance.current = new window.google.maps.Map(mapContainerRef.current, mapOptions);
      
      // Detect RefererNotAllowedMapError
      const checkForMapErrors = () => {
        // Look for the specific error div that Google Maps creates
        const errorDiv = document.querySelector('.gm-err-container');
        
        if (errorDiv) {
          const errorTitle = errorDiv.querySelector('.gm-err-title')?.textContent || '';
          const errorText = errorDiv.querySelector('.gm-err-message')?.textContent || '';
          
          console.error("Google Maps error detected:", errorTitle, errorText);
          
          // Check if it's a referer error
          if (errorText.includes('RefererNotAllowedMapError') || 
              errorText.toLowerCase().includes('not authorized')) {
            setIsRefererError(true);
            setErrorType('RefererNotAllowedMapError');
            setMapError("Ce domaine n'est pas autorisé à utiliser cette clé API Google Maps.");
            
            toast({
              title: "Erreur d'autorisation Google Maps",
              description: "Votre domaine n'est pas autorisé. Contactez l'administrateur pour ajouter ce domaine à la clé API.",
              variant: "destructive",
            });
            
            return true;
          }
        }
        return false;
      };
      
      // Run an initial check
      if (!checkForMapErrors()) {
        try {
          // Add user location marker
          const userMarker = createUserLocationMarker(
            mapInstance.current,
            { lat: userLocation.latitude, lng: userLocation.longitude }
          );
          if (userMarker) markers.current.push(userMarker);
          
          // Add store markers
          stores.forEach(store => {
            try {
              // Check if it's a CBD store based on name
              const isCBDStore = (store.name || '').toLowerCase().includes('cbd');
              
              const marker = createStoreMarker(
                mapInstance.current!,
                { lat: store.latitude, lng: store.longitude },
                store.name,
                store.id === selectedStoreId,
                isCBDStore
              );
              
              if (marker && onSelectStore) {
                marker.addListener('click', () => {
                  onSelectStore(store);
                });
              }
              
              if (marker) markers.current.push(marker);
            } catch (markerError) {
              console.error("Error creating store marker:", markerError);
            }
          });
        } catch (markerError) {
          console.error("Error creating markers:", markerError);
        }
        
        // Run a secondary check after a short delay
        setTimeout(checkForMapErrors, 500);
      }
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
      setMapError("Une erreur est survenue lors de l'initialisation de la carte. Veuillez réessayer.");
      setErrorType('InitializationError');
    }
    
    return () => {
      // Cleanup markers
      markers.current.forEach(marker => {
        if (marker && marker.map) {
          marker.map = null;
        }
      });
      markers.current = [];
    };
  }, [userLocation, stores, selectedStoreId, onSelectStore, toast]);
  
  // Update marker appearances when selection changes
  useEffect(() => {
    if (!mapInstance.current || mapError) return;
    
    try {
      markers.current.forEach((marker, index) => {
        if (!marker || index >= stores.length) return;
        
        const store = stores[index];
        const isSelected = store.id === selectedStoreId;
        
        // Simple check to determine if this is a store marker (not a user location marker)
        if (store && marker.getTitle && marker.getTitle() === store.name) {
          try {
            // Can't update AdvancedMarkerElement directly, so we replace it
            if (isSelected && marker.position) {
              // Get the position
              let position: google.maps.LatLngLiteral;
              
              // Fix for the LatLng type error: ensure we create a proper LatLngLiteral
              if (marker.getPosition) {
                const pos = marker.getPosition();
                position = { 
                  lat: pos ? pos.lat() : store.latitude, 
                  lng: pos ? pos.lng() : store.longitude 
                };
              } else {
                position = { lat: store.latitude, lng: store.longitude };
              }
                
              // Replace with a new marker that has the selected appearance
              if (marker.map) {
                marker.map = null;
              }
              
              // Check if it's a CBD store based on name
              const isCBDStore = (store.name || '').toLowerCase().includes('cbd');
              
              markers.current[index] = createStoreMarker(
                mapInstance.current!,
                position,
                store.name,
                true,
                isCBDStore
              );
              
              // Center map on selected marker - use proper LatLng object
              const latLng = new google.maps.LatLng(position.lat, position.lng);
              mapInstance.current.panTo(latLng);
              
              // Re-add click handler
              if (onSelectStore && markers.current[index]) {
                markers.current[index].addListener('click', () => {
                  onSelectStore(store);
                });
              }
            }
          } catch (highlightError) {
            console.error("Error highlighting marker:", highlightError);
          }
        }
      });
    } catch (error) {
      console.error("Error updating markers:", error);
    }
  }, [selectedStoreId, stores, mapError, onSelectStore]);

  if (mapError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background/95 rounded-lg border border-muted">
        <div className="text-center p-6 rounded-lg max-w-md">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {errorType === 'RefererNotAllowedMapError' 
              ? "Erreur d'autorisation" 
              : "Erreur de chargement"}
          </h3>
          <p className="text-muted-foreground mb-4">{mapError}</p>
          
          {isRefererError && (
            <div className="bg-muted p-3 rounded text-sm text-left mb-4">
              <p className="font-medium mb-1">Information technique :</p>
              <p>RefererNotAllowedMapError - Votre domaine n'est pas autorisé à utiliser cette clé API.</p>
              <p className="mt-1">Domaine actuel : {window.location.origin}</p>
              <p className="mt-3 text-xs">Pour résoudre cette erreur, l'administrateur doit ajouter ce domaine dans les paramètres de la clé API Google Maps (Google Cloud Console → API & Services → Credentials).</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Recharger la page
            </Button>
            
            {errorType === 'RefererNotAllowedMapError' && (
              <p className="text-xs text-muted-foreground mt-2">
                Cette erreur doit être résolue par l'administrateur du site en ajoutant ce domaine dans les paramètres de la clé API Google Maps.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <div ref={mapContainerRef} className="absolute inset-0 z-10" />;
};

export default GoogleMapInitializer;
