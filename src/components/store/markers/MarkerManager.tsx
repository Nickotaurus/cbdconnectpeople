
import React, { useRef, useState } from 'react';
import { ToastAction } from "@/components/ui/toast";
import StoreInfoWindow from '../StoreInfoWindow';

// Define MarkerManagerProps interface
interface MarkerManagerProps {
  map: google.maps.Map;
  userLocation: google.maps.LatLngLiteral;
  onStoreSelect: (store: google.maps.places.PlaceResult) => void;
  toast: any; // Using any for simplicity, but ideally should use the correct toast type
}

// Global object to track service divs and avoid duplicates
const serviceBoxRegistry = {
  mainDiv: null as HTMLDivElement | null,
  getDiv: (): HTMLDivElement => {
    if (!serviceBoxRegistry.mainDiv) {
      serviceBoxRegistry.mainDiv = document.createElement('div');
      serviceBoxRegistry.mainDiv.id = 'global-places-service-div';
      serviceBoxRegistry.mainDiv.style.width = '1px';
      serviceBoxRegistry.mainDiv.style.height = '1px';
      serviceBoxRegistry.mainDiv.style.position = 'absolute';
      serviceBoxRegistry.mainDiv.style.visibility = 'hidden';
      document.body.appendChild(serviceBoxRegistry.mainDiv);
    }
    return serviceBoxRegistry.mainDiv;
  },
  getService: (): google.maps.places.PlacesService => {
    const div = serviceBoxRegistry.getDiv();
    return new google.maps.places.PlacesService(div);
  }
};

const MarkerManager = ({ map, userLocation, onStoreSelect, toast }: MarkerManagerProps) => {
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const activeInfoWindow = useRef<google.maps.InfoWindow | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  // Render info window content function
  const renderInfoWindowContent = (
    place: google.maps.places.PlaceResult, 
    onSelect: () => void
  ) => {
    return StoreInfoWindow({ place, onSelect });
  };

  const addMarker = (
    place: google.maps.places.PlaceResult,
    service: google.maps.places.PlacesService
  ) => {
    if (!place.geometry?.location) {
      console.error("Place has no location:", place);
      return;
    }
    
    try {
      // Check if marker already exists
      const exists = markersRef.current.some(marker => 
        marker.position?.lat() === place.geometry?.location.lat() && 
        marker.position?.lng() === place.geometry?.location.lng()
      );
      
      if (exists) {
        console.log("Marker already exists for this location");
        return;
      }
      
      console.log("Adding marker for:", place.name, place);
      
      // Check if the place name contains CBD-related terms to customize marker
      const lowerName = (place.name || '').toLowerCase();
      const isCBDStore = lowerName.includes('cbd') || 
                        lowerName.includes('chanvre') || 
                        lowerName.includes('cannabis');
      
      // Create a custom pin element for the marker
      const pinElement = new google.maps.marker.PinElement({
        background: isCBDStore ? '#4F46E5' : '#F59E0B',
        borderColor: isCBDStore ? '#312E81' : '#D97706',
        glyphColor: '#FFFFFF',
        scale: 1
      });
      
      // Create the advanced marker
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: place.geometry.location,
        map,
        title: place.name,
        content: pinElement.element
      });

      // Add click listener to show info window
      marker.addListener('click', () => {
        if (activeInfoWindow.current) {
          activeInfoWindow.current.close();
        }

        if (!place.place_id) {
          console.error("Place has no place_id:", place);
          return;
        }
        
        // Use the registry's service to avoid duplication
        const detailsService = serviceBoxRegistry.getService();

        detailsService.getDetails(
          { 
            placeId: place.place_id, 
            fields: ['name', 'formatted_address', 'rating', 'website', 'photos', 'user_ratings_total', 'geometry', 'types', 'vicinity'] 
          },
          (placeDetails, detailStatus) => {
            if (detailStatus === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
              const infoWindow = new google.maps.InfoWindow({
                content: renderInfoWindowContent(placeDetails, () => onStoreSelect(placeDetails)),
                ariaLabel: placeDetails.name,
              });

              // Define global selection function
              window.selectStore = (placeId: string) => {
                console.log(`Sélection du magasin: ${placeId}`);
                if (placeId === placeDetails.place_id) {
                  console.log("Boutique sélectionnée:", placeDetails.name);
                  onStoreSelect(placeDetails);
                  // Close info window after selection
                  infoWindow.close();
                  // Success notification
                  toast({
                    title: "Boutique sélectionnée",
                    description: `Vous avez sélectionné: ${placeDetails.name}`,
                  });
                }
              };

              infoWindow.open(map, marker as unknown as google.maps.Marker);
              activeInfoWindow.current = infoWindow;
            } else {
              console.error("Error fetching place details:", detailStatus);
            }
          }
        );
      });

      markersRef.current.push(marker);
    } catch (error) {
      console.error("Error adding marker:", error);
    }
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      marker.map = null;
    });
    markersRef.current = [];
  };
  
  const cleanupServiceDiv = () => {
    // We don't remove the global service div, as it may be used by other components
    // Instead we just make sure our references are cleared
    activeInfoWindow.current = null;
  };

  return { 
    addMarker, 
    clearMarkers, 
    isSearching, 
    setIsSearching, 
    hasResults, 
    setHasResults,
    cleanupServiceDiv 
  };
};

export default MarkerManager;
