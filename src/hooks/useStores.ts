
import { useEffect, useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Store } from '@/types/store';
import { StoreDBType } from '@/types/store-types';
import { useToast } from "@/components/ui/use-toast";

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*');

      if (error) throw new Error(error.message);

      // Transform Supabase data to match the Store interface
      const transformedStores: Store[] = (data || []).map((store: StoreDBType) => {
        // Convert string[] to array of objects with day and hours properties
        const formattedOpeningHours = (store.opening_hours || []).map(hourString => {
          // Assume format is "Day: hours" or similar
          const parts = hourString.split(':');
          return {
            day: parts[0] || '',
            hours: parts.length > 1 ? parts.slice(1).join(':').trim() : ''
          };
        });

        return {
          id: store.id,
          name: store.name,
          address: store.address,
          city: store.city,
          postalCode: store.postal_code || '',
          latitude: store.latitude,
          longitude: store.longitude,
          phone: store.phone || '',
          website: store.website || '',
          openingHours: formattedOpeningHours,
          description: store.description || '',
          imageUrl: store.photo_url || '',
          logo_url: store.logo_url || '',
          photo_url: store.photo_url || '',
          rating: 0, // Default value
          reviewCount: 0, // Default value
          placeId: store.google_place_id || '',
          reviews: [], // Data to be implemented later
          products: [], // Data to be implemented later
          incentive: undefined,
          coupon: {
            code: '',
            discount: '',
            validUntil: new Date().toISOString(),
            usageCount: 0,
            isAffiliate: false
          },
          lotteryPrize: undefined,
          isPremium: store.is_premium || false,
          premiumUntil: store.premium_until || undefined,
          isEcommerce: store.is_ecommerce || false,
          ecommerceUrl: store.ecommerce_url || undefined,
          hasGoogleBusinessProfile: store.has_google_profile || false
        };
      });

      console.log(`Nombre total de boutiques avant déduplication: ${transformedStores.length}`);
      
      // Stratégie de déduplication améliorée
      const uniqueStores = removeDuplicateStores(transformedStores);
      
      console.log(`Nombre total de boutiques après déduplication: ${uniqueStores.length}`);
      
      setStores(uniqueStores);
    } catch (err) {
      console.error('Error fetching stores:', err);
      setError(err instanceof Error ? err : new Error('Une erreur est survenue lors du chargement des boutiques'));
      toast({
        title: "Erreur",
        description: "Impossible de charger les boutiques depuis la base de données",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Function de déduplication améliorée avec une stratégie plus stricte
  const removeDuplicateStores = (stores: Store[]): Store[] => {
    if (!stores || stores.length === 0) return [];
    
    const uniqueStoresMap: Record<string, Store> = {};
    const processedIds = new Set<string>();
    const processedPlaceIds = new Set<string>();
    const processedCoordinates = new Set<string>();
    
    // Parcourir toutes les boutiques et les dédupliquer
    stores.forEach(store => {
      // Ne pas traiter deux fois la même boutique
      if (processedIds.has(store.id)) return;
      processedIds.add(store.id);
      
      // Création d'une clé de déduplication basée sur plusieurs critères
      let key: string;
      
      // Critère 1: Google Place ID (priorité la plus élevée)
      if (store.placeId && store.placeId.trim() !== '') {
        key = `place_${store.placeId}`;
        
        // Si on a déjà traité cette boutique via son Place ID, on l'ignore
        if (processedPlaceIds.has(store.placeId)) return;
        processedPlaceIds.add(store.placeId);
      }
      // Critère 2: Coordonnées géographiques (priorité moyenne)
      else if (store.latitude && store.longitude) {
        // Arrondir à 5 décimales pour éviter les petites différences
        const lat = Math.round(store.latitude * 100000) / 100000;
        const lng = Math.round(store.longitude * 100000) / 100000;
        key = `geo_${lat}_${lng}`;
        
        const coordKey = `${lat}_${lng}`;
        if (processedCoordinates.has(coordKey)) return;
        processedCoordinates.add(coordKey);
      }
      // Critère 3: Nom + adresse normalisés (priorité la plus basse)
      else {
        const normalizedName = store.name.toLowerCase().replace(/\s+/g, '');
        const normalizedAddress = store.address.toLowerCase().replace(/\s+/g, '');
        const normalizedCity = store.city.toLowerCase().replace(/\s+/g, '');
        key = `name_${normalizedName}_addr_${normalizedAddress}_${normalizedCity}`;
      }
      
      // Stocker la boutique dans notre map avec la clé générée
      if (!uniqueStoresMap[key] || (store.id.includes('-') && !uniqueStoresMap[key].id.includes('-'))) {
        // On privilégie les boutiques de Supabase (avec UUID) par rapport aux boutiques locales
        uniqueStoresMap[key] = store;
      }
    });
    
    // Convertir notre map en tableau
    return Object.values(uniqueStoresMap);
  };

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const refetch = useCallback(() => {
    fetchStores();
  }, [fetchStores]);

  return { stores, isLoading, error, refetch };
};
