
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, Store, Globe, Leaf, Hash, ExternalLink } from 'lucide-react';

// Types
interface RankedItem {
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

interface RankingCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: RankedItem[];
}

// Mock data for rankings
const rankings: RankingCategory[] = [
  {
    id: 'stores',
    name: 'Meilleures boutiques CBD',
    icon: <Store className="h-5 w-5" />,
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
    icon: <Globe className="h-5 w-5" />,
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
    icon: <Leaf className="h-5 w-5" />,
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
    icon: <Hash className="h-5 w-5" />,
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
    icon: <Star className="h-5 w-5" />,
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

const RankingPage = () => {
  const [activeTab, setActiveTab] = useState<string>(rankings[0].id);
  
  // Render star ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  // Get the current ranking category
  const currentRanking = rankings.find(r => r.id === activeTab) || rankings[0];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3">
            <Trophy className="h-16 w-16 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Classement CBD</h1>
          <p className="text-muted-foreground mb-6">
            Découvrez les meilleurs produits, boutiques et sites CBD en France
          </p>
        </div>
        
        <Tabs defaultValue={rankings[0].id} onValueChange={setActiveTab} className="w-full mb-10">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full h-auto">
            {rankings.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2 py-3"
              >
                {category.icon}
                <span className="hidden md:inline">{category.name}</span>
                <span className="inline md:hidden">
                  {category.id === 'stores' ? 'Boutiques' : 
                   category.id === 'ecommerce' ? 'Sites' : 
                   category.id === 'flowers' ? 'Fleurs' : 
                   category.id === 'resins' ? 'Résines' : 'Huiles'}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <Trophy className="h-6 w-6 text-amber-400 mr-2" />
              Top 10 {currentRanking.name}
            </h2>
            
            <div className="space-y-6">
              {currentRanking.items.map((item, index) => (
                <Card 
                  key={item.id} 
                  className={`overflow-hidden ${item.sponsored ? 'border-2 border-amber-400' : ''}`}
                >
                  <div className="md:flex">
                    <div className="relative md:w-1/5 h-40 md:h-auto">
                      <span className="absolute top-2 left-2 w-8 h-8 bg-amber-400 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </span>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-1">{item.name}</CardTitle>
                          
                          {(item.location || item.url) && (
                            <CardDescription className="flex items-center gap-1 mb-2">
                              {item.location && (
                                <>
                                  <Store className="h-3.5 w-3.5" />
                                  {item.location}
                                </>
                              )}
                              
                              {item.url && (
                                <>
                                  <Globe className="h-3.5 w-3.5 ml-2" />
                                  <a 
                                    href={item.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:underline text-primary"
                                  >
                                    {item.url.replace(/(^\w+:|^)\/\//, '')}
                                  </a>
                                </>
                              )}
                            </CardDescription>
                          )}
                          
                          <div className="mb-3">
                            {renderStars(item.rating)}
                          </div>
                        </div>
                        
                        {item.sponsored && (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            Sponsorisé
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {item.description}
                      </p>
                      
                      <div className="flex justify-end">
                        <Button variant="default" className="gap-2">
                          {item.category === 'boutique' ? 'Voir la boutique' : 
                           item.category === 'ecommerce' ? (
                             <>
                               Visiter le site <ExternalLink className="h-4 w-4" />
                             </>
                           ) : 'Voir le détail'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Tabs>
        
        {/* Sponsorship CTA */}
        <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Vous souhaitez apparaître dans nos classements ?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Proposez vos produits ou services pour nos classements et gagnez en visibilité auprès de notre communauté.
          </p>
          <Button variant="default" size="lg">
            Devenir partenaire
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
