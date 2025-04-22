
import { useGoogleMapsScript } from './maps/useGoogleMapsScript';
import { useUserLocation } from './maps/useUserLocation';
import { useMapInitialization } from './maps/useMapInitialization';

export const useGoogleMap = () => {
  const { apiKeyLoaded } = useGoogleMapsScript();
  const { userLocation } = useUserLocation();
  const { map, isLoading, initializeMap } = useMapInitialization(apiKeyLoaded);

  return {
    map,
    isLoading,
    userLocation,
    initializeMap,
    apiKeyLoaded
  };
};
