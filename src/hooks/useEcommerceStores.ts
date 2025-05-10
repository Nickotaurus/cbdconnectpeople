
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { ClientUser } from '@/types/auth';
import { EcommerceStore } from '@/types/ecommerce';
import { supabase } from '@/integrations/supabase/client';
import { loadGoogleMapsAPI } from '@/services/googleMapsService';

export const useEcommerceStores = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const clientUser = user as ClientUser;
  const [isLoading, setIsLoading] = useState(true);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [stores, setStores] = useState<EcommerceStore[]>([]);
  const [filteredStores, setFilteredStores] = useState<EcommerceStore[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState<string | null>(null);
  const [favoriteEcommerces, setFavoriteEcommerces] = useState<string[]>([]);

  // Essayer de charger l'API Google Maps dès le début
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        await loadGoogleMapsAPI();
        setIsGoogleMapsLoaded(true);
        console.log("Google Maps API loaded in useEcommerceStores");
      } catch (error) {
        console.error("Failed to load Google Maps API:", error);
      }
    };
    
    loadGoogleMaps();
  }, []);

  useEffect(() => {
    fetchEcommerceStores();
    
    if (user?.role === 'client' && clientUser?.favorites) {
      setFavoriteEcommerces(clientUser.favorites.filter(id => id.startsWith('ec')));
    }
  }, [user, isGoogleMapsLoaded]);

  const fetchEcommerceStores = async () => {
    setIsLoading(true);
    try {
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
      
      setStores(transformedStores);
      setFilteredStores(transformedStores);
    } catch (error) {
      console.error('Erreur lors de la récupération des e-commerces:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les e-commerces CBD.",
        variant: "destructive",
      });
      
      // Utiliser des données fictives en cas d'erreur
      const mockStores = generateMockEcommerceStores();
      setStores(mockStores);
      setFilteredStores(mockStores);
    } finally {
      setIsLoading(false);
    }
  };

  // Générer des données de test
  const generateMockEcommerceStores = (): EcommerceStore[] => {
    return [
      {
        id: "ec1",
        name: "CBD Shop France",
        url: "https://cbdshopfrance.fr",
        description: "Large sélection de produits CBD de qualité. Livraison rapide et service client réactif.",
        logo: "https://images.unsplash.com/photo-1589244159943-460088ed5c83?q=80&w=1000",
        specialties: ["Huiles", "Fleurs", "Cosmétiques", "Alimentaire"],
        rating: 4.8,
        reviewCount: 1245,
        isPremium: true,
        paymentMethods: ["Carte bancaire", "PayPal", "Virement"],
        shippingCountries: ["France", "Belgique", "Suisse", "Luxembourg"]
      },
      {
        id: "ec2",
        name: "Green Life CBD",
        url: "https://greenlifecbd.com",
        description: "Produits biologiques et certifiés. Expertise et conseils personnalisés pour chaque client.",
        logo: "https://images.unsplash.com/photo-1571166052181-bdb4647b7d3f?q=80&w=1000",
        specialties: ["Huiles", "Gélules", "Tisanes"],
        rating: 4.6,
        reviewCount: 876,
        isPremium: true,
        paymentMethods: ["Carte bancaire", "PayPal"],
        shippingCountries: ["France", "Europe"]
      },
      {
        id: "ec3",
        name: "CBD Factory",
        url: "https://cbdfactory.fr",
        description: "Vente en gros et au détail. Production française et contrôles qualité rigoureux.",
        logo: "https://images.unsplash.com/photo-1603902840053-424a302f692d?q=80&w=1000",
        specialties: ["Fleurs", "Résines", "Extraits", "Wholesale"],
        rating: 4.4,
        reviewCount: 532,
        isPremium: false,
        paymentMethods: ["Carte bancaire", "Virement", "Espèces à la livraison"],
        shippingCountries: ["France"]
      },
      {
        id: "ec4",
        name: "Premium CBD",
        url: "https://premiumcbd.fr",
        description: "Produits haut de gamme sélectionnés avec soin. Focus sur la qualité et la satisfaction client.",
        logo: "https://images.unsplash.com/photo-1615233500558-c4f518b983ae?q=80&w=1000",
        specialties: ["Huiles premium", "Cosmétiques", "Produits bien-être"],
        rating: 4.9,
        reviewCount: 321,
        isPremium: true,
        paymentMethods: ["Carte bancaire", "PayPal", "Crypto-monnaies"],
        shippingCountries: ["Monde entier"]
      },
      {
        id: "ec5",
        name: "CBDirect",
        url: "https://cbdirect.com",
        description: "Prix compétitifs et livraison express. Large catalogue constamment mis à jour.",
        logo: "https://images.unsplash.com/photo-1580397581145-cdb6a35b7d3f?q=80&w=1000",
        specialties: ["Fleurs", "Huiles", "E-liquides", "Accessoires"],
        rating: 4.3,
        reviewCount: 789,
        isPremium: false,
        paymentMethods: ["Carte bancaire", "PayPal"],
        shippingCountries: ["France", "Belgique"]
      }
    ];
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterStores(term, filterSpecialty);
  };
  
  const handleSpecialtyFilter = (specialty: string | null) => {
    setFilterSpecialty(specialty);
    filterStores(searchTerm, specialty);
  };
  
  const filterStores = (term: string, specialty: string | null) => {
    let result = [...stores];
    
    if (term.trim()) {
      const lowerTerm = term.toLowerCase();
      result = result.filter(
        store => 
          store.name.toLowerCase().includes(lowerTerm) || 
          store.description.toLowerCase().includes(lowerTerm)
      );
    }
    
    if (specialty) {
      result = result.filter(store => 
        store.specialties.some(s => s.toLowerCase() === specialty.toLowerCase())
      );
    }
    
    setFilteredStores(result);
  };

  // Extraire toutes les spécialités uniques
  const allSpecialties = Array.from(
    new Set(stores.flatMap(store => store.specialties))
  ).sort();

  return {
    stores,
    filteredStores,
    isLoading,
    searchTerm,
    filterSpecialty,
    favoriteEcommerces,
    setFavoriteEcommerces,
    handleSearch,
    handleSpecialtyFilter,
    allSpecialties: Array.from(
      new Set(stores.flatMap(store => store.specialties))
    ).sort()
  };
};
