
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Store } from '@/types/store';

interface MapFallbackProps {
  stores: Store[];
  selectedStoreId?: string;
  userLocation: { latitude: number; longitude: number } | null;
  locationError: string | null;
  mapLoadError: string | null;
  isRefererError?: boolean;
  onStoreClick: (store: Store) => void;
  domain?: string;
  showAlternativeUI?: boolean;
}

const MapFallback = ({
  stores,
  selectedStoreId,
  userLocation,
  locationError,
  mapLoadError,
  isRefererError = false,
  onStoreClick,
  domain = window.location.origin,
  showAlternativeUI = false
}: MapFallbackProps) => {
  // Check if there's a map error (from props or by detecting error in DOM)
  const isMapError = mapLoadError || isRefererError || 
                     (typeof window !== 'undefined' && 
                      document.querySelector('.gm-err-message')?.textContent?.includes('RefererNotAllowed'));

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/95 rounded-lg border border-muted">
      <div className="text-center max-w-lg mx-auto px-4">
        {isMapError ? (
          <div className="space-y-4 animate-fade-in">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold mb-2">Erreur de chargement</h2>
            <p className="text-muted-foreground mb-4">{mapLoadError}</p>
            
            {isRefererError && (
              <div className="bg-muted p-4 rounded-md text-sm text-left mb-4">
                <p className="font-medium mb-2">Erreur technique: RefererNotAllowedMapError</p>
                <p className="mb-1">Le domaine actuel n'est pas autorisé à utiliser cette clé API Google Maps.</p>
                <p className="font-mono text-xs mt-2 break-all">URL actuelle: {domain}</p>
                <p className="mt-3 text-xs">
                  <strong>Solution :</strong> Dans Google Cloud Console → API & Services → Credentials, 
                  trouvez votre clé API et ajoutez ce domaine dans la liste des referrers autorisés.
                </p>
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Recharger la page
            </Button>
            
            {isRefererError && (
              <p className="text-xs text-muted-foreground mt-2">
                Cette erreur doit être résolue par l'administrateur du site en ajoutant ce domaine 
                dans les paramètres de la clé API Google Maps.
              </p>
            )}
          </div>
        ) : showAlternativeUI ? (
          <div className="space-y-4 animate-fade-in">
            <MapPin className="h-10 w-10 text-sage-500 mx-auto" />
            <h2 className="text-xl font-semibold mb-2">Recherche de boutiques</h2>
            <p className="text-muted-foreground mb-4">
              L'API Google Maps n'est pas disponible, mais vous pouvez toujours rechercher des boutiques manuellement.
            </p>
          </div>
        ) : (
          <>
            <div className="animate-bounce mb-4">
              <MapPin className="h-10 w-10 text-sage-500 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Carte interactive</h2>
            <p className="text-muted-foreground mb-4">Chargement de Google Maps en cours...</p>
            
            {locationError && (
              <div className="text-destructive text-sm mb-4">
                {locationError}
              </div>
            )}
          </>
        )}
        
        <div className="grid gap-3 mt-6">
          <p className="text-sm font-medium">Boutiques à proximité :</p>
          {stores.slice(0, 5).map((store, index) => (
            <Button
              key={store.id}
              variant={store.id === selectedStoreId ? "default" : "outline"}
              className={`justify-start transition-all duration-300 ${
                store.id === selectedStoreId 
                  ? 'border-sage-600 shadow-md scale-105' 
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
                store.id === selectedStoreId ? 'text-sage-400' : ''
              }`} />
              <span className="truncate">{store.name}</span>
            </Button>
          ))}
        </div>
        
        {userLocation && (
          <div className="mt-6 animate-fade-in">
            <p className="text-xs mb-2">Votre position :</p>
            <div className="bg-background/50 backdrop-blur-sm p-2 rounded-md flex items-center justify-center text-xs">
              <Navigation className="h-3.5 w-3.5 mr-1.5 text-sage-500" />
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
