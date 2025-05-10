
import { EcommerceStore } from '@/types/ecommerce';

/**
 * Generate mock e-commerce stores data for fallback when API calls fail
 */
export const generateMockEcommerceStores = (): EcommerceStore[] => {
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
