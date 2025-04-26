
import { useEffect } from 'react';
import { loadGoogleMapsAPI } from '@/services/googleMapsService';

const GoogleMapsLoader = () => {
  useEffect(() => {
    loadGoogleMapsAPI().catch(error => {
      console.error("Error loading Google Maps API:", error);
    });
  }, []);

  return null;
};

export default GoogleMapsLoader;
