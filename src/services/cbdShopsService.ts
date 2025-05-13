
import { supabase } from '@/integrations/supabase/client';
import { Store } from '@/types/store';

export interface CBDShop {
  id: number;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  source?: string;
}

/**
 * Récupère les boutiques CBD depuis la table cbd_shops
 */
export const fetchCBDShops = async (): Promise<Store[]> => {
  const { data, error } = await supabase
    .from('cbd_shops')
    .select('*');
  
  if (error) {
    console.error('Erreur lors de la récupération des boutiques CBD:', error);
    return [];
  }

  // Convertir les données de cbd_shops au format Store
  return (data || []).map((shop: CBDShop) => ({
    id: `cbd-${shop.id}`, // Préfixe pour identifier la source
    name: shop.name,
    address: shop.address || '',
    city: shop.city || '',
    postalCode: '', // Non disponible dans les données sources
    latitude: shop.lat,
    longitude: shop.lng,
    phone: '',
    openingHours: [],
    reviews: [],
    rating: 0,
    reviewCount: 0,
    isPremium: false,
    isEcommerce: false,
    // Ajout d'un identifiant pour savoir que cette boutique vient de cbd_shops
    sourceTable: 'cbd_shops',
    sourceId: shop.id.toString()
  }));
};
