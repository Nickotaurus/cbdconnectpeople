import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, MapPin, Search, Tag, Clock } from 'lucide-react';
import PublishButton from '@/components/classifieds/PublishButton';

// Types
type ClassifiedType = 'buy' | 'sell' | 'service';
type ClassifiedCategory = 'store' | 'ecommerce' | 'realestate' | 'employer' | 'employee';

interface Classified {
  id: string;
  type: ClassifiedType;
  category: ClassifiedCategory;
  title: string;
  description: string;
  location: string;
  price?: string;
  date: string;
  user: {
    name: string;
    id: string;
  };
  isPremium: boolean;
  images?: string[];
}

// Mock data
const mockClassifieds: Classified[] = [
  {
    id: '1',
    type: 'sell',
    category: 'store',
    title: 'Cession de boutique CBD Paris 3ème',
    description: 'Boutique de 55m² dans quartier passant, clientèle fidèle, CA en hausse. Vente cause départ à l\'étranger.',
    location: 'Paris, France',
    price: '85 000 €',
    date: '2023-10-15',
    user: { name: 'CBD Central', id: 'u1' },
    isPremium: true,
    images: ['https://images.unsplash.com/photo-1567449303183-ae0d6ed1c14e?q=80&w=1000'],
  },
  {
    id: '2',
    type: 'buy',
    category: 'ecommerce',
    title: 'Recherche dropshipping CBD',
    description: 'Nous recherchons un partenaire pour nos activités de e-commerce en dropshipping pour des produits de qualité.',
    location: 'Lyon, France',
    date: '2023-10-18',
    user: { name: 'GreenLeaf Distribution', id: 'u2' },
    isPremium: false
  },
  {
    id: '3',
    type: 'service',
    category: 'employer',
    title: 'Recrute vendeur/vendeuse CBD',
    description: 'Boutique CBD à Bordeaux recrute vendeur(se) avec expérience dans le secteur. Temps plein, CDI après période d\'essai.',
    location: 'Bordeaux, France',
    date: '2023-10-20',
    user: { name: 'CBD Bordeaux', id: 'u3' },
    isPremium: true,
    images: ['https://images.unsplash.com/photo-1533392151650-269f96231f65?q=80&w=1000'],
  },
  {
    id: '4',
    type: 'sell',
    category: 'realestate',
    title: 'Terrain agricole adapté culture chanvre',
    description: 'Terrain de 5 hectares avec irrigation, sol adapté à la culture du chanvre. Analyses de sol disponibles.',
    location: 'Drôme, France',
    price: '250 000 €',
    date: '2023-10-22',
    user: { name: 'AgriCBD', id: 'u4' },
    isPremium: false
  },
  {
    id: '5',
    type: 'service',
    category: 'employee',
    title: 'Consultant expert en CBD cherche mission',
    description: 'Expert en réglementation et produits CBD propose ses services pour accompagner votre entreprise dans son développement.',
    location: 'Télétravail, France',
    date: '2023-10-25',
    user: { name: 'Jean Martin', id: 'u5' },
    isPremium: false
  }
];

const ClassifiedsPage = () => {
  const { user } = useAuth();
  const [activeType, setActiveType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClassifieds, setFilteredClassifieds] = useState(mockClassifieds);
  
  const filterClassifieds = (type: string, term: string) => {
    let filtered = [...mockClassifieds];
    
    if (type !== 'all') {
      filtered = filtered.filter(classified => classified.type === type);
    }
    
    if (term.trim()) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(
        classified => 
          classified.title.toLowerCase().includes(lowerTerm) ||
          classified.description.toLowerCase().includes(lowerTerm) ||
          classified.location.toLowerCase().includes(lowerTerm)
      );
    }
    
    setFilteredClassifieds(filtered);
  };
  
  const handleTypeChange = (value: string) => {
    setActiveType(value);
    filterClassifieds(value, searchTerm);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterClassifieds(activeType, term);
  };
  
  const getTypeLabel = (type: ClassifiedType) => {
    switch (type) {
      case 'buy': return 'Achat';
      case 'sell': return 'Vente';
      case 'service': return 'Service';
      default: return type;
    }
  };
  
  const getCategoryLabel = (category: ClassifiedCategory) => {
    switch (category) {
      case 'store': return 'Boutique CBD';
      case 'ecommerce': return 'E-commerce CBD';
      case 'realestate': return 'Immobilier CBD';
      case 'employer': return 'Employeur CBD';
      case 'employee': return 'Employé CBD';
      default: return category;
    }
  };
  
  const getTypeBadgeColor = (type: ClassifiedType) => {
    switch (type) {
      case 'buy': return 'bg-blue-100 text-blue-800';
      case 'sell': return 'bg-green-100 text-green-800';
      case 'service': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Petites Annonces CBD</h1>
          <p className="text-muted-foreground mb-6">
            Achetez, vendez et échangez des biens et services liés au CBD
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher une annonce..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            
            <Button variant="default" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtres avancés
            </Button>
            
            <Button variant="default" className="gap-2">
              <MapPin className="h-4 w-4" />
              Carte
            </Button>
          </div>
          
          <Tabs defaultValue="all" onValueChange={handleTypeChange} className="w-full max-w-3xl mx-auto">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="buy">Achat</TabsTrigger>
              <TabsTrigger value="sell">Vente</TabsTrigger>
              <TabsTrigger value="service">Services</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {user ? (
            <PublishButton />
          ) : (
            <div className="bg-secondary/30 rounded-lg p-4 mb-10 max-w-lg mx-auto">
              <p className="text-sm">
                Vous souhaitez publier une annonce ? <a href="/register" className="text-primary font-medium hover:underline">Créez un compte gratuit</a> pour commencer.
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClassifieds.map(classified => (
            <Card key={classified.id} className={cn("overflow-hidden", classified.isPremium && "border-2 border-primary")}>
              {classified.images && classified.images.length > 0 && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={classified.images[0]} 
                    alt={classified.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader className={cn("pb-2", !classified.images && "pt-6")}>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getTypeBadgeColor(classified.type)}>
                    {getTypeLabel(classified.type)}
                  </Badge>
                  {classified.isPremium && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      Premium
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-xl">{classified.title}</CardTitle>
                
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <CardDescription>{classified.location}</CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {classified.description}
                </p>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-gray-50">
                    <Tag className="h-3 w-3 mr-1" />
                    {getCategoryLabel(classified.category)}
                  </Badge>
                  
                  {classified.price && (
                    <Badge variant="secondary" className="font-semibold">
                      {classified.price}
                    </Badge>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-2 flex justify-between items-center">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(classified.date).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </div>
                
                <Button variant="default">Voir l'annonce</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredClassifieds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune annonce ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default ClassifiedsPage;
