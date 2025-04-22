import { supabase } from '@/integrations/supabase/client';
import { Store } from './data';

// Types for the API Google Places
interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
  rating?: number;
  user_ratings_total?: number;
  photos?: {
    photo_reference: string;
    height: number;
    width: number;
  }[];
  website?: string;
  formatted_phone_number?: string;
  opening_hours?: {
    weekday_text: string[];
  };
}

interface GooglePlaceReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
}

interface GooglePlacesResponse {
  results: GooglePlaceResult[];
  next_page_token?: string;
  status: string;
}

interface GooglePlaceDetailsResponse {
  result: GooglePlaceResult & {
    reviews: GooglePlaceReview[];
  };
  status: string;
}

// Function to get Google Maps API key from Supabase
export const getGoogleMapsApiKey = async (): Promise<string> => {
  try {
    const { data, error } = await supabase
      .functions.invoke('get-google-maps-key');

    if (error) {
      console.error('Error fetching Google Maps API key:', error);
      throw new Error('Impossible de récupérer la clé API Google Maps.');
    }

    return data?.apiKey || '';
  } catch (error) {
    console.error('Unexpected error getting Google Maps API key:', error);
    return '';
  }
};

// Fonction pour rechercher des boutiques CBD en France
export const searchCBDShops = async (
  query: string = "boutique CBD", 
  location: string = "France"
): Promise<GooglePlaceResult[]> => {
  try {
    const apiKey = await getGoogleMapsApiKey();
    
    if (!apiKey) {
      throw new Error("Clé API Google Places non disponible");
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&location=${encodeURIComponent(location)}&radius=50000&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la recherche de boutiques CBD");
    }

    const data: GooglePlacesResponse = await response.json();
    
    if (data.status !== "OK") {
      throw new Error(`Erreur API: ${data.status}`);
    }

    return data.results;
  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
    throw error;
  }
};

// Fonction pour obtenir les détails d'une boutique, y compris les avis
export const getPlaceDetails = async (
  placeId: string
): Promise<GooglePlaceDetailsResponse["result"]> => {
  try {
    const apiKey = await getGoogleMapsApiKey();
    
    if (!apiKey) {
      throw new Error("Clé API Google Places non disponible");
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_address,geometry,reviews,website,formatted_phone_number,opening_hours&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des détails de la boutique");
    }

    const data: GooglePlaceDetailsResponse = await response.json();
    
    if (data.status !== "OK") {
      throw new Error(`Erreur API: ${data.status}`);
    }

    return data.result;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails:", error);
    throw error;
  }
};

// Fonction pour convertir les données Google Places en format Store
export const convertToStoreFormat = (
  placeDetails: GooglePlaceDetailsResponse["result"]
): Omit<Store, "id"> => {
  // Extraire le code postal de l'adresse
  const postalCodeMatch = placeDetails.formatted_address.match(/\b\d{5}\b/);
  const postalCode = postalCodeMatch ? postalCodeMatch[0] : "";
  
  // Extraire la ville de l'adresse (approximation)
  const addressParts = placeDetails.formatted_address.split(',');
  const city = addressParts.length > 1 
    ? addressParts[addressParts.length - 2].trim().replace(/^\d{5}/, '').trim()
    : "";

  // Convertir les heures d'ouverture
  const openingHours = placeDetails.opening_hours?.weekday_text.map(day => {
    const [dayName, hours] = day.split(': ');
    return {
      day: dayName,
      hours: hours || "Fermé"
    };
  }) || [];

  // Convertir les avis
  const reviews = (placeDetails.reviews || []).map((review, index) => {
    // Catégoriser les avis (simple approximation)
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

  // Générer une image par défaut si aucune n'est disponible
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
    coupon: {
      code: `${placeDetails.name.substring(0, 5).toUpperCase()}10",
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
