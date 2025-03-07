
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StoreCard from '@/components/StoreCard';
import { getStoresByDistance, filterUserLocation, calculateDistance } from '@/utils/data';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(filterUserLocation());
  const [nearbyStores, setNearbyStores] = useState(getStoresByDistance(userLocation.latitude, userLocation.longitude));
  
  useEffect(() => {
    // Try to get the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setNearbyStores(getStoresByDistance(latitude, longitude));
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Use default location (handled by filterUserLocation)
        }
      );
    }
  }, []);
  
  const filteredStores = searchTerm
    ? nearbyStores.filter(store => 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : nearbyStores;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-100 to-sage-200 -z-10" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1503262028195-93c528f03218')] bg-cover bg-center -z-10" />
        
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-block mb-4 animate-fade-in">
              <div className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Trouvez facilement les boutiques CBD près de chez vous
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-up">
              Découvrez les meilleures boutiques CBD en France
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Localisez les boutiques CBD, consultez les avis clients et bénéficiez de coupons de réduction exclusifs
            </p>
            
            <div className="relative max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative flex items-center">
                <Search className="absolute left-3 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Rechercher par nom ou ville..."
                  className="pl-10 pr-24 h-12 rounded-full shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button className="absolute right-1 rounded-full" size="sm">
                  Rechercher
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                <Link to="/map">
                  <MapPin className="mr-2 h-5 w-5" />
                  Voir la carte
                </Link>
              </Button>
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link to="/ranking">
                  <Award className="mr-2 h-5 w-5" />
                  Voir le classement
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Nearby Stores Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Boutiques à proximité</h2>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/map">
                  <MapPin className="mr-2 h-4 w-4" />
                  Voir la carte
                </Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/ranking">
                  <Award className="mr-2 h-4 w-4" />
                  Classement
                </Link>
              </Button>
            </div>
          </div>
          
          {filteredStores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => (
                <StoreCard 
                  key={store.id} 
                  store={store} 
                  distance={calculateDistance(
                    userLocation.latitude, 
                    userLocation.longitude, 
                    store.latitude, 
                    store.longitude
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {searchTerm ? (
                  <>
                    <p className="text-lg font-medium mb-2">Aucune boutique trouvée</p>
                    <p>Aucun résultat pour "{searchTerm}". Essayez un autre terme.</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium mb-2">Chargement des boutiques...</p>
                    <p>Veuillez patienter pendant que nous recherchons les boutiques à proximité.</p>
                  </>
                )}
              </div>
              <Button 
                className="mt-4" 
                onClick={() => setSearchTerm('')}
                disabled={!searchTerm}
              >
                Réinitialiser la recherche
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Section */}
      <section className="py-12 bg-sage-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-4">Pourquoi utiliser notre application</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez une nouvelle façon de trouver et profiter des boutiques CBD partout en France
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6 shadow-sm flex flex-col items-center text-center transition-transform hover:translate-y-[-5px]">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Géolocalisation</h3>
              <p className="text-muted-foreground">
                Trouvez facilement les boutiques CBD les plus proches de votre position
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm flex flex-col items-center text-center transition-transform hover:translate-y-[-5px]">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Avis vérifiés</h3>
              <p className="text-muted-foreground">
                Consultez les avis clients classés par catégories pour faire le meilleur choix
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm flex flex-col items-center text-center transition-transform hover:translate-y-[-5px]">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Classement</h3>
              <p className="text-muted-foreground">
                Découvrez les meilleures boutiques CBD de France classées par catégories
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
