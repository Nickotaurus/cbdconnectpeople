
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star } from 'lucide-react';
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
          </div>
        </div>
      </section>
      
      {/* Nearby Stores Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Boutiques à proximité</h2>
            <Button variant="outline" asChild>
              <Link to="/map">
                <MapPin className="mr-2 h-4 w-4" />
                Voir la carte
              </Link>
            </Button>
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
                <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 10.5L11 12.5L15.5 8M20.8 13.8007L15.7471 20.3691C15.4713 20.7244 15.0835 20.9897 14.641 21.1232C14.1986 21.2566 13.7235 21.2519 13.2839 21.1097L7.53151 19.0503C7.25406 18.9624 6.99406 18.8281 6.76039 18.6533L3.86039 16.6533C3.33233 16.2876 3.00015 15.7017 3.00015 15.0796V7.00031C3.00015 6.20496 3.47926 5.4922 4.20732 5.20064L8.20732 3.70064C8.67216 3.50579 9.18857 3.49921 9.65921 3.68304L20.241 8.23767C20.9755 8.56858 21.3178 9.40073 20.9868 10.1353C20.9032 10.3218 20.7823 10.4897 20.6309 10.6295L19.22 11.9288" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Coupons exclusifs</h3>
              <p className="text-muted-foreground">
                Bénéficiez de réductions exclusives dans toutes les boutiques partenaires
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
