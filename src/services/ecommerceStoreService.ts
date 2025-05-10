
import { supabase } from '@/integrations/supabase/client';
import { EcommerceStore } from '@/types/ecommerce';
import { loadGoogleMapsAPI } from '@/services/googleMapsService';
import { generateMockEcommerceStores } from '@/utils/mockEcommerceData';

/**
 * Fetch e-commerce stores from Supabase
 */
export const fetchEcommerceStoreData = async (): Promise<EcommerceStore[]> => {
  try {
    await loadGoogleMapsAPI();
    console.log("Google Maps API loaded in ecommerceStoreService");
    
    // 1. Récupérer les boutiques qui ont isEcommerce=true
    const { data: ecommerceStores, error: ecommerceError } = await supabase
      .from('stores')
      .select('*')
      .eq('is_ecommerce', true);
      
    if (ecommerceError) {
      throw ecommerceError;
    }

    // 2. Récupérer les utilisateurs avec le rôle 'store' et storeType=ecommerce ou both
    const { data: ecommerceUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'store')
      .in('store_type', ['ecommerce', 'both']);
    
    if (usersError) {
      throw usersError;
    }
    
    // Transformer les données en format EcommerceStore
    const transformedStores: EcommerceStore[] = [
      ...(ecommerceStores || []).map(store => ({
        id: store.id,
        name: store.name,
        url: store.ecommerce_url || store.website || '',
        description: store.description || 'Boutique en ligne proposant des produits CBD.',
        logo: store.logo_url || 'https://via.placeholder.com/150',
        specialties: ['Huiles', 'Fleurs', 'Cosmétiques'].sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 3)),
        rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        reviewCount: Math.floor(Math.random() * 1000) + 50,
        isPremium: !!store.is_premium,
        paymentMethods: ['Carte bancaire', 'PayPal'].sort(() => Math.random() - 0.5),
        shippingCountries: ['France', 'Europe', 'Monde entier'].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 2)),
        userId: store.user_id,
        isPhysicalStore: true,
        googlePlaceId: store.google_place_id // Google Place ID pour récupérer les avis
      })),
      ...(ecommerceUsers || []).filter(user => !ecommerceStores?.some(store => store.user_id === user.id)).map(user => ({
        id: `ec-${user.id}`,
        name: user.name || 'Boutique CBD',
        url: user.partner_favorites?.[0] || 'https://example.com',
        description: user.partner_favorites?.[1] || 'E-commerce CBD proposant une sélection de produits de qualité.',
        logo: user.logo_url || 'https://via.placeholder.com/150',
        specialties: ['Huiles', 'Fleurs', 'Cosmétiques', 'Alimentaire', 'Bien-être'].sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 3)),
        rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        reviewCount: Math.floor(Math.random() * 1000) + 50,
        isPremium: false,
        paymentMethods: ['Carte bancaire', 'PayPal', 'Virement', 'Crypto-monnaies'].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 3)),
        shippingCountries: ['France', 'Belgique', 'Suisse', 'Europe', 'Monde entier'].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 3)),
        userId: user.id,
        isPhysicalStore: false
      }))
    ];
    
    console.log("Ecommerce stores loaded:", transformedStores.length, "stores");
    console.log("Stores with googlePlaceId:", transformedStores.filter(store => !!store.googlePlaceId).length);
    
    return transformedStores;
  } catch (error) {
    console.error('Error fetching e-commerce stores:', error);
    throw error;
  }
};

/**
 * Get e-commerce stores with fallback to mock data
 */
export const getEcommerceStores = async (): Promise<EcommerceStore[]> => {
  try {
    return await fetchEcommerceStoreData();
  } catch (error) {
    console.error('Using mock data due to error:', error);
    return generateMockEcommerceStores();
  }
};
