
import { useEffect, useRef, useState } from 'react';
import { useGoogleMapsScript } from '@/hooks/maps/useGoogleMapsScript';
import { useToast } from "@/components/ui/use-toast";
import { Store } from '@/types/store';
import MapFallback from '../map/MapFallback';
import { createStoreMarker, createUserLocationMarker } from '@/utils/mapUtils';

interface BasicMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  stores?: Store[];
  onSelectStore?: (store: Store) => void;
  selectedStoreId?: string;
}

const BasicMap = ({ 
  center = { lat: 48.8566, lng: 2.3522 }, // Paris by default
  zoom = 12,
  className = "w-full h-[400px] rounded-lg",
  stores = [],
  onSelectStore,
  selectedStoreId
}: BasicMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const { apiKeyLoaded, error: apiError } = useGoogleMapsScript();
  const { toast } = useToast();
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapLoadError, setMapLoadError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isRefererError, setIsRefererError] = useState<boolean>(false);

  // Check for RefererNotAllowedMapError
  useEffect(() => {
    const checkForRefererError = () => {
      // Give it a moment to render the error if it exists
      setTimeout(() => {
        const errorElement = document.querySelector('.gm-err-message');
        if (errorElement && errorElement.textContent) {
          const errorText = errorElement.textContent;
          if (errorText.includes('RefererNotAllowedMapError') || errorText.includes('not authorized')) {
            console.log("Detected RefererNotAllowedMapError");
            setMapLoadError("Ce domaine n'est pas autorisé à utiliser cette clé API Google Maps.");
            setIsRefererError(true);
          }
        }
      }, 500);
    };
    
    if (apiKeyLoaded) {
      checkForRefererError();
    }
  }, [apiKeyLoaded]);

  // Initialize the map when API and DOM are ready
  useEffect(() => {
    if (!apiKeyLoaded || !mapRef.current || mapInstanceRef.current || isRefererError) {
      return;
    }

    try {
      // Initialize the map with standard options first
      const mapOptions = {
        center,
        zoom,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      };
      
      mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);
      
      // If we have user location, add a marker
      if (userLocation) {
        userMarkerRef.current = createUserLocationMarker(
          mapInstanceRef.current, 
          { lat: userLocation.latitude, lng: userLocation.longitude }
        );
      }
      
      console.log("Map initialized successfully with Advanced Markers API");
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapLoadError("Impossible d'initialiser la carte Google Maps");
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser la carte Google Maps",
        variant: "destructive"
      });
    }

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => {
        marker.map = null;
      });
      markersRef.current = [];
      
      // Clean up user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
      }
      
      mapInstanceRef.current = null;
    };
  }, [apiKeyLoaded, center, zoom, toast, userLocation, isRefererError]);

  // Add store markers when map is ready and stores are available
  useEffect(() => {
    if (!mapInstanceRef.current || !stores.length) return;
    
    // Clean up previous markers
    markersRef.current.forEach(marker => {
      marker.map = null;
    });
    markersRef.current = [];
    
    // Add new markers for each store
    stores.forEach(store => {
      // Check if it's a CBD store based on name
      const isCBDStore = (store.name || '').toLowerCase().includes('cbd');
      
      // Create the marker
      const marker = createStoreMarker(
        mapInstanceRef.current!,
        { lat: store.latitude, lng: store.longitude },
        store.name,
        store.id === selectedStoreId,
        isCBDStore
      );
      
      // Add click handler if onSelectStore is provided
      if (onSelectStore) {
        // Fix: Changed addEventListener to addListener
        marker.addListener('gmp-click', () => {
          onSelectStore(store);
        });
      }
      
      markersRef.current.push(marker);
    });
    
    // If there's a selected store, center the map on it
    if (selectedStoreId) {
      const selectedStore = stores.find(store => store.id === selectedStoreId);
      if (selectedStore && mapInstanceRef.current) {
        mapInstanceRef.current.setCenter({
          lat: selectedStore.latitude,
          lng: selectedStore.longitude
        });
        
        // Update the marker appearance
        markersRef.current.forEach((marker, index) => {
          const store = stores[index];
          if (store.id === selectedStoreId) {
            // Highlight the selected store marker
            const isCBDStore = (store.name || '').toLowerCase().includes('cbd');
            
            // Replace with a new marker that has the selected appearance
            marker.map = null;
            markersRef.current[index] = createStoreMarker(
              mapInstanceRef.current!,
              { lat: store.latitude, lng: store.longitude },
              store.name,
              true,
              isCBDStore
            );
            
            // Add the click handler again
            if (onSelectStore) {
              // Fix: Changed addEventListener to addListener
              markersRef.current[index].addListener('gmp-click', () => {
                onSelectStore(store);
              });
            }
          }
        });
      }
    }
  }, [stores, selectedStoreId, onSelectStore]);

  // Try to get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Geolocation error:", error);
          setLocationError("Impossible d'accéder à votre position");
        }
      );
    } else {
      setLocationError("La géolocalisation n'est pas prise en charge par votre navigateur");
    }
  }, []);

  // Show fallback UI when map is not ready
  if (!apiKeyLoaded || mapLoadError || apiError) {
    const errorMessage = mapLoadError || apiError || "Erreur de chargement de la carte";
    
    return (
      <div className={`relative ${className}`}>
        <MapFallback 
          stores={stores}
          selectedStoreId={selectedStoreId}
          userLocation={userLocation}
          locationError={locationError}
          mapLoadError={errorMessage}
          isRefererError={isRefererError}
          onStoreClick={onSelectStore || (() => {})}
          domain={window.location.origin}
        />
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className={className}
      aria-label="Carte Google Maps"
    />
  );
};

export default BasicMap;
