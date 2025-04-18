
import { useEffect, useState } from 'react';
import { Store } from '@/types/store';
import { filterUserLocation } from '@/utils/geoUtils';
import GoogleMapInitializer from './map/GoogleMapInitializer';
import MapFallback from './map/MapFallback';

interface MapProps {
  stores: Store[];
  onSelectStore?: (store: Store) => void;
  selectedStoreId?: string;
}

const Map = ({ stores, onSelectStore, selectedStoreId }: MapProps) => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // Check if Google Maps is loaded
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps) {
        setIsGoogleMapsLoaded(true);
      } else {
        setTimeout(checkGoogleMapsLoaded, 500);
      }
    };
    
    checkGoogleMapsLoaded();
  }, []);
  
  // Get user location
  useEffect(() => {
    const defaultLocation = filterUserLocation();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Impossible d'accéder à votre position. Veuillez autoriser l'accès à la géolocalisation.");
          setUserLocation(defaultLocation);
        },
        { 
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError("La géolocalisation n'est pas supportée par votre navigateur.");
      setUserLocation(defaultLocation);
    }
  }, []);

  const handleStoreClick = (store: Store) => {
    if (onSelectStore) {
      onSelectStore(store);
    }
  };

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] bg-secondary rounded-lg overflow-hidden">
      {isGoogleMapsLoaded && userLocation ? (
        <GoogleMapInitializer
          userLocation={userLocation}
          stores={stores}
          onSelectStore={onSelectStore}
          selectedStoreId={selectedStoreId}
        />
      ) : (
        <MapFallback
          stores={stores}
          selectedStoreId={selectedStoreId}
          userLocation={userLocation}
          locationError={locationError}
          onStoreClick={handleStoreClick}
        />
      )}
    </div>
  );
};

export default Map;
