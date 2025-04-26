
import { useEffect } from 'react';
import { getGoogleMapsApiKey } from '@/services/googleApiService';

let googleMapsLoadingPromise: Promise<void> | null = null;

export const loadGoogleMapsAPI = async () => {
  if (window.google?.maps?.places) {
    return Promise.resolve();
  }
  
  if (googleMapsLoadingPromise) {
    return googleMapsLoadingPromise;
  }
  
  googleMapsLoadingPromise = (async () => {
    try {
      const apiKey = await getGoogleMapsApiKey();
      
      if (!apiKey) {
        throw new Error("No API key available");
      }
      
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        return new Promise<void>((resolve, reject) => {
          const checkInterval = setInterval(() => {
            if (window.google?.maps?.places) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 500);
          
          setTimeout(() => {
            clearInterval(checkInterval);
            reject(new Error("Timeout waiting for Google Maps API"));
          }, 10000);
        });
      }
      
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&callback=initGoogleMapsCallback`;
        script.async = true;
        script.defer = true;
        
        window.initGoogleMapsCallback = () => {
          resolve();
        };
        
        script.onerror = () => {
          reject(new Error("Failed to load Google Maps API"));
        };
        
        document.head.appendChild(script);
      });
    } catch (error) {
      throw error;
    }
  })();
  
  return googleMapsLoadingPromise;
};

const GoogleMapsLoader = () => {
  useEffect(() => {
    loadGoogleMapsAPI().catch(error => {
      console.error("Error loading Google Maps API:", error);
    });
  }, []);

  return null;
};

export default GoogleMapsLoader;
