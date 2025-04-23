
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
    if (!window.google?.maps?.places) {
      console.error('Google Places API not available');
      return null;
    }

    return new Promise((resolve, reject) => {
      const serviceDiv = document.createElement('div');
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
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const photos = place.photos
              ? place.photos.slice(0, 5).map(photo => photo.getUrl({ maxWidth: 400, maxHeight: 300 }))
              : [];
            
            const businessDetails: BusinessDetails = {
              name: place.name || '',
              address: place.formatted_address || '',
              phone: place.formatted_phone_number,
              website: place.website,
              rating: place.rating,
              totalReviews: place.user_ratings_total,
              photos,
              placeId,
              latitude: place.geometry?.location.lat() || 0,
              longitude: place.geometry?.location.lng() || 0
            };
            
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
    if (!window.google?.maps?.places) {
      console.error('Google Places API not available');
      return null;
    }

    return new Promise((resolve, reject) => {
      const serviceDiv = document.createElement('div');
      document.body.appendChild(serviceDiv);
      const service = new google.maps.places.PlacesService(serviceDiv);

      // Recherche avec nom et adresse si disponibles
      const searchQuery = name ? `${name} ${address}` : address;

      service.findPlaceFromQuery(
        {
          query: searchQuery,
          fields: ['place_id']
        },
        (results, status) => {
          document.body.removeChild(serviceDiv);
          
          if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            // Place trouvée, récupérer les détails avec le premier résultat
            const placeId = results[0].place_id;
            if (placeId) {
              findBusinessByPlaceId(placeId)
                .then(details => resolve(details))
                .catch(err => {
                  console.error('Error fetching details after finding place:', err);
                  resolve(null);
                });
            } else {
              resolve(null);
            }
          } else {
            console.log('No business found with query:', searchQuery);
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
