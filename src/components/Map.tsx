
import { useEffect, useState } from 'react';
import { Store } from '@/types/store';
import { filterUserLocation } from '@/utils/geoUtils';
import GoogleMapInitializer from './map/GoogleMapInitializer';
import MapFallback from './map/MapFallback';
import { useToast } from "@/components/ui/use-toast";

interface MapProps {
  stores: Store[];
  onSelectStore?: (store: Store) => void;
  selectedStoreId?: string;
}

const Map = ({ stores, onSelectStore, selectedStoreId }: MapProps) => {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [mapLoadError, setMapLoadError] = useState<string | null>(null);

  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps) {
        try {
          new window.google.maps.LatLng(0, 0);
          setIsGoogleMapsLoaded(true);
          setMapLoadError(null);
        } catch (error) {
          console.error("Google Maps API error:", error);
          setMapLoadError("L'API Google Maps n'a pas pu être chargée correctement. Veuillez vérifier votre connexion internet ou réessayer plus tard.");
          setIsGoogleMapsLoaded(false);
          
          toast({
            title: "Erreur de chargement Google Maps",
            description: "La carte ne peut pas être chargée. Vérifiez votre connexion ou essayez de recharger la page.",
            variant: "destructive",
          });
        }
      } else {
        setTimeout(checkGoogleMapsLoaded, 500);
      }
    };
    
    checkGoogleMapsLoaded();
    
    const handleScriptError = () => {
      setMapLoadError("Impossible de charger Google Maps. Vérifiez votre connexion internet ou l'autorisation du domaine.");
      setIsGoogleMapsLoaded(false);
      
      toast({
        title: "Erreur Google Maps",
        description: "Votre domaine n'est pas autorisé à utiliser cette clé API Google Maps.",
        variant: "destructive",
      });
    };
    
    const mapsScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (mapsScript) {
      mapsScript.addEventListener('error', handleScriptError);
    }
    
    return () => {
      if (mapsScript) {
        mapsScript.removeEventListener('error', handleScriptError);
      }
    };
  }, [toast]);
  
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
          
          toast({
            title: "Accès à la position impossible",
            description: "Nous utilisons une position approximative. Pour une meilleure expérience, autorisez la géolocalisation.",
            variant: "default",
          });
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
  }, [toast]);

  const handleStoreClick = (store: Store) => {
    if (onSelectStore) {
      onSelectStore(store);
    }
  };

  // Check for Google Maps error divs that might be created in the DOM
  useEffect(() => {
    const checkForRefererError = () => {
      const errorDivs = document.querySelectorAll('.gm-err-container');
      
      if (errorDivs.length > 0) {
        const errorMessage = document.querySelector('.gm-err-message')?.textContent;
        
        if (errorMessage && errorMessage.includes('RefererNotAllowedMapError')) {
          setMapLoadError("Ce domaine n'est pas autorisé à utiliser cette clé API Google Maps.");
          setIsGoogleMapsLoaded(false);
        }
      }
    };
    
    // Check after a short delay to allow Google Maps to render its error
    const errorCheckTimeout = setTimeout(checkForRefererError, 1000);
    
    return () => {
      clearTimeout(errorCheckTimeout);
    };
  }, [isGoogleMapsLoaded]);

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
