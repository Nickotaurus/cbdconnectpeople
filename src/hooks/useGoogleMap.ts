
import { useEffect, useRef, useState } from 'react';
import { getCurrentLocation, initializeGoogleMap } from '@/utils/mapUtils';
import { toast } from "@/hooks/use-toast";

export const useGoogleMap = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const initializeMap = async (mapElement: HTMLElement | null) => {
    if (!window.google?.maps) {
      toast({
        title: "Erreur",
        description: "Le service Google Maps n'est pas disponible",
        variant: "destructive"
      });
      return null;
    }

    if (!mapElement) return null;

    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      const map = initializeGoogleMap(mapElement, location);
      mapRef.current = map;
      return map;
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser la carte",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    map: mapRef.current,
    isLoading,
    userLocation,
    initializeMap
  };
};
