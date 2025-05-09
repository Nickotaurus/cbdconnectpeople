
import type { Store } from '@/types/store';
import type { GooglePlaceDetailsResponse } from '@/types/google-places.types';

export const convertToStoreFormat = (
  placeDetails: GooglePlaceDetailsResponse["result"]
): Omit<Store, "id"> => {
  // Extract postal code from address
  const postalCodeMatch = placeDetails.formatted_address.match(/\b\d{5}\b/);
  const postalCode = postalCodeMatch ? postalCodeMatch[0] : "";
  
  // Extract city from address (approximation)
  const addressParts = placeDetails.formatted_address.split(',');
  const city = addressParts.length > 1 
    ? addressParts[addressParts.length - 2].trim().replace(/^\d{5}/, '').trim()
    : "";

  // Convert opening hours
  const openingHours = placeDetails.opening_hours?.weekday_text.map(day => {
    const [dayName, hours] = day.split(': ');
    return {
      day: dayName,
      hours: hours || "Fermé"
    };
  }) || [];

  // Convert reviews
  const reviews = (placeDetails.reviews || []).map((review, index) => {
    const categories = ["flowers", "oils", "experience", "originality"];
    const category = categories[index % categories.length] as "flowers" | "oils" | "experience" | "originality";
    
    return {
      id: `r${index + 1}`,
      author: review.author_name,
      date: new Date(review.time * 1000).toISOString().split('T')[0],
      rating: review.rating,
      text: review.text,
      category
    };
  });

  // Generate default image if none available
  const imageUrl = "https://images.unsplash.com/photo-1603726623530-8a99ef1f1d93?q=80&w=1000";

  return {
    name: placeDetails.name,
    address: placeDetails.formatted_address.split(',')[0],
    city,
    postalCode,
    latitude: placeDetails.geometry.location.lat,
    longitude: placeDetails.geometry.location.lng,
    phone: placeDetails.formatted_phone_number || "",
    website: placeDetails.website || "",
    openingHours,
    description: "Boutique spécialisée dans les produits CBD de qualité.",
    imageUrl,
    rating: placeDetails.rating || 0,
    reviewCount: placeDetails.user_ratings_total || 0,
    placeId: placeDetails.place_id || "", // Setting placeId from the place_id property
    coupon: {
      code: `${placeDetails.name.substring(0, 5).toUpperCase()}10`,
      discount: "10% sur votre première commande",
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    reviews,
    products: [
      { category: "Fleurs", origin: "France", quality: "Premium" },
      { category: "Huiles", origin: "France", quality: "Bio" },
    ],
  };
};
