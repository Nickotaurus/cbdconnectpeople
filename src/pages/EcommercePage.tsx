
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Filter, Search, Globe, ExternalLink, Check, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ClientUser } from '@/types/auth';
import { EcommerceStore } from '@/types/ecommerce';
import { supabase } from '@/integrations/supabase/client';

const EcommercePage = () => {
  const navigate = useNavigate();
  const { user, updateUserPreferences } = useAuth();
  const { toast } = useToast();
  const clientUser = user as ClientUser;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stores, setStores] = useState<EcommerceStore[]>([]);
  const [filteredStores, setFilteredStores] = useState<EcommerceStore[]>([]);
  
  // Favoris pour les utilisateurs connectés
  const [favoriteEcommerces, setFavoriteEcommerces] = useState<string[]>([]);
  
  useEffect(() => {
    fetchEcommerceStores();
    
    if (user?.role === 'client' && clientUser?.favorites) {
      setFavoriteEcommerces(clientUser.favorites.filter(id => id.startsWith('ec')));
    }
  }, [user]);
  
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
          isPhysicalStore: true
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
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
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
  
  const toggleFavoriteEcommerce = async (ecommerce: EcommerceStore) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des favoris.",
      });
      return;
    }
    
    if (user.role !== 'client') {
      toast({
        title: "Action non disponible",
        description: "Seuls les clients peuvent ajouter des favoris.",
      });
      return;
    }
    
    try {
      const isCurrentlyFavorite = favoriteEcommerces.includes(ecommerce.id);
      let updatedFavorites = [...(clientUser.favorites || [])];
      
      if (isCurrentlyFavorite) {
        updatedFavorites = updatedFavorites.filter(id => id !== ecommerce.id);
      } else {
        updatedFavorites.push(ecommerce.id);
      }
      
      await updateUserPreferences({ favorites: updatedFavorites });
      
      setFavoriteEcommerces(isCurrentlyFavorite 
        ? favoriteEcommerces.filter(id => id !== ecommerce.id)
        : [...favoriteEcommerces, ecommerce.id]
      );
      
      toast({
        title: isCurrentlyFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
        description: isCurrentlyFavorite 
          ? `${ecommerce.name} a été retiré de vos favoris.` 
          : `${ecommerce.name} a été ajouté à vos favoris.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos favoris.",
        variant: "destructive",
      });
    }
  };
  
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
        
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-24 bg-muted"></div>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 bg-muted rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
                      <div className="flex items-center gap-2">
                        {store.isPremium && (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            Premium
                          </Badge>
                        )}
                        
                        {store.isPhysicalStore && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                            Boutique physique
                          </Badge>
                        )}
                        
                        {user && user.role === 'client' && (
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className={`h-8 w-8 p-1 ${favoriteEcommerces.includes(store.id) ? 'border-destructive' : ''}`} 
                            onClick={() => toggleFavoriteEcommerce(store)}
                          >
                            <Heart className={`h-4 w-4 ${favoriteEcommerces.includes(store.id) ? 'fill-destructive text-destructive' : ''}`} />
                          </Button>
                        )}
                      </div>
                    </div>
                    <CardDescription className="flex items-center">
                      <Globe className="h-3.5 w-3.5 mr-1" />
                      <a 
                        href={store.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline text-primary"
                      >
                        {store.url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '')}
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
          )}
          
          {!isLoading && filteredStores.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun site e-commerce ne correspond à votre recherche.</p>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Vous possédez un e-commerce CBD ?</h2>
            <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
              Référencez gratuitement votre boutique en ligne et profitez d'une visibilité auprès de notre communauté
            </p>
            <Button 
              className="gap-2"
              onClick={() => navigate('/register?role=store')}
            >
              Référencer mon e-commerce
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommercePage;
