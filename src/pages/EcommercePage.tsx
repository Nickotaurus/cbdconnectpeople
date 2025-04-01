
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Filter, Search, Globe, ExternalLink, Check, Star, Link as LinkIcon } from 'lucide-react';

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

// Mock data for e-commerce websites
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
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState<string | null>(null);
  const [filteredStores, setFilteredStores] = useState(mockEcommerces);
  
  // Filter stores based on search term and specialty
  const filterStores = (term: string, specialty: string | null) => {
    let result = [...mockEcommerces];
    
    // Apply search filter
    if (term.trim()) {
      const lowerTerm = term.toLowerCase();
      result = result.filter(
        store => 
          store.name.toLowerCase().includes(lowerTerm) || 
          store.description.toLowerCase().includes(lowerTerm)
      );
    }
    
    // Apply specialty filter
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
  
  // Get all unique specialties from all stores
  const allSpecialties = Array.from(
    new Set(mockEcommerces.flatMap(store => store.specialties))
  ).sort();
  
  // Utility to render star ratings
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Sites E-commerce CBD</h1>
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
          
          {/* Encart de référencement pour les e-commerçants */}
          <div className="bg-primary/5 rounded-lg p-6 mb-10 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Référencez votre site e-commerce CBD</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">30€</h3>
                <p className="text-lg font-medium mb-1">Pour 1 an</p>
                <p className="text-sm text-muted-foreground text-center">Référencement de votre site e-commerce</p>
              </div>
              
              <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm border-2 border-primary">
                <h3 className="text-xl font-semibold mb-2">50€</h3>
                <p className="text-lg font-medium mb-1">Pour 2 ans</p>
                <p className="text-sm text-muted-foreground text-center">Référencement + tous les avantages</p>
                <Badge className="mt-2 bg-primary text-white">Meilleure offre</Badge>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Les avantages de notre annuaire e-commerce</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="flex items-start gap-2 bg-white p-3 rounded">
                <div className="mt-0.5">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-medium">Backlink de qualité</h4>
                  <p className="text-sm text-muted-foreground">Amélioration de votre SEO</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 bg-white p-3 rounded">
                <div className="mt-0.5">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-medium">Visibilité ciblée</h4>
                  <p className="text-sm text-muted-foreground">Auprès des consommateurs de CBD</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 bg-white p-3 rounded">
                <div className="mt-0.5">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-medium">Référencement prioritaire</h4>
                  <p className="text-sm text-muted-foreground">Dans notre classement CBD</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 bg-white p-3 rounded">
                <div className="mt-0.5">
                  <LinkIcon className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-medium">Accès aux petites annonces</h4>
                  <p className="text-sm text-muted-foreground">Et à la communauté professionnelle</p>
                </div>
              </div>
            </div>
            
            <Button className="w-full sm:w-auto" onClick={() => window.location.href = '/register?role=store&type=ecommerce'}>
              Référencer mon site e-commerce
            </Button>
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
  );
};

export default EcommercePage;
