
import { useEffect, useRef, useState } from 'react';
import { Store } from '@/types/store';
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);

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
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
      setMapError("Une erreur est survenue lors de l'initialisation de la carte. Veuillez réessayer.");
    }
    
    return () => {
      // Cleanup markers
      markers.current.forEach(marker => marker.setMap(null));
      markers.current = [];
    };
  }, [userLocation, stores, selectedStoreId, onSelectStore]);
  
  // Update marker animations when selection changes
  useEffect(() => {
    if (!mapInstance.current) return;
    
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
  }, [selectedStoreId, stores]);

  if (mapError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background/80">
        <div className="text-center p-6 rounded-lg">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-muted-foreground mb-4">{mapError}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return <div ref={mapContainerRef} className="absolute inset-0 z-10" />;
};

export default GoogleMapInitializer;
