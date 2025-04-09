import { Trophy, Star, Store, Globe, Cannabis, Square, Droplet } from 'lucide-react';
import React from 'react';

// Types
export interface RankedItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  category: string;
  location?: string;
  url?: string;
  description: string;
  sponsored: boolean;
}

export interface RankingCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  items: RankedItem[];
}

// Using the existing mock data
export const rankings: RankingCategory[] = [
  {
    id: 'stores',
    name: 'Meilleures boutiques CBD',
    icon: Store,
    items: [
      {
        id: '1',
        name: 'CBD Shop Paris',
        image: 'https://images.unsplash.com/photo-1567449303183-ae0d6ed1c14e?q=80&w=1000',
        rating: 4.9,
        category: 'boutique',
        location: 'Paris, France',
        description: 'Large sélection de produits et personnel compétent et passionné.',
        sponsored: true
      },
      {
        id: '2',
        name: 'Green Leaf',
        image: 'https://images.unsplash.com/photo-1439127989242-c3749a012eac?q=80&w=1000',
        rating: 4.8,
        category: 'boutique',
        location: 'Lyon, France',
        description: 'Ambiance chaleureuse et produits bio de qualité exceptionnelle.',
        sponsored: false
      },
      {
        id: '3',
        name: 'CBD House',
        image: 'https://images.unsplash.com/photo-1527015175522-6576b6581ccf?q=80&w=1000',
        rating: 4.7,
        category: 'boutique',
        location: 'Marseille, France',
        description: 'Boutique spécialisée dans les produits CBD haut de gamme.',
        sponsored: false
      },
      {
        id: '4',
        name: 'Cannavie',
        image: 'https://images.unsplash.com/photo-1611232658409-0d98127f237f?q=80&w=1000',
        rating: 4.7,
        category: 'boutique',
        location: 'Bordeaux, France',
        description: 'Une des premières boutiques CBD de la ville avec produits locaux.',
        sponsored: false
      },
      {
        id: '5',
        name: 'Herba CBD',
        image: 'https://images.unsplash.com/photo-1626128665085-483747621778?q=80&w=1000',
        rating: 4.6,
        category: 'boutique',
        location: 'Toulouse, France',
        description: 'Conseils personnalisés et espace de dégustation pour e-liquides.',
        sponsored: false
      }
    ]
  },
  {
    id: 'ecommerce',
    name: 'Meilleurs sites e-commerce CBD',
    icon: Globe,
    items: [
      {
        id: '1',
        name: 'CBD Shop Online',
        image: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1000',
        rating: 4.8,
        category: 'ecommerce',
        url: 'https://cbdshoponline.fr',
        description: 'Large catalogue et livraison rapide dans toute la France.',
        sponsored: true
      },
      {
        id: '2',
        name: 'Natural CBD',
        image: 'https://images.unsplash.com/photo-1421757295538-9c80958e75b0?q=80&w=1000',
        rating: 4.7,
        category: 'ecommerce',
        url: 'https://naturalcbd.fr',
        description: 'Spécialiste des produits CBD biologiques et éthiques.',
        sponsored: false
      },
      {
        id: '3',
        name: 'CBD Express',
        image: 'https://images.unsplash.com/photo-1580397581145-cdb6a35b7d3f?q=80&w=1000',
        rating: 4.6,
        category: 'ecommerce',
        url: 'https://cbdexpress.fr',
        description: 'Livraison en 24h et service client disponible 7j/7.',
        sponsored: false
      },
      {
        id: '4',
        name: 'Green CBD Market',
        image: 'https://images.unsplash.com/photo-1528297506728-9533d2ac3fa4?q=80&w=1000',
        rating: 4.5,
        category: 'ecommerce',
        url: 'https://greencbdmarket.com',
        description: 'Prix compétitifs et programme de fidélité avantageux.',
        sponsored: false
      },
      {
        id: '5',
        name: 'CBD Premium',
        image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=1000',
        rating: 4.5,
        category: 'ecommerce',
        url: 'https://cbdpremium.fr',
        description: 'Sélection rigoureuse des meilleures marques européennes.',
        sponsored: false
      }
    ]
  },
  {
    id: 'flowers',
    name: 'Meilleures fleurs CBD',
    icon: Cannabis,
    items: [
      {
        id: '1',
        name: 'Strawberry Haze',
        image: 'https://images.unsplash.com/photo-1603901622858-72d9154fc78f?q=80&w=1000',
        rating: 4.9,
        category: 'fleur',
        description: 'Notes fruitées et douces avec des effets relaxants. Idéale en soirée.',
        sponsored: true
      },
      {
        id: '2',
        name: 'Purple Kush',
        image: 'https://images.unsplash.com/photo-1603576477364-39a7c4e2c983?q=80&w=1000',
        rating: 4.8,
        category: 'fleur',
        description: 'Fleur violacée très parfumée, reconnue pour ses effets anti-stress.',
        sponsored: false
      },
      {
        id: '3',
        name: 'Lemon Haze',
        image: 'https://images.unsplash.com/photo-1456409165996-16eaefdc15ff?q=80&w=1000',
        rating: 4.7,
        category: 'fleur',
        description: 'Goût d\'agrumes prononcé et effet énergisant. Parfaite pour la journée.',
        sponsored: false
      },
      {
        id: '4',
        name: 'OG Kush',
        image: 'https://images.unsplash.com/photo-1603318355936-9162894d479d?q=80&w=1000',
        rating: 4.7,
        category: 'fleur',
        description: 'Classique indémodable avec des arômes terreux et boisés.',
        sponsored: false
      },
      {
        id: '5',
        name: 'Cannatonic',
        image: 'https://images.unsplash.com/photo-1553525553-f373197579bf?q=80&w=1000',
        rating: 4.6,
        category: 'fleur',
        description: 'Forte teneur en CBD et presque pas de THC. Effets médicinaux.',
        sponsored: false
      }
    ]
  },
  {
    id: 'resins',
    name: 'Meilleures résines CBD',
    icon: Square,
    items: [
      {
        id: '1',
        name: 'Charas Gold',
        image: 'https://images.unsplash.com/photo-1566733971016-d576678feebf?q=80&w=1000',
        rating: 4.8,
        category: 'résine',
        description: 'Résine artisanale pressée à la main, texture souple et arômes intenses.',
        sponsored: true
      },
      {
        id: '2',
        name: 'Moroccan Hash',
        image: 'https://images.unsplash.com/photo-1563656157432-67560b79e9b9?q=80&w=1000',
        rating: 4.7,
        category: 'résine',
        description: 'Résine traditionnelle aux notes épicées et terreuses. Très relaxante.',
        sponsored: false
      },
      {
        id: '3',
        name: 'Afghan Black',
        image: 'https://images.unsplash.com/photo-1592652426689-4d854bbe0bab?q=80&w=1000',
        rating: 4.6,
        category: 'résine',
        description: 'Résine sombre et compacte, effets médicinaux et puissants.',
        sponsored: false
      },
      {
        id: '4',
        name: 'Nepalese Temple Ball',
        image: 'https://images.unsplash.com/photo-1534705867302-2a41394d2a3b?q=80&w=1000',
        rating: 4.5,
        category: 'résine',
        description: 'Forme ronde traditionnelle, goût doux et sensation de bien-être.',
        sponsored: false
      },
      {
        id: '5',
        name: 'Bubble Hash',
        image: 'https://images.unsplash.com/photo-1586143314812-260c941f8b5b?q=80&w=1000',
        rating: 4.5,
        category: 'résine',
        description: 'Extraction à l\'eau glacée, très pure et riche en terpènes.',
        sponsored: false
      }
    ]
  },
  {
    id: 'oils',
    name: 'Meilleures huiles CBD',
    icon: Droplet,
    items: [
      {
        id: '1',
        name: 'Full Spectrum 10%',
        image: 'https://images.unsplash.com/photo-1590510429906-a56ac1f80b58?q=80&w=1000',
        rating: 4.9,
        category: 'huile',
        description: 'Huile complète avec tous les cannabinoïdes. Effet entourage maximal.',
        sponsored: true
      },
      {
        id: '2',
        name: 'CBD + CBG Oil',
        image: 'https://images.unsplash.com/photo-1584728288982-89ab885be0bc?q=80&w=1000',
        rating: 4.8,
        category: 'huile',
        description: 'Combinaison synergique de CBD et CBG. Idéale pour l\'inflammation.',
        sponsored: false
      },
      {
        id: '3',
        name: 'CBD MCT Premium',
        image: 'https://images.unsplash.com/photo-1615493737464-8a4cefb54d3c?q=80&w=1000',
        rating: 4.7,
        category: 'huile',
        description: 'Absorption optimale grâce aux triglycérides à chaîne moyenne.',
        sponsored: false
      },
      {
        id: '4',
        name: 'Sleep Formula',
        image: 'https://images.unsplash.com/photo-1603465396765-6b5fa5180e23?q=80&w=1000',
        rating: 4.6,
        category: 'huile',
        description: 'Enrichie en melatonine et terpènes favorisant le sommeil.',
        sponsored: false
      },
      {
        id: '5',
        name: 'Bio Hemp Oil 5%',
        image: 'https://images.unsplash.com/photo-1593704160339-f2f5991f7fe1?q=80&w=1000',
        rating: 4.6,
        category: 'huile',
        description: 'Issue de chanvre biologique et extraction CO2. Goût naturel.',
        sponsored: false
      }
    ]
  }
];
