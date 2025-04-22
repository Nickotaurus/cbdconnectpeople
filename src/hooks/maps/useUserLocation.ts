
import { useState, useEffect } from 'react';
import { getCurrentLocation } from '@/utils/mapUtils';

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const location = await getCurrentLocation();
        console.log("User location obtained:", location);
        setUserLocation(location);
      } catch (error) {
        console.error('Error getting location:', error);
        // Use a default location if geolocation fails
        console.log("Using default location (Paris)");
        setUserLocation({ lat: 48.856614, lng: 2.3522219 }); // Default to Paris, France
      }
    };

    fetchUserLocation();
  }, []);

  return { userLocation };
};
