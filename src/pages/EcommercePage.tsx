import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Filter, Search, Globe, ExternalLink, Check, Star, Link as LinkIcon, ArrowRight, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Ecommerce {
  id: string;
  name: string;
  url: string;
  description: string;
  logo: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  isPremium: boolean;
  paymentMethods: string[];
  shippingCountries: string[];
}

const mockEcommerces: Ecommerce[] = [
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
    logo: "https://images.unsplash.com/photo-1571166052181-bdb4647ba46d?q=80&w=1000",
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

const EcommercePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState<string | null>(null);
  const [filteredStores, setFilteredStores] = useState(mockEcommerces);
  
  const filterStores = (term: string, specialty: string | null) => {
    let result = [...mockEcommerces];
    
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
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterStores(term, filterSpecialty);
  };
  
  const handleSpecialtyFilter = (specialty: string | null) => {
    setFilterSpecialty(specialty);
    filterStores(searchTerm, specialty);
  };
  
  const allSpecialties = Array.from(
    new Set(mockEcommerces.flatMap(store => store.specialties))
  ).sort();
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  const subscriptionOffers = [
    {
      id: 'essential',
      title: 'Visibilité Essentielle',
      description: 'Démarrez votre présence en ligne avec des avantages clés',
      prices: {
        oneYear: 50,
        twoYears: 90,
        savings: 10
      },
      benefits: [
        'Backlink de qualité renvoyant vers votre société',
        'Visibilité accrue avec la possibilité de faire gagner vos produits/services à la loterie du CBD',
        'Accès au carnet d\'adresses B2B avec coordonnées et contacts',
        'Récupérez plus d\'avis Google grâce au jeu CBD Quest'
      ]
    },
    {
      id: 'premium',
      title: 'Visibilité Premium',
      description: 'Maximisez votre impact et votre visibilité',
      prices: {
        oneYear: 100,
        twoYears: 180,
        savings: 20
      },
      benefits: [
        'Tous les avantages de l\'offre Visibilité Essentielle',
        'Affichage prioritaire dans la recherche',
        'Accès aux demandes de contacts directs',
        'Accès au catalogue d\'envoi d\'offres spéciales vers clients/boutiques',
        'Un article sponsorisé avec lien retour vers votre site'
      ]
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Boutiques E-commerce CBD</h1>
          <p className="text-muted-foreground mb-6">
            Trouvez les meilleurs sites de vente en ligne de produits CBD
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher un site e-commerce..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {filterSpecialty || 'Filtrer par spécialité'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSpecialtyFilter(null)}>
                  Toutes les spécialités
                </DropdownMenuItem>
                {allSpecialties.map((specialty) => (
                  <DropdownMenuItem 
                    key={specialty}
                    onClick={() => handleSpecialtyFilter(specialty)}
                  >
                    {specialty}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-6 mb-10">
            <h2 className="text-2xl font-bold mb-6">Référencez votre site e-commerce CBD</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {subscriptionOffers.map(offer => (
                <Card 
                  key={offer.id} 
                  className={`border ${offer.id === 'premium' ? 'border-2 border-primary' : 'border-primary/20'} overflow-hidden`}
                >
                  {offer.id === 'premium' && (
                    <Badge className="absolute top-4 right-4 bg-primary">Recommandé</Badge>
                  )}
                  
                  <div className={`px-6 py-4 flex items-center justify-between ${offer.id === 'premium' ? 'bg-primary/20' : 'bg-primary/10'}`}>
                    <div>
                      <h3 className="text-xl font-bold">{offer.title}</h3>
                      <p className="text-sm text-muted-foreground">{offer.description}</p>
                    </div>
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  
                  <CardContent className="pt-6">
                    <div className="flex justify-between mb-6">
                      <div className="text-center px-4 py-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium">1 An</p>
                        <p className="text-2xl font-bold">{offer.prices.oneYear}€</p>
                      </div>
                      
                      <div className="text-center px-4 py-3 bg-primary/10 border border-primary/20 rounded-lg relative overflow-hidden">
                        <div className="absolute -right-7 -top-1 bg-primary text-primary-foreground px-8 py-0.5 text-xs rotate-45">
                          -{offer.prices.savings}€
                        </div>
                        <p className="text-sm font-medium">2 Ans</p>
                        <p className="text-2xl font-bold">{offer.prices.twoYears}€</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Ce que vous obtenez :</h4>
                      <ul className="space-y-2">
                        {offer.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="mt-1">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="pt-4 bg-muted/30 p-3 rounded-lg mt-4">
                        <p className="text-sm">
                          <strong>Pourquoi choisir 2 ans ? </strong>
                          Économisez {offer.prices.savings}€ et assurez une visibilité prolongée pour votre e-commerce.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-4">
                    <Button 
                      className="w-full gap-2" 
                      variant={offer.id === 'premium' ? 'default' : 'secondary'}
                      onClick={() => navigate('/e-commerce/subscription', { state: { offer: offer.id } })}
                    >
                      Sélectionner cette offre
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map(store => (
              <Card key={store.id} className={`overflow-hidden ${store.isPremium ? 'border-2 border-primary' : ''}`}>
                <div className="h-24 flex items-center justify-center p-4 bg-secondary/30">
                  <img 
                    src={store.logo} 
                    alt={store.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{store.name}</CardTitle>
                    {store.isPremium && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center">
                    <Globe className="h-3.5 w-3.5 mr-1" />
                    <a 
                      href={store.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline text-primary"
                    >
                      {store.url.replace(/(^\w+:|^)\/\//, '')}
                    </a>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="mb-3">
                    {renderStars(store.rating)}
                    <p className="text-xs text-muted-foreground mt-1">
                      {store.reviewCount} avis clients
                    </p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {store.description}
                  </p>
                  
                  <div className="mb-3">
                    <h4 className="text-xs font-medium mb-1">Spécialités:</h4>
                    <div className="flex flex-wrap gap-1">
                      {store.specialties.map(specialty => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium mb-1">Livraison:</h4>
                    <p className="text-xs text-muted-foreground">
                      {store.shippingCountries.join(', ')}
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <Button className="w-full gap-2" asChild>
                    <a href={store.url} target="_blank" rel="noopener noreferrer">
                      Visiter le site <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredStores.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun site e-commerce ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EcommercePage;
