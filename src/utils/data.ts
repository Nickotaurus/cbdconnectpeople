export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  website: string;
  openingHours: {
    day: string;
    hours: string;
  }[];
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  coupon: {
    code: string;
    discount: string;
    validUntil: string;
    usageCount?: number;
    isAffiliate?: boolean;
  };
  isPremium?: boolean;
  premiumUntil?: string;
  reviews: {
    id: string;
    author: string;
    date: string;
    rating: number;
    text: string;
    category: "flowers" | "oils" | "experience" | "originality";
  }[];
  products: {
    category: string;
    origin: string;
    quality: string;
  }[];
}

export const subscriptionPlans = [
  {
    id: "basic",
    name: "Basique",
    price: 0,
    features: [
      "Fiche boutique simple",
      "Présence sur la carte",
      "1 coupon de réduction",
    ],
    isPopular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 29.99,
    features: [
      "Mise en avant prioritaire",
      "Fiche boutique enrichie",
      "Photos et vidéos illimitées",
      "Statistiques de visite",
      "Coupons illimités",
      "Support prioritaire",
    ],
    isPopular: true,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: 49.99,
    features: [
      "Tous les avantages Premium",
      "Bannière publicitaire",
      "Badge \"Vérifié\"",
      "Accès aux données du marché",
      "Formations exclusives",
      "Assistance 7j/7",
    ],
    isPopular: false,
  },
];

export const stores: Store[] = [
  {
    id: "1",
    name: "CBD Paris Marais",
    address: "23 Rue des Rosiers",
    city: "Paris",
    postalCode: "75004",
    latitude: 48.8566,
    longitude: 2.3522,
    phone: "01 42 72 21 49",
    website: "https://cbd-paris-marais.fr",
    openingHours: [
      { day: "Lundi", hours: "11:00 - 19:00" },
      { day: "Mardi", hours: "11:00 - 19:00" },
      { day: "Mercredi", hours: "11:00 - 19:00" },
      { day: "Jeudi", hours: "11:00 - 19:00" },
      { day: "Vendredi", hours: "11:00 - 20:00" },
      { day: "Samedi", hours: "10:00 - 20:00" },
      { day: "Dimanche", hours: "12:00 - 18:00" },
    ],
    description: "Boutique spécialisée dans les produits CBD de qualité premium, située au cœur du Marais à Paris. Notre équipe vous accueille dans un espace design et chaleureux pour vous conseiller sur notre large gamme de produits CBD.",
    imageUrl: "https://images.unsplash.com/photo-1603726623530-8a99ef1f1d93?q=80&w=1000",
    rating: 4.7,
    reviewCount: 124,
    coupon: {
      code: "CBDMARAIS15",
      discount: "15% sur votre première commande",
      validUntil: "31/12/2024",
      usageCount: 42,
      isAffiliate: true,
    },
    isPremium: true,
    premiumUntil: "31/12/2024",
    reviews: [
      {
        id: "r1",
        author: "Sophie M.",
        date: "2023-12-15",
        rating: 5,
        text: "Les fleurs CBD sont exceptionnelles, j'apprécie particulièrement l'origine suisse qui garantit une qualité supérieure.",
        category: "flowers",
      },
      {
        id: "r2",
        author: "Thomas D.",
        date: "2023-11-28",
        rating: 4,
        text: "L'huile CBD que j'ai achetée est très efficace pour réduire mon anxiété. Produit de qualité, mais un peu cher.",
        category: "oils",
      },
      {
        id: "r3",
        author: "Lucie R.",
        date: "2024-01-05",
        rating: 5,
        text: "Boutique magnifique avec une ambiance zen et un personnel ultra compétent. J'adore y aller même juste pour l'atmosphère!",
        category: "experience",
      },
      {
        id: "r4",
        author: "Marc F.",
        date: "2023-10-12",
        rating: 5,
        text: "Ce qui est unique ici, c'est leur bar à dégustation où on peut tester différentes infusions au CBD. Une excellente initiative!",
        category: "originality",
      },
    ],
    products: [
      { category: "Fleurs", origin: "Suisse", quality: "Premium" },
      { category: "Huiles", origin: "France", quality: "Bio" },
      { category: "Infusions", origin: "Italie", quality: "Artisanal" },
    ],
  },
  {
    id: "2",
    name: "CBD Lyon Centre",
    address: "45 Rue de la République",
    city: "Lyon",
    postalCode: "69002",
    latitude: 45.7578,
    longitude: 4.8320,
    phone: "04 72 40 12 89",
    website: "https://cbd-lyon.fr",
    openingHours: [
      { day: "Lundi", hours: "10:00 - 19:00" },
      { day: "Mardi", hours: "10:00 - 19:00" },
      { day: "Mercredi", hours: "10:00 - 19:00" },
      { day: "Jeudi", hours: "10:00 - 19:00" },
      { day: "Vendredi", hours: "10:00 - 20:00" },
      { day: "Samedi", hours: "10:00 - 20:00" },
      { day: "Dimanche", hours: "Fermé" },
    ],
    description: "Première boutique CBD à Lyon, proposant une large gamme de produits CBD de qualité, des fleurs aux huiles en passant par les cosmétiques et aliments.",
    imageUrl: "https://images.unsplash.com/photo-1585143894744-a722b5e55615?q=80&w=1000",
    rating: 4.5,
    reviewCount: 89,
    coupon: {
      code: "LYONCBD10",
      discount: "10% sur tout le magasin",
      validUntil: "30/06/2024",
    },
    reviews: [
      {
        id: "r5",
        author: "Julie B.",
        date: "2024-01-22",
        rating: 4,
        text: "Les fleurs sont bien dosées et de bonne qualité. J'apprécie qu'elles soient cultivées en France sans pesticides.",
        category: "flowers",
      },
      {
        id: "r6",
        author: "Romain S.",
        date: "2023-12-05",
        rating: 5,
        text: "L'huile CBD au citron est excellente. Effet rapide sur mes douleurs chroniques. Je recommande!",
        category: "oils",
      },
      {
        id: "r7",
        author: "Emilie C.",
        date: "2023-11-19",
        rating: 4,
        text: "Personnel très disponible et bien informé. La boutique est propre et bien agencée. Un vrai plaisir d'y faire ses achats.",
        category: "experience",
      },
      {
        id: "r8",
        author: "Antoine M.",
        date: "2024-01-10",
        rating: 5,
        text: "J'adore leurs ateliers mensuels sur les bienfaits du CBD. C'est instructif et ça permet de rencontrer d'autres utilisateurs.",
        category: "originality",
      },
    ],
    products: [
      { category: "Fleurs", origin: "France", quality: "Bio" },
      { category: "Huiles", origin: "Allemagne", quality: "Premium" },
      { category: "Cosmétiques", origin: "France", quality: "Naturel" },
    ],
  },
  {
    id: "3",
    name: "CBD Bordeaux",
    address: "12 Cours de l'Intendance",
    city: "Bordeaux",
    postalCode: "33000",
    latitude: 44.8378,
    longitude: -0.5792,
    phone: "05 56 48 23 75",
    website: "https://cbd-bordeaux.fr",
    openingHours: [
      { day: "Lundi", hours: "12:00 - 19:00" },
      { day: "Mardi", hours: "10:00 - 19:00" },
      { day: "Mercredi", hours: "10:00 - 19:00" },
      { day: "Jeudi", hours: "10:00 - 19:00" },
      { day: "Vendredi", hours: "10:00 - 19:30" },
      { day: "Samedi", hours: "10:00 - 19:30" },
      { day: "Dimanche", hours: "14:00 - 18:00" },
    ],
    description: "Notre boutique au cœur de Bordeaux propose des produits CBD sélectionnés avec soin. Nous travaillons directement avec des producteurs locaux et européens pour garantir une qualité optimale.",
    imageUrl: "https://images.unsplash.com/photo-1594304558786-3850b5018ca9?q=80&w=1000",
    rating: 4.8,
    reviewCount: 156,
    coupon: {
      code: "BORDEAUXCBD20",
      discount: "20% sur les huiles CBD",
      validUntil: "15/09/2024",
    },
    reviews: [
      {
        id: "r9",
        author: "Pierre L.",
        date: "2024-02-01",
        rating: 5,
        text: "Les fleurs CBD sont parmi les meilleures que j'ai pu tester. La sélection est impressionnante et la qualité est constante.",
        category: "flowers",
      },
      {
        id: "r10",
        author: "Camille D.",
        date: "2023-12-18",
        rating: 4,
        text: "Huile CBD au chanvre excellent rapport qualité-prix. Effet relaxant efficace sans somnolence.",
        category: "oils",
      },
      {
        id: "r11",
        author: "Laurent F.",
        date: "2024-01-15",
        rating: 5,
        text: "Accueil exceptionnel, conseils personnalisés et ambiance relaxante. La boutique est magnifiquement décorée.",
        category: "experience",
      },
      {
        id: "r12",
        author: "Marie T.",
        date: "2023-11-30",
        rating: 5,
        text: "Leur concept de bar à CBD où l'on peut déguster des thés et infusions est vraiment innovant. Ça change de l'expérience d'achat classique!",
        category: "originality",
      },
    ],
    products: [
      { category: "Fleurs", origin: "Espagne", quality: "Premium" },
      { category: "Huiles", origin: "France", quality: "Bio" },
      { category: "Infusions", origin: "Suisse", quality: "Artisanal" },
    ],
  },
];

export const guideContent = [
  {
    id: "1",
    title: "Qu'est-ce que le CBD?",
    content: "Le CBD (cannabidiol) est une molécule présente naturellement dans le cannabis. Contrairement au THC, le CBD n'a pas d'effet psychoactif et ne provoque pas de dépendance. Il est reconnu pour ses propriétés relaxantes et anti-inflammatoires."
  },
  {
    id: "2",
    title: "Les bienfaits du CBD",
    content: "Le CBD peut aider à soulager diverses conditions comme l'anxiété, le stress, les douleurs chroniques, l'inflammation, les troubles du sommeil et certains symptômes neurologiques. Cependant, les recherches sont encore en cours et le CBD n'est pas un médicament."
  },
  {
    id: "3",
    title: "Formes de CBD",
    content: "Le CBD existe sous différentes formes: huiles (à prendre sous la langue), fleurs et résines (à infuser ou vaporiser), e-liquides (pour cigarettes électroniques), cosmétiques, et aliments/boissons enrichis."
  },
  {
    id: "4",
    title: "Législation en France",
    content: "En France, le CBD est légal à condition qu'il provienne de variétés de cannabis autorisées (avec moins de 0,3% de THC) et qu'il soit extrait uniquement des fibres et graines. La vente de fleurs et feuilles brutes reste dans un flou juridique mais est généralement tolérée."
  },
  {
    id: "5",
    title: "Comment choisir son CBD",
    content: "Pour choisir un produit CBD de qualité, vérifiez l'origine du produit, le taux de CBD, les méthodes d'extraction, les certifications, et les analyses de laboratoire. Privilégiez des produits bio et fabriqués en Europe."
  },
  {
    id: "6",
    title: "Dosage et utilisation",
    content: "Le dosage du CBD varie selon chaque individu et dépend du poids, du métabolisme, et des symptômes traités. Il est recommandé de commencer par une faible dose et d'augmenter progressivement jusqu'à obtenir l'effet désiré."
  }
];

export const filterUserLocation = () => {
  // In a real app, this would use the browser's geolocation API
  // For now, we'll return Paris coordinates as default
  return { latitude: 48.8566, longitude: 2.3522 };
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  // Approximate radius of earth in km
  const R = 6371;
  
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1); 
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  
  return distance;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI/180);
};

export const getStoresByDistance = (userLat: number, userLng: number) => {
  return [...stores].sort((a, b) => {
    const distA = calculateDistance(userLat, userLng, a.latitude, a.longitude);
    const distB = calculateDistance(userLat, userLng, b.latitude, b.longitude);
    return distA - distB;
  });
};

export const getStoreById = (id: string) => {
  return stores.find(store => store.id === id);
};

export const getReviewsByCategory = (reviews: Store['reviews'], category: string) => {
  return reviews.filter(review => review.category === category);
};
