
import { useEffect, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Store, filterUserLocation } from '@/utils/data';

interface MapProps {
  stores: Store[];
  onSelectStore?: (store: Store) => void;
  selectedStoreId?: string;
}

const Map = ({ stores, onSelectStore, selectedStoreId }: MapProps) => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real application, this would integrate with a map provider like Google Maps or Mapbox
    // For now, we'll display a placeholder with basic functionality
    
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Impossible d'accéder à votre position. Veuillez autoriser l'accès à la géolocalisation.");
          // Fallback to Paris coordinates
          setUserLocation(filterUserLocation());
        }
      );
    } else {
      setLocationError("La géolocalisation n'est pas supportée par votre navigateur.");
      // Fallback to Paris coordinates
      setUserLocation(filterUserLocation());
    }
  }, []);

  const handleStoreClick = (store: Store) => {
    if (onSelectStore) {
      onSelectStore(store);
    }
  };

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] bg-secondary rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="animate-bounce mb-4">
            <MapPin className="h-10 w-10 text-primary mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Carte interactive</h2>
          <p className="text-muted-foreground mb-4">
            Dans la version finale, cette section affichera une carte interactive 
            avec toutes les boutiques CBD à proximité. Actuellement, c'est une 
            version simulée pour la démonstration.
          </p>
          
          {locationError && (
            <div className="text-destructive text-sm mb-4">
              {locationError}
            </div>
          )}
          
          <div className="grid gap-3 mt-6">
            <p className="text-sm font-medium">Boutiques à proximité :</p>
            {stores.slice(0, 5).map((store) => (
              <Button
                key={store.id}
                variant={store.id === selectedStoreId ? "default" : "outline"}
                className={`justify-start ${store.id === selectedStoreId ? 'border-primary' : ''}`}
                onClick={() => handleStoreClick(store)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                <span className="truncate">{store.name}</span>
              </Button>
            ))}
          </div>
          
          {userLocation && (
            <div className="mt-6">
              <p className="text-sm mb-2">Votre position :</p>
              <div className="bg-background/50 backdrop-blur-sm p-2 rounded-md flex items-center justify-center text-xs">
                <Navigation className="h-3.5 w-3.5 mr-1.5 text-primary" />
                <span>
                  {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;
