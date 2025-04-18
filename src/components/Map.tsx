
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
  const [mapLoadError, setMapLoadError] = useState<string | null>(null);

  // Check if Google Maps is loaded
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      // Check if Google Maps API is loaded and not throwing errors
      if (window.google && window.google.maps) {
        try {
          // This will throw an error if the API key is invalid or domain is not authorized
          new window.google.maps.LatLng(0, 0);
          setIsGoogleMapsLoaded(true);
          setMapLoadError(null);
        } catch (error) {
          console.error("Google Maps API error:", error);
          setMapLoadError("L'API Google Maps n'a pas pu être chargée correctement. Veuillez vérifier votre connexion internet ou réessayer plus tard.");
          setIsGoogleMapsLoaded(false);
        }
      } else {
        // If still loading, try again in a moment
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
          mapLoadError={mapLoadError}
          onStoreClick={handleStoreClick}
        />
      )}
    </div>
  );
};

export default Map;
