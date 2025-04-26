
import { getPlacesService } from './googleMapsService';
import { BusinessDetails } from '@/types/store-types';

export const findBusinessByPlaceId = async (placeId: string): Promise<BusinessDetails | null> => {
  try {
    if (!window.google?.maps?.places) {
      console.error("Google Places API not available");
      return null;
    }
    
    // Use our centralized service instead of creating a new one
    const service = getPlacesService();
    if (!service) {
      console.error("Could not create Places service");
      return null;
    }
    
    return new Promise((resolve, reject) => {
      service.getDetails({
        placeId,
        fields: [
          'name', 'formatted_address', 'place_id', 'geometry', 
          'website', 'formatted_phone_number', 'rating',
          'user_ratings_total', 'photos'
        ]
      }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          // Process photos to get URLs
          const photos = place.photos ? 
            place.photos.slice(0, 5).map(photo => photo.getUrl({ maxWidth: 500, maxHeight: 500 })) : 
            [];
            
          // Return formatted business info
          resolve({
            name: place.name || '',
            address: place.formatted_address || '',
            phone: place.formatted_phone_number,
            website: place.website,
            rating: place.rating,
            totalReviews: place.user_ratings_total,
            photos,
            placeId: place.place_id || '',
            latitude: place.geometry?.location.lat() || 0,
            longitude: place.geometry?.location.lng() || 0
          });
        } else {
          console.warn("Place details not found:", status);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching business details:", error);
    return null;
  }
};
