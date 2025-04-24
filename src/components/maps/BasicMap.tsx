
import { useEffect, useRef } from 'react';
import { useGoogleMapsScript } from '@/hooks/maps/useGoogleMapsScript';
import { useToast } from "@/components/ui/use-toast";

interface BasicMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

const BasicMap = ({ 
  center = { lat: 48.8566, lng: 2.3522 }, // Paris by default
  zoom = 12,
  className = "w-full h-[400px] rounded-lg"
}: BasicMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const { apiKeyLoaded } = useGoogleMapsScript();
  const { toast } = useToast();

  useEffect(() => {
    if (!apiKeyLoaded || !mapRef.current || mapInstanceRef.current) {
      return;
    }

    try {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false
      });
      
      console.log("Map initialized successfully");
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser la carte Google Maps",
        variant: "destructive"
      });
    }

    return () => {
      mapInstanceRef.current = null;
    };
  }, [apiKeyLoaded, center, zoom, toast]);

  return (
    <div 
      ref={mapRef} 
      className={className}
      aria-label="Carte Google Maps"
    />
  );
};

export default BasicMap;
