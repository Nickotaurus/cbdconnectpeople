
import { useState, useEffect } from 'react';
import { Store } from '@/types/store';
import { useToast } from "@/components/ui/use-toast";
import { getStoresByDistance } from '@/utils/data';

export const useMapView = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState({ latitude: 48.8566, longitude: 2.3522 });
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  
  // Filter states
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    minRating: 0,
    maxDistance: null as number | null,
  });

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.log('Geolocation error:', error);
        },
        { maximumAge: 60000, timeout: 5000 }
      );
    }
    
    // Écouter l'événement reset search
    const handleResetSearch = () => setSearchTerm('');
    window.addEventListener('reset-search', handleResetSearch);
    
    // Écouter l'événement reset filters
    const handleResetFilters = () => {
      setSearchTerm('');
      setActiveFilters({
        categories: [],
        minRating: 0,
        maxDistance: null,
      });
    };
    window.addEventListener('reset-filters', handleResetFilters);
    
    return () => {
      window.removeEventListener('reset-search', handleResetSearch);
      window.removeEventListener('reset-filters', handleResetFilters);
    };
  }, []);

  // Functions to handle selection and filters
  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
  };
  
  const handleClearSelection = () => {
    setSelectedStore(null);
  };

  const handleApplyFilters = (filters: {
    categories: string[];
    minRating: number;
    maxDistance: number | null;
  }) => {
    setActiveFilters(filters);
    setSelectedStore(null);
  };
  
  const getLocalStoresCount = () => {
    return getStoresByDistance(userLocation.latitude, userLocation.longitude).length;
  };
  
  const toggleDebugMode = () => {
    setDebugMode(prev => !prev);
    if (!debugMode) {
      toast({
        title: "Mode debug activé",
        description: "Les détails des boutiques sont affichés dans la console",
      });
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    userLocation,
    selectedStore,
    activeFilters,
    debugMode,
    handleSelectStore,
    handleClearSelection,
    handleApplyFilters,
    toggleDebugMode,
    getLocalStoresCount
  };
};
