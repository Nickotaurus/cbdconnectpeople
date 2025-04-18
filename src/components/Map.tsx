
import { useEffect, useState, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Store } from '@/types/store';
import { filterUserLocation } from '@/utils/geoUtils';

interface MapProps {
  stores: Store[];
  onSelectStore?: (store: Store) => void;
  selectedStoreId?: string;
}

const Map = ({ stores, onSelectStore, selectedStoreId }: MapProps) => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  
  // Vérifier si Google Maps est chargé
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps) {
        setIsGoogleMapsLoaded(true);
      } else {
        // Réessayer après un court délai
        setTimeout(checkGoogleMapsLoaded, 500);
      }
    };
    
    checkGoogleMapsLoaded();
  }, []);
  
  // Obtenir la position de l'utilisateur
  useEffect(() => {
    // Définir un emplacement par défaut au cas où
    const defaultLocation = filterUserLocation();
    
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
          // Fallback to default coordinates
          setUserLocation(defaultLocation);
        },
        { 
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError("La géolocalisation n'est pas supportée par votre navigateur.");
      // Fallback to default coordinates
      setUserLocation(defaultLocation);
    }
  }, []);

  // Initialiser la carte Google Maps si l'API est chargée et la location de l'utilisateur est disponible
  useEffect(() => {
    if (!isGoogleMapsLoaded || !userLocation || !mapContainerRef.current) return;
    
    try {
      // Créer la carte
      const mapOptions = {
        center: { lat: userLocation.latitude, lng: userLocation.longitude },
        zoom: 13,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false
      };
      
      mapInstance.current = new window.google.maps.Map(mapContainerRef.current, mapOptions);
      
      // Ajouter un marqueur pour la position de l'utilisateur
      new window.google.maps.Marker({
        position: { lat: userLocation.latitude, lng: userLocation.longitude },
        map: mapInstance.current,
        title: "Votre position",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: "#4F46E5",
          fillOpacity: 1,
          strokeColor: "#312E81",
          strokeWeight: 2,
          scale: 8
        }
      });
      
      // Ajouter les marqueurs pour les boutiques
      stores.forEach(store => {
        const marker = new window.google.maps.Marker({
          position: { lat: store.latitude, lng: store.longitude },
          map: mapInstance.current,
          title: store.name,
          animation: store.id === selectedStoreId 
            ? window.google.maps.Animation.BOUNCE 
            : window.google.maps.Animation.DROP
        });
        
        marker.addListener('click', () => {
          if (onSelectStore) {
            onSelectStore(store);
          }
        });
        
        markers.current.push(marker);
      });
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte Google Maps:", error);
    }
    
    return () => {
      // Nettoyer les marqueurs lors du démontage du composant
      markers.current.forEach(marker => marker.setMap(null));
      markers.current = [];
    };
  }, [isGoogleMapsLoaded, userLocation, stores, selectedStoreId, onSelectStore]);
  
  // Mettre à jour le marqueur sélectionné
  useEffect(() => {
    if (!isGoogleMapsLoaded || !mapInstance.current) return;
    
    markers.current.forEach(marker => {
      const storeIndex = stores.findIndex(store => 
        store.latitude === marker.getPosition()?.lat() && 
        store.longitude === marker.getPosition()?.lng()
      );
      
      if (storeIndex !== -1) {
        const isSelected = stores[storeIndex].id === selectedStoreId;
        
        marker.setAnimation(isSelected ? window.google.maps.Animation.BOUNCE : null);
        
        if (isSelected && mapInstance.current) {
          mapInstance.current.panTo(marker.getPosition()!);
        }
      }
    });
  }, [selectedStoreId, stores, isGoogleMapsLoaded]);

  const handleStoreClick = (store: Store) => {
    if (onSelectStore) {
      onSelectStore(store);
    }
  };

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] bg-secondary rounded-lg overflow-hidden">
      {/* La carte réelle sera rendue ici si Google Maps est chargé */}
      {isGoogleMapsLoaded && userLocation && (
        <div ref={mapContainerRef} className="absolute inset-0 z-10" />
      )}
      
      {/* Interface de secours au cas où Google Maps ne se charge pas */}
      {(!isGoogleMapsLoaded || !userLocation) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-lg mx-auto px-4">
            <div className="animate-bounce mb-4">
              <MapPin className="h-10 w-10 text-primary mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Carte interactive</h2>
            <p className="text-muted-foreground mb-4">
              {!isGoogleMapsLoaded 
                ? "Chargement de Google Maps en cours..." 
                : "Localisation en cours..."}
            </p>
            
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
                  onClick={() => handleStoreClick(store)}
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
      )}
    </div>
  );
};

export default Map;
