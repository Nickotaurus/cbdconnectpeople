
// Google Places API response types
export interface GooglePlaceResult {
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
  vicinity?: string;
}

export interface GooglePlaceReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
}

export interface GooglePlacesResponse {
  results: GooglePlaceResult[];
  next_page_token?: string;
  status: string;
}

export interface GooglePlaceDetailsResponse {
  result: GooglePlaceResult & {
    reviews: GooglePlaceReview[];
  };
  status: string;
}
