import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, Filter, ArrowUpDown, 
  Award, Check, ChevronDown, ChevronsUpDown, 
  Flower, Droplet
} from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import StoreCard from '@/components/StoreCard';
import RatingBreakdown from '@/components/RatingBreakdown';
import { Store } from '@/types/store';
import { 
  getStoresByDistance, 
  filterUserLocation, 
  calculateDistance,
} from '@/utils/data';

type SortOptions = 'rating' | 'flowers' | 'oils' | 'experience' | 'originality' | 'distance';
type FilterOptions = {
  onlyPremium: boolean;
  onlyCoupons: boolean;
  minRating: number;
};

const Ranking = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOptions>('rating');
  const [userLocation, setUserLocation] = useState(filterUserLocation());
  const [allStores, setAllStores] = useState(getStoresByDistance(userLocation.latitude, userLocation.longitude));
  const [displayedStores, setDisplayedStores] = useState<Store[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    onlyPremium: false,
    onlyCoupons: true,
    minRating: 0,
  });
  const [isNational, setIsNational] = useState(true);
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setAllStores(getStoresByDistance(latitude, longitude));
        },
        (error) => {
          console.log('Geolocation error:', error);
          setUserLocation(filterUserLocation());
        }
      );
    }
  }, []);
  
  useEffect(() => {
    let filteredStores = [...allStores];
    
    if (searchTerm) {
      filteredStores = filteredStores.filter(store => 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filters.onlyPremium) {
      filteredStores = filteredStores.filter(store => store.isPremium);
    }
    
    if (filters.onlyCoupons) {
      filteredStores = filteredStores.filter(store => store.coupon && store.coupon.code);
    }
    
    if (filters.minRating > 0) {
      filteredStores = filteredStores.filter(store => store.rating >= filters.minRating);
    }
    
    if (!isNational) {
      filteredStores = filteredStores.slice(0, 20);
    }
    
    filteredStores.sort((a, b) => {
      if (sortBy === 'distance') {
        const distA = calculateDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
        const distB = calculateDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
        return distA - distB;
      }
      
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      
      const getCategoryRating = (store: Store, category: string) => {
        const reviews = store.reviews.filter(review => review.category === category);
        if (reviews.length === 0) return 0;
        return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      };
      
      const aRating = getCategoryRating(a, sortBy);
      const bRating = getCategoryRating(b, sortBy);
      
      return bRating - aRating;
    });
    
    if (isNational && filteredStores.length > 10) {
      filteredStores = filteredStores.slice(0, 10);
    }
    
    setDisplayedStores(filteredStores);
  }, [allStores, searchTerm, sortBy, filters, isNational, userLocation]);
  
  const handleSortChange = (value: string) => {
    setSortBy(value as SortOptions);
  };
  
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };
  
  const toggleRankingMode = () => {
    setIsNational(!isNational);
  };
  
  const resetFilters = () => {
    setFilters({
      onlyPremium: false,
      onlyCoupons: false,
      minRating: 0
    });
    setSearchTerm('');
    setSortBy('rating');
  };

  return (
    <div className="min-h-screen pb-12">
      <section className="bg-primary/5 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {isNational ? (
                "Top 10 des boutiques CBD en France"
              ) : (
                "Meilleures boutiques CBD près de chez vous"
              )}
            </h1>
            <p className="text-muted-foreground mb-6">
              Découvrez les meilleures boutiques CBD classées selon les avis clients,
              la qualité des produits et l'expérience en boutique.
            </p>
            
            <div className="flex flex-col md:flex-row md:items-center justify-center gap-3 mb-4">
              <Button 
                variant={isNational ? "default" : "outline"} 
                className="flex-1 md:flex-none"
                onClick={() => setIsNational(true)}
              >
                <Award className="mr-2 h-4 w-4" />
                Classement National
              </Button>
              <Button 
                variant={!isNational ? "default" : "outline"} 
                className="flex-1 md:flex-none"
                onClick={() => setIsNational(false)}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Classement Local
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="w-full md:w-auto">
              <div className="relative">
                <Input
                  placeholder="Rechercher une boutique..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pr-10"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setSearchTerm('')}
                  >
                    ✕
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">Trier par:</span>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choisir un critère" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Note générale</SelectItem>
                    <SelectItem value="flowers">Fleurs CBD</SelectItem>
                    <SelectItem value="oils">Huiles CBD</SelectItem>
                    <SelectItem value="experience">Expérience boutique</SelectItem>
                    <SelectItem value="originality">Originalité</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Options de filtrage</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="flex items-center justify-between cursor-default">
                      <span>Boutiques Premium</span>
                      <Switch 
                        checked={filters.onlyPremium} 
                        onCheckedChange={(v) => handleFilterChange('onlyPremium', v)} 
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center justify-between cursor-default">
                      <span>Avec coupons</span>
                      <Switch 
                        checked={filters.onlyCoupons} 
                        onCheckedChange={(v) => handleFilterChange('onlyCoupons', v)} 
                      />
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Note minimum</DropdownMenuLabel>
                  <DropdownMenuGroup className="px-2 py-1.5">
                    <div className="flex items-center gap-2">
                      {[0, 3, 3.5, 4, 4.5].map((rating) => (
                        <Button
                          key={rating}
                          variant={filters.minRating === rating ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleFilterChange('minRating', rating)}
                          className="h-8 min-w-8 px-2"
                        >
                          {rating > 0 ? rating : 'Tous'}
                        </Button>
                      ))}
                    </div>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={resetFilters}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold">
                {displayedStores.length} boutiques trouvées
              </h2>
              
              <div className="flex flex-wrap gap-2 ml-auto">
                {filters.onlyPremium && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Premium uniquement
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => handleFilterChange('onlyPremium', false)}
                    >
                      ✕
                    </Button>
                  </Badge>
                )}
                
                {filters.onlyCoupons && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Avec coupons
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => handleFilterChange('onlyCoupons', false)}
                    >
                      ✕
                    </Button>
                  </Badge>
                )}
                
                {filters.minRating > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filters.minRating}+ étoiles
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => handleFilterChange('minRating', 0)}
                    >
                      ✕
                    </Button>
                  </Badge>
                )}
                
                {(filters.onlyPremium || filters.onlyCoupons || filters.minRating > 0) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs"
                    onClick={resetFilters}
                  >
                    Effacer tout
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {displayedStores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedStores.map((store, index) => (
                <div key={store.id} className="relative">
                  {isNational && index < 3 && (
                    <div className={`absolute -top-3 -left-3 z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                      index === 0 ? 'bg-yellow-400' : 
                      index === 1 ? 'bg-gray-300' : 
                      'bg-amber-700'
                    }`}>
                      <span className="font-bold text-white">{index + 1}</span>
                    </div>
                  )}
                  
                  <div className="h-full">
                    <StoreCard 
                      store={store} 
                      distance={calculateDistance(
                        userLocation.latitude, 
                        userLocation.longitude, 
                        store.latitude, 
                        store.longitude
                      )}
                    />
                    
                    <div className="mt-3 bg-secondary/50 p-3 rounded-lg">
                      <RatingBreakdown store={store} activeSortBy={sortBy} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucune boutique ne correspond aux critères sélectionnés.
              </p>
              <Button 
                className="mt-4" 
                onClick={resetFilters}
              >
                Réinitialiser tous les filtres
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Ranking;
