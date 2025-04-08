
export const subscriptionPlans = [
  {
    id: "basic",
    name: "Basique",
    price: 0,
    features: [
      "Fiche partenaire simple",
      "Présence sur la liste des partenaires",
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
      "Fiche partenaire enrichie",
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
