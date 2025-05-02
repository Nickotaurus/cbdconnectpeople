
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
        placeId: store.google_place_id || '', // Changed from place_id to google_place_id
        reviews: [], // Données à implémenter ultérieurement
        products: [], // Données à implémenter ultérieurement
        // Ajout d'autres champs avec des valeurs par défaut si nécessaires
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

      setStores(transformedStores);
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

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const refetch = useCallback(() => {
    fetchStores();
  }, [fetchStores]);

  return { stores, isLoading, error, refetch };
};
