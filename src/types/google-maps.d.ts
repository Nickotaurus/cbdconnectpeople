
// Type definitions for Google Maps JavaScript API
declare namespace google {
  namespace maps {
    namespace places {
      interface PlaceResult {
        place_id?: string;
        formatted_address?: string;
        geometry?: {
          location: {
            lat: () => number;
            lng: () => number;
          };
        };
        name?: string;
        rating?: number;
        user_ratings_total?: number;
        photos?: {
          getUrl: () => string;
        }[];
      }

      enum PlacesServiceStatus {
        OK,
        ZERO_RESULTS,
        OVER_QUERY_LIMIT,
        REQUEST_DENIED,
        INVALID_REQUEST,
        UNKNOWN_ERROR
      }

      class PlacesService {
        constructor(attrContainer: Element);
        findPlaceFromQuery(
          request: {
            query: string;
            fields: string[];
          },
          callback: (
            results: PlaceResult[] | null,
            status: PlacesServiceStatus
          ) => void
        ): void;
      }
    }
  }
}
