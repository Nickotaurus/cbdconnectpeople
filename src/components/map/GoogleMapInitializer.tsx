
import { useEffect, useRef, useState } from 'react';
import { Store } from '@/types/store';
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
  const markers = useRef<google.maps.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    try {
      // Create the map
      const mapOptions = {
        center: { lat: userLocation.latitude, lng: userLocation.longitude },
        zoom: 13,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false
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
        // Add user location marker
        new window.google.maps.Marker({
          position: { lat: userLocation.latitude, lng: userLocation.longitude },
          map: mapInstance.current,
          title: "Votre position",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#4F46E5",
            fillOpacity: 1,
            strokeColor: "#312E81",
            strokeWeight: 2,
            scale: 8
          }
        });
        
        // Add store markers
        stores.forEach(store => {
          const marker = new window.google.maps.Marker({
            position: { lat: store.latitude, lng: store.longitude },
            map: mapInstance.current,
            title: store.name,
            animation: store.id === selectedStoreId 
              ? window.google.maps.Animation.BOUNCE 
              : window.google.maps.Animation.DROP
          });
          
          marker.addListener('click', () => {
            if (onSelectStore) {
              onSelectStore(store);
            }
          });
          
          markers.current.push(marker);
        });
        
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
      markers.current.forEach(marker => marker.setMap(null));
      markers.current = [];
    };
  }, [userLocation, stores, selectedStoreId, onSelectStore, toast]);
  
  // Update marker animations when selection changes
  useEffect(() => {
    if (!mapInstance.current || mapError) return;
    
    markers.current.forEach(marker => {
      const storeIndex = stores.findIndex(store => 
        store.latitude === marker.getPosition()?.lat() && 
        store.longitude === marker.getPosition()?.lng()
      );
      
      if (storeIndex !== -1) {
        const isSelected = stores[storeIndex].id === selectedStoreId;
        marker.setAnimation(isSelected ? window.google.maps.Animation.BOUNCE : null);
        
        if (isSelected && mapInstance.current) {
          mapInstance.current.panTo(marker.getPosition()!);
        }
      }
    });
  }, [selectedStoreId, stores, mapError]);

  if (mapError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background/90">
        <div className="text-center p-6 rounded-lg max-w-md">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {errorType === 'RefererNotAllowedMapError' 
              ? "Erreur d'autorisation" 
              : "Erreur de chargement"}
          </h3>
          <p className="text-muted-foreground mb-4">{mapError}</p>
          
          {errorType === 'RefererNotAllowedMapError' && (
            <div className="bg-muted p-3 rounded text-sm text-left mb-4">
              <p className="font-medium mb-1">Information technique :</p>
              <p>RefererNotAllowedMapError - Votre domaine n'est pas autorisé à utiliser cette clé API.</p>
              <p className="mt-1">Domaine actuel : {window.location.origin}</p>
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
