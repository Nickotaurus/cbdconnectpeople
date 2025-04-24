
import { getGoogleMapsApiKey } from './googleApiService';

interface BusinessDetails {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  totalReviews?: number;
  photos?: string[];
  placeId: string;
  latitude: number;
  longitude: number;
}

export const findBusinessByPlaceId = async (placeId: string): Promise<BusinessDetails | null> => {
  try {
    // Vérifier si l'API Google Places est disponible
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error('Google Places API not available');
      await loadGoogleMapsAPI();
      
      // Vérifier à nouveau après la tentative de chargement
      if (!window.google?.maps?.places) {
        console.error('Google Places API still not available after loading');
        return null;
      }
    }

    return new Promise((resolve, reject) => {
      // Créer un div pour le service PlacesService
      const serviceDiv = document.createElement('div');
      document.body.appendChild(serviceDiv);
      const service = new google.maps.places.PlacesService(serviceDiv);

      service.getDetails(
        {
          placeId,
          fields: [
            'name', 
            'formatted_address', 
            'formatted_phone_number', 
            'website', 
            'rating', 
            'user_ratings_total', 
            'geometry',
            'photos'
          ]
        },
        (place, status) => {
          // Nettoyer le div temporaire
          document.body.removeChild(serviceDiv);
          
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            console.log("Place details retrieved successfully:", place);
            
            // Récupérer les photos avec gestion d'erreur
            let photos: string[] = [];
            if (place.photos && place.photos.length > 0) {
              try {
                photos = place.photos.slice(0, 5).map(photo => {
                  try {
                    return photo.getUrl({
                      maxWidth: 800,
                      maxHeight: 600
                    });
                  } catch (photoError) {
                    console.error('Error getting photo URL:', photoError);
                    return '';
                  }
                }).filter(url => url !== ''); // Filtrer les URLs vides
              } catch (photosError) {
                console.error('Error processing photos:', photosError);
              }
            }
            
            const businessDetails: BusinessDetails = {
              name: place.name || '',
              address: place.formatted_address || '',
              phone: (place as any).formatted_phone_number,
              website: (place as any).website,
              rating: place.rating,
              totalReviews: place.user_ratings_total,
              photos,
              placeId,
              latitude: place.geometry?.location?.lat() || 0,
              longitude: place.geometry?.location?.lng() || 0
            };
            
            console.log("Business details formatted:", businessDetails);
            resolve(businessDetails);
          } else {
            console.error('Error fetching place details:', status);
            resolve(null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in findBusinessByPlaceId:', error);
    return null;
  }
};

export const findBusinessByAddress = async (address: string, name?: string): Promise<BusinessDetails | null> => {
  try {
    // Vérifier si l'API Google Places est disponible
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error('Google Places API not available');
      await loadGoogleMapsAPI();
      
      // Vérifier à nouveau après la tentative de chargement
      if (!window.google?.maps?.places) {
        console.error('Google Places API still not available after loading');
        return null;
      }
    }

    return new Promise((resolve, reject) => {
      const serviceDiv = document.createElement('div');
      document.body.appendChild(serviceDiv);
      const service = new google.maps.places.PlacesService(serviceDiv);

      // Recherche avec nom et adresse si disponibles
      const searchQuery = name ? `${name} ${address}` : address;
      console.log("Searching for place with query:", searchQuery);

      service.findPlaceFromQuery(
        {
          query: searchQuery,
          fields: ['place_id', 'name', 'formatted_address', 'geometry']
        },
        (results, status) => {
          document.body.removeChild(serviceDiv);
          
          if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            console.log("Place found:", results[0]);
            // Place trouvée, récupérer les détails avec le premier résultat
            const placeId = results[0].place_id;
            if (placeId) {
              findBusinessByPlaceId(placeId)
                .then(details => {
                  console.log("Retrieved business details:", details);
                  resolve(details);
                })
                .catch(err => {
                  console.error('Error fetching details after finding place:', err);
                  resolve(null);
                });
            } else {
              resolve(null);
            }
          } else {
            console.log('No business found with query:', searchQuery, 'Status:', status);
            resolve(null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in findBusinessByAddress:', error);
    return null;
  }
};

// Fonction utilitaire pour charger l'API Google Maps si elle n'est pas disponible
const loadGoogleMapsAPI = async (): Promise<void> => {
  if (window.google?.maps?.places) {
    return Promise.resolve();
  }
  
  try {
    const apiKey = await getGoogleMapsApiKey();
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps API loaded successfully via loadGoogleMapsAPI');
        resolve();
      };
      
      script.onerror = (err) => {
        console.error('Failed to load Google Maps API:', err);
        reject(new Error('Failed to load Google Maps API'));
      };
      
      document.head.appendChild(script);
    });
  } catch (err) {
    console.error('Error getting Google Maps API key:', err);
    return Promise.reject(err);
  }
};
