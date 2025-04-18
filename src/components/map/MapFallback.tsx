
import { MapPin, Navigation } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Store } from '@/types/store';

interface MapFallbackProps {
  stores: Store[];
  selectedStoreId?: string;
  userLocation: { latitude: number; longitude: number } | null;
  locationError: string | null;
  onStoreClick: (store: Store) => void;
}

const MapFallback = ({
  stores,
  selectedStoreId,
  userLocation,
  locationError,
  onStoreClick
}: MapFallbackProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-4">
        <div className="animate-bounce mb-4">
          <MapPin className="h-10 w-10 text-primary mx-auto" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Carte interactive</h2>
        <p className="text-muted-foreground mb-4">Chargement de Google Maps en cours...</p>
        
        {locationError && (
          <div className="text-destructive text-sm mb-4">
            {locationError}
          </div>
        )}
        
        <div className="grid gap-3 mt-6">
          <p className="text-sm font-medium">Boutiques à proximité :</p>
          {stores.slice(0, 5).map((store, index) => (
            <Button
              key={store.id}
              variant={store.id === selectedStoreId ? "default" : "outline"}
              className={`justify-start transition-all duration-300 ${
                store.id === selectedStoreId 
                  ? 'border-primary shadow-md scale-105' 
                  : 'hover:bg-secondary/80'
              }`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                opacity: 0,
                animation: 'fade-in 0.5s ease-out forwards'
              }}
              onClick={() => onStoreClick(store)}
            >
              <MapPin className={`h-4 w-4 mr-2 transition-all duration-300 ${
                store.id === selectedStoreId ? 'text-primary' : ''
              }`} />
              <span className="truncate">{store.name}</span>
            </Button>
          ))}
        </div>
        
        {userLocation && (
          <div className="mt-6 animate-fade-in">
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
  );
};

export default MapFallback;
