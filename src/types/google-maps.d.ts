
// Type definitions for Google Maps JavaScript API
declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options: MapOptions);
      panTo(latLng: LatLng): void;
      setCenter(latLng: LatLng): void;
      setZoom(zoom: number): void;
      getCenter(): LatLng;
    }

    interface MapOptions {
      center: LatLngLiteral;
      zoom: number;
      mapTypeControl?: boolean;
      fullscreenControl?: boolean;
      streetViewControl?: boolean;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
      toJSON(): LatLngLiteral;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
      getPosition(): LatLng | null;
      setAnimation(animation: Animation | null): void;
      addListener(event: string, handler: Function): void;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map: Map | null;
      title?: string;
      icon?: string | Icon | Symbol;
      animation?: Animation;
    }

    interface Icon {
      url: string;
      size?: Size;
      scaledSize?: Size;
      origin?: Point;
      anchor?: Point;
    }

    interface Symbol {
      path: SymbolPath | string;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
      scale?: number;
    }

    enum SymbolPath {
      CIRCLE,
      FORWARD_CLOSED_ARROW,
      FORWARD_OPEN_ARROW,
      BACKWARD_CLOSED_ARROW,
      BACKWARD_OPEN_ARROW
    }

    class Size {
      constructor(width: number, height: number);
      width: number;
      height: number;
    }

    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
    }

    enum Animation {
      BOUNCE,
      DROP
    }

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
        constructor(attrContainer: Element | Map);
        nearbySearch(
          request: {
            location: LatLng;
            radius: number;
            keyword?: string;
            type?: string;
          },
          callback: (
            results: PlaceResult[] | null,
            status: PlacesServiceStatus
          ) => void
        ): void;
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

// Add this to ensure window.google is correctly typed
interface Window {
  google: typeof google;
}
