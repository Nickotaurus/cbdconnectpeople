import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight, Star, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Map from '@/components/Map';
import StoreCard from '@/components/StoreCard';
import { 
  getStoresByDistance, 
  filterUserLocation, 
  Store,
  calculateDistance
} from '@/utils/data';

const MapView = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(filterUserLocation());
  const [stores, setStores] = useState(getStoresByDistance(userLocation.latitude, userLocation.longitude));
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setStores(getStoresByDistance(latitude, longitude));
        },
        (error) => {
          console.log('Geolocation error:', error);
          setUserLocation(filterUserLocation());
        }
      );
    }
  }, []);
  
  const filteredStores = searchTerm
    ? stores.filter(store => 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : stores;
    
  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
  };
  
  const handleStoreDetail = (store: Store) => {
    navigate(`/store/${store.id}`);
  };
  
  const clearSelection = () => {
    setSelectedStore(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher une boutique..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button 
            variant="default" 
            size="sm"
            className="gap-1"
            onClick={() => navigate('/add-store')}
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter une boutique</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Filtrer les résultats</h3>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Catégories de produits</h4>
                    <div className="space-y-2">
                      {['Fleurs CBD', 'Huiles CBD', 'Cosmétiques', 'Infusions', 'Résines'].map((category) => (
                        <div key={category} className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={category} 
                            className="h-4 w-4 rounded text-primary focus:ring-primary"
                          />
                          <label htmlFor={category} className="ml-2 text-sm">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Note minimum</h4>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button 
                          key={rating}
                          className="h-8 w-8 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80"
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Distance maximale</h4>
                    <div className="space-y-2">
                      {['< 1 km', '< 5 km', '< 10 km', '< 20 km', 'Toutes les distances'].map((distance) => (
                        <div key={distance} className="flex items-center">
                          <input 
                            type="radio" 
                            id={distance} 
                            name="distance"
                            className="h-4 w-4 rounded-full text-primary focus:ring-primary"
                          />
                          <label htmlFor={distance} className="ml-2 text-sm">
                            {distance}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 space-x-2 flex justify-between">
                  <Button variant="outline" className="flex-1">
                    Réinitialiser
                  </Button>
                  <SheetClose asChild>
                    <Button className="flex-1">
                      Appliquer
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-3/5 h-1/2 md:h-full order-2 md:order-1 p-4">
          <Map 
            stores={filteredStores} 
            onSelectStore={handleSelectStore} 
            selectedStoreId={selectedStore?.id}
          />
        </div>
        
        <div className="w-full md:w-2/5 h-1/2 md:h-full order-1 md:order-2 overflow-y-auto p-4 bg-secondary/50">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              {selectedStore 
                ? 'Boutique sélectionnée' 
                : filteredStores.length > 0 
                  ? `${filteredStores.length} boutiques trouvées` 
                  : 'Aucune boutique trouvée'
              }
            </h2>
            {selectedStore && (
              <Button variant="link" onClick={clearSelection} className="p-0 h-auto text-sm">
                Voir toutes les boutiques
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {selectedStore ? (
              <div className="animate-fade-in">
                <div className="bg-background rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedStore.name}</h3>
                      <p className="text-muted-foreground text-sm">{selectedStore.address}, {selectedStore.city}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7"
                      onClick={() => handleStoreDetail(selectedStore)}
                    >
                      Détails
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-primary" />
                      {selectedStore.rating}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {selectedStore.reviewCount} avis
                    </span>
                  </div>
                  
                  <p className="text-sm mb-3 line-clamp-2">
                    {selectedStore.description}
                  </p>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Produits proposés</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedStore.products.map((product, index) => (
                        <span 
                          key={index} 
                          className="bg-secondary px-2 py-0.5 rounded text-xs"
                        >
                          {product.category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              filteredStores.map(store => (
                <div 
                  key={store.id} 
                  className="cursor-pointer"
                  onClick={() => handleSelectStore(store)}
                >
                  <StoreCard 
                    store={store} 
                    distance={calculateDistance(
                      userLocation.latitude, 
                      userLocation.longitude, 
                      store.latitude, 
                      store.longitude
                    )}
                  />
                </div>
              ))
            )}
            
            {filteredStores.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? `Aucune boutique trouvée pour "${searchTerm}"`
                    : 'Aucune boutique trouvée dans cette zone'}
                </p>
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setSearchTerm('')}
                  >
                    Réinitialiser la recherche
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
