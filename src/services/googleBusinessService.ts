
import { getPlacesService } from './googleMapsService';
import { BusinessDetails } from '@/types/store/store-data';

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
          'user_ratings_total', 'photos', 'reviews'
        ]
      }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          // Process photos to get URLs
          const photos = place.photos ? 
            place.photos.slice(0, 5).map(photo => photo.getUrl({ maxWidth: 500, maxHeight: 500 })) : 
            [];
          
          // Process reviews if available
          const reviews = place.reviews ? 
            place.reviews.map(review => ({
              author_name: review.author_name,
              rating: review.rating,
              text: review.text,
              time: review.time,
              relative_time_description: review.relative_time_description,
              profile_photo_url: review.profile_photo_url
            })) : 
            [];
            
          // Return formatted business info with reviews
          resolve({
            name: place.name || '',
            address: place.formatted_address || '',
            phone: place.formatted_phone_number,
            website: place.website,
            rating: place.rating,
            totalReviews: place.user_ratings_total,
            photos,
            reviews,
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

// Améliorer la fonction fetchReviewsData pour garantir une meilleure récupération des données
export const fetchReviewsData = async (placeId: string): Promise<{ rating?: number, totalReviews?: number } | null> => {
  try {
    if (!window.google?.maps?.places || !placeId) {
      console.error("Google Places API not available or placeId is missing");
      return null;
    }
    
    console.log("Fetching reviews for placeId:", placeId);
    
    const service = getPlacesService();
    if (!service) {
      console.error("Could not create Places service");
      return null;
    }
    
    return new Promise((resolve) => {
      // Utiliser plus de champs pour s'assurer que nous obtenons toutes les données nécessaires
      service.getDetails({
        placeId,
        fields: ['name', 'rating', 'user_ratings_total', 'reviews']
      }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          console.log("Google reviews data received:", {
            name: place.name,
            rating: place.rating,
            totalReviews: place.user_ratings_total,
            hasReviews: place.reviews ? place.reviews.length > 0 : false
          });
          
          resolve({
            rating: place.rating,
            totalReviews: place.user_ratings_total
          });
        } else {
          console.warn("Failed to fetch review data:", status);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching review data:", error);
    return null;
  }
};
