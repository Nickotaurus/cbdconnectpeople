import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star, Store, Globe, Hash, ExternalLink, Cannabis } from 'lucide-react';

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

// Using the existing mock data
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
    icon: <img src="/lovable-uploads/13409efc-2cd8-488d-84b7-5fea2399a403.png" alt="Fleur" className="h-6 w-6" />,
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
  const navigate = useNavigate();
  
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="relative">
        {/* Hero Section with Gradient Background */}
        <div className="bg-gradient-to-r from-primary/10 to-amber-100 dark:from-primary/20 dark:to-amber-900/20 rounded-xl p-8 mb-10">
          <div className="text-center">
            <div className="inline-block p-4 bg-white dark:bg-black rounded-full shadow-lg mb-4">
              <Trophy className="h-12 w-12 text-amber-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Classement CBD</h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-4">
              Découvrez les meilleurs produits, boutiques et sites CBD en France, sélectionnés par notre communauté
            </p>
          </div>
        </div>
        
        {/* Category Tabs */}
        <Tabs defaultValue={rankings[0].id} onValueChange={setActiveTab} className="w-full mb-8">
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 gap-1">
              {rankings.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex flex-col items-center gap-1 py-3 px-2 md:px-4"
                >
                  <span className="flex items-center justify-center bg-primary/10 rounded-full p-2">
                    {category.id === 'flowers' ? (
                      <Cannabis className="h-6 w-6 text-green-600" />
                    ) : (
                      category.icon
                    )}
                  </span>
                  <span className="hidden md:inline text-xs">{category.name.split(' ').pop()}</span>
                  <span className="inline md:hidden text-xs">
                    {category.id === 'stores' ? 'Boutiques' : 
                     category.id === 'ecommerce' ? 'Sites' : 
                     category.id === 'flowers' ? 'Fleurs' : 
                     category.id === 'resins' ? 'Résines' : 'Huiles'}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {/* Category Title */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3 bg-primary/5 px-6 py-3 rounded-full">
              <Trophy className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-bold">{currentRanking.name}</h2>
            </div>
          </div>
          
          {/* Ranking Items */}
          <div className="space-y-6">
            {currentRanking.items.map((item, index) => (
              <Card 
                key={item.id} 
                className={`overflow-hidden ${item.sponsored ? 'border-amber-300 dark:border-amber-500 shadow-md' : ''}`}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-1/4 h-48 md:h-auto">
                    <span className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                      {index + 1}
                    </span>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                    {item.sponsored && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-gradient-to-r from-amber-400/90 to-amber-600/90 text-white border-0">
                          Sponsorisé
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="flex-1 p-6">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                      {(item.location || item.url) && (
                        <p className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <Store className="h-3.5 w-3.5" />
                              {item.location}
                            </span>
                          )}
                          
                          {item.url && (
                            <span className="flex items-center gap-1">
                              <Globe className="h-3.5 w-3.5" />
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline text-primary"
                              >
                                {item.url.replace(/(^\w+:|^)\/\//, '')}
                              </a>
                            </span>
                          )}
                        </p>
                      )}
                      
                      <div className="mb-3">
                        {renderStars(item.rating)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    
                    <div className="flex justify-end">
                      <Button variant="default" size="sm" className="gap-1">
                        {item.category === 'boutique' ? 'Voir la boutique' : 
                         item.category === 'ecommerce' ? (
                           <>
                             Visiter le site <ExternalLink className="h-4 w-4" />
                           </>
                         ) : 'Voir le détail'}
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </Tabs>
        
        {/* Sponsorship CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary/5 to-amber-50 dark:from-primary/10 dark:to-amber-900/10 rounded-xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Vous souhaitez apparaître dans nos classements ?
            </h2>
            <p className="text-muted-foreground mb-6">
              Proposez vos produits ou services pour nos classements et gagnez en visibilité auprès de notre communauté.
            </p>
            <Button 
              variant="default" 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              onClick={() => navigate("/partners/subscription")}
            >
              Devenir partenaire
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
