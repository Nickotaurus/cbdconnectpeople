
import { useRef, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const usePlacesService = () => {
  const { toast } = useToast();
  const serviceDivRef = useRef<HTMLDivElement | null>(null);

  const getPlaceDetails = async (placeId: string, onSuccess: (place: google.maps.places.PlaceResult) => void) => {
    if (!window.google?.maps?.places) {
      toast({
        title: "API Google indisponible",
        description: "Impossible de charger l'API Google Maps. Veuillez rafraîchir la page.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (!serviceDivRef.current) {
        serviceDivRef.current = document.createElement('div');
        serviceDivRef.current.style.width = '1px';
        serviceDivRef.current.style.height = '1px';
        serviceDivRef.current.style.position = 'absolute';
        serviceDivRef.current.style.visibility = 'hidden';
        document.body.appendChild(serviceDivRef.current);
      }

      const service = new google.maps.places.PlacesService(serviceDivRef.current);

      service.getDetails({
        placeId,
        fields: ['name', 'formatted_address', 'place_id', 'geometry', 'website', 'formatted_phone_number', 'opening_hours', 'photos']
      }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          onSuccess(place);
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de récupérer les détails de l'établissement.",
            variant: "destructive"
          });
        }
      });
    } catch (error) {
      console.error("Error getting place details:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération des détails.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    return () => {
      if (serviceDivRef.current && serviceDivRef.current.parentNode) {
        serviceDivRef.current.parentNode.removeChild(serviceDivRef.current);
      }
    };
  }, []);

  return { getPlaceDetails };
};
