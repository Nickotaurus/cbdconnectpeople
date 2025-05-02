
import { useEffect, useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Store } from '@/types/store';
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
        .select('*')
        .eq('is_verified', true);

      if (error) throw new Error(error.message);

      // Transformer les données de Supabase pour correspondre à l'interface Store
      const transformedStores: Store[] = (data || []).map(store => ({
        id: store.id,
        name: store.name,
        address: store.address,
        city: store.city,
        postalCode: store.postal_code || '',
        latitude: store.latitude,
        longitude: store.longitude,
        phone: store.phone || '',
        website: store.website || '',
        openingHours: [], // Données à implémenter ultérieurement
        description: store.description || '',
        imageUrl: store.photo_url || '',
        logo_url: store.logo_url || '',
        photo_url: store.photo_url || '',
        rating: 0, // Valeur par défaut
        reviewCount: 0, // Valeur par défaut
        placeId: store.google_place_id || '', 
        reviews: [], // Données à implémenter ultérieurement
        products: [], // Données à implémenter ultérieurement
        incentive: undefined,
        coupon: {
          code: '',
          discount: '',
          validUntil: new Date().toISOString(),
          usageCount: 0,
          isAffiliate: false
        },
        lotteryPrize: undefined,
        isPremium: false,
        premiumUntil: undefined,
        isEcommerce: false,
        ecommerceUrl: undefined
      }));

      console.log(`Nombre total de boutiques avant déduplication: ${transformedStores.length}`);
      
      // Supprimer tous les doublons, avec traitement spécial pour "CBD Histoire de Chanvre"
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

  // Fonction améliorée pour éliminer les doublons, spécialement pour "CBD Histoire de Chanvre"
  const removeDuplicateStores = (stores: Store[]): Store[] => {
    // Use a regular object to store unique stores
    const uniqueStoresMap: Record<string, Store> = {};
    let cbdHistoireDeChanvreSeen = false;
    
    // Première passe: traiter CBD Histoire de Chanvre de façon spéciale
    stores.forEach(store => {
      if (store.name.toLowerCase().includes("cbd histoire de chanvre")) {
        // Si c'est la première fois qu'on trouve cette boutique, ou si celle-ci a un placeId (plus fiable)
        if (!cbdHistoireDeChanvreSeen || store.placeId) {
          uniqueStoresMap["cbd_histoire_de_chanvre_special_key"] = store;
          cbdHistoireDeChanvreSeen = true;
        }
      } else {
        // Pour les autres boutiques, utiliser une clé de déduplication standard
        const key = generateUniqueStoreKey(store);
        uniqueStoresMap[key] = store;
      }
    });
    
    console.log(`Après déduplication: ${Object.keys(uniqueStoresMap).length} boutiques uniques`);
    return Object.values(uniqueStoresMap);
  };
  
  // Fonction pour générer une clé unique pour chaque boutique
  const generateUniqueStoreKey = (store: Store): string => {
    if (store.placeId) {
      return `place_${store.placeId}`;
    }
    
    if (store.latitude && store.longitude) {
      // Arrondir à 5 décimales pour éviter les petites différences
      const lat = Math.round(store.latitude * 100000) / 100000;
      const lng = Math.round(store.longitude * 100000) / 100000;
      return `geo_${lat}_${lng}`;
    }
    
    // Dernière option: utiliser l'adresse et le nom normalisés
    return `addr_${store.address.toLowerCase().replace(/\s+/g, '')}_${store.city.toLowerCase().replace(/\s+/g, '')}_${store.name.toLowerCase().replace(/\s+/g, '')}`;
  };

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const refetch = useCallback(() => {
    fetchStores();
  }, [fetchStores]);

  return { stores, isLoading, error, refetch };
};
