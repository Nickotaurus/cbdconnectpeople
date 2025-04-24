
// Type definitions for Google Maps JavaScript API
declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options: MapOptions);
      panTo(latLng: LatLng): void;
      setCenter(latLng: LatLngLiteral): void;
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

    class InfoWindow {
      constructor(options?: InfoWindowOptions);
      open(map?: Map, anchor?: Marker): void;
      close(): void;
      setContent(content: string | Node): void;
      getContent(): string | Node;
    }

    interface InfoWindowOptions {
      content?: string | Node;
      disableAutoPan?: boolean;
      maxWidth?: number;
      pixelOffset?: Size;
      position?: LatLng | LatLngLiteral;
      zIndex?: number;
      ariaLabel?: string;
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
        formatted_phone_number?: string;
        website?: string;
        geometry?: {
          location: LatLng;
        };
        name?: string;
        rating?: number;
        user_ratings_total?: number;
        vicinity?: string;
        photos?: PlacePhoto[];
        types?: string[];
      }

      interface PlacePhoto {
        getUrl: (options?: PhotoOptions) => string;
        height: number;
        width: number;
        html_attributions: string[];
      }

      interface PhotoOptions {
        maxWidth?: number;
        maxHeight?: number;
      }

      interface PlaceDetailsRequest {
        placeId: string;
        fields?: string[];
      }

      enum PlacesServiceStatus {
        OK,
        ZERO_RESULTS,
        OVER_QUERY_LIMIT,
        REQUEST_DENIED,
        INVALID_REQUEST,
        UNKNOWN_ERROR
      }

      interface PlaceSearchRequest {
        location: LatLng | LatLngLiteral;
        radius: number;
        keyword?: string;
        type?: string;
      }

      interface TextSearchRequest {
        query: string;
        location?: LatLng | LatLngLiteral;
        radius?: number;
        // Note: TextSearchRequest doesn't support 'fields' property
      }

      class PlacesService {
        constructor(attrContainer: Element | Map);
        nearbySearch(
          request: PlaceSearchRequest,
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
        getDetails(
          request: PlaceDetailsRequest,
          callback: (
            result: PlaceResult | null,
            status: PlacesServiceStatus
          ) => void
        ): void;
        textSearch(
          request: TextSearchRequest,
          callback: (
            results: PlaceResult[] | null,
            status: PlacesServiceStatus
          ) => void
        ): void;
      }
    }
  }
}

interface Window {
  google: typeof google;
  selectStore?: (placeId: string) => void;
}
