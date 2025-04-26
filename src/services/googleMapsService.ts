
import { getGoogleMapsApiKey } from './googleApiService';

// Track the loading state globally
let isLoadingAPI = false;
let isAPILoaded = false;
let loadPromise: Promise<void> | null = null;

/**
 * Loads the Google Maps API with the specified libraries.
 * This function ensures that the API is only loaded once, regardless of how many times it's called.
 */
export const loadGoogleMapsAPI = async (libraries: string[] = ['places', 'marker']): Promise<void> => {
  // If API is already loaded, return immediately
  if (isAPILoaded && window.google?.maps) {
    return Promise.resolve();
  }
  
  // If loading is in progress, return the existing promise
  if (isLoadingAPI && loadPromise) {
    return loadPromise;
  }
  
  // Check for existing script to avoid duplicates
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
  if (existingScript) {
    console.log("Google Maps script already exists, waiting for it to load");
    
    // If script exists but API isn't fully loaded yet, create a waiting promise
    if (!window.google?.maps) {
      loadPromise = new Promise<void>((resolve) => {
        const checkInterval = setInterval(() => {
          if (window.google?.maps) {
            clearInterval(checkInterval);
            isAPILoaded = true;
            isLoadingAPI = false;
            resolve();
          }
        }, 100);
        
        // Set a timeout to avoid infinite waiting
        setTimeout(() => {
          if (!isAPILoaded) {
            clearInterval(checkInterval);
            console.warn("Timeout waiting for existing Google Maps script to load");
            resolve(); // Resolve anyway to prevent hanging
          }
        }, 10000);
      });
      
      return loadPromise;
    }
    
    isAPILoaded = true;
    return Promise.resolve();
  }
  
  // Start new loading process
  isLoadingAPI = true;
  
  loadPromise = (async () => {
    try {
      console.log("Starting Google Maps API loading process");
      const apiKey = await getGoogleMapsApiKey();
      
      if (!apiKey) {
        throw new Error("No Google Maps API key available");
      }
      
      return new Promise<void>((resolve, reject) => {
        // Create callback function
        const callbackName = 'initGoogleMapsCallback';
        window[callbackName] = () => {
          console.log("Google Maps API loaded successfully");
          isAPILoaded = true;
          isLoadingAPI = false;
          resolve();
        };
        
        // Create script element with proper loading attribute
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}&callback=${callbackName}&loading=async`;
        script.async = true;
        script.defer = true;
        
        script.onerror = (error) => {
          console.error("Error loading Google Maps API:", error);
          isLoadingAPI = false;
          reject(new Error("Failed to load Google Maps API"));
        };
        
        document.head.appendChild(script);
      });
    } catch (error) {
      isLoadingAPI = false;
      console.error("Error in Google Maps API loading process:", error);
      throw error;
    }
  })();
  
  return loadPromise;
};

/**
 * Checks if the Google Maps API is loaded and ready to use
 */
export const isGoogleMapsLoaded = (): boolean => {
  return isAPILoaded && !!window.google?.maps;
};

/**
 * Creates a service div for Places API that can be reused
 */
export const createPlacesServiceDiv = (): HTMLDivElement => {
  const existingDiv = document.getElementById('google-maps-places-service-div') as HTMLDivElement;
  if (existingDiv) {
    return existingDiv;
  }
  
  const div = document.createElement('div');
  div.id = 'google-maps-places-service-div';
  div.style.width = '1px';
  div.style.height = '1px';
  div.style.position = 'absolute';
  div.style.top = '-1000px';
  div.style.visibility = 'hidden';
  document.body.appendChild(div);
  
  return div;
};

/**
 * Gets a Places service instance using a shared service div
 */
export const getPlacesService = (): google.maps.places.PlacesService | null => {
  if (!isGoogleMapsLoaded()) {
    return null;
  }
  
  const serviceDiv = createPlacesServiceDiv();
  return new google.maps.places.PlacesService(serviceDiv);
};
