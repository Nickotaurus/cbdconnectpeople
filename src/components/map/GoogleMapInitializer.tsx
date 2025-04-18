
import { useEffect, useRef } from 'react';
import { Store } from '@/types/store';

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

  return <div ref={mapContainerRef} className="absolute inset-0 z-10" />;
};

export default GoogleMapInitializer;
