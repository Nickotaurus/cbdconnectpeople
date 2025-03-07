
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, MapPin, Globe, Phone, Clock, Bookmark, 
  Share2, Heart, Calendar 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import CouponCard from '@/components/CouponCard';
import ReviewSection from '@/components/ReviewSection';
import { getStoreById } from '@/utils/data';
import { toast } from '@/hooks/use-toast';

const StoreDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState(id ? getStoreById(id) : null);
  const [activeTab, setActiveTab] = useState("info");
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Animation classes for elements
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    if (!store) {
      // No store found, redirect to home
      toast({
        title: "Boutique introuvable",
        description: "Cette boutique n'existe pas ou a été supprimée.",
        variant: "destructive",
      });
      navigate("/");
    }
    
    // Check if it's in favorites (would use localStorage in a real app)
    setIsFavorite(false);
    
    // Scroll to top when component loads
    window.scrollTo(0, 0);
  }, [id, navigate, store]);
  
  if (!store) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Chargement en cours...</p>
        </div>
      </div>
    );
  }
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
      description: isFavorite 
        ? `${store.name} a été retiré de vos favoris.` 
        : `${store.name} a été ajouté à vos favoris.`
    });
  };
  
  const shareStore = () => {
    if (navigator.share) {
      navigator.share({
        title: store.name,
        text: `Découvrez ${store.name} sur CBD Boutique Finder`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "L'adresse de cette boutique a été copiée dans votre presse-papier."
      });
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="relative h-64 md:h-96 overflow-hidden">
        {/* Background image */}
        <div 
          className={`absolute inset-0 bg-sage-200 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`}
        />
        <img 
          src={store.imageUrl} 
          alt={store.name} 
          className="w-full h-full object-cover" 
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent"></div>
        
        {/* Back button */}
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm z-10" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-background/80 backdrop-blur-sm"
            onClick={toggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-background/80 backdrop-blur-sm"
            onClick={shareStore}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Store info */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-background rounded-lg shadow-lg p-6 animate-fade-up">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{store.name}</h1>
              
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium">{store.rating}</span>
                </div>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-muted-foreground">{store.reviewCount} avis</span>
              </div>
              
              <div className="flex items-center mt-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{store.address}, {store.postalCode} {store.city}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mt-4 md:mt-0">
              <Button className="w-full md:w-auto">
                <MapPin className="mr-2 h-4 w-4" />
                Itinéraire
              </Button>
              <Button variant="outline" asChild className="w-full md:w-auto">
                <a href={`tel:${store.phone}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Appeler
                </a>
              </Button>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <Tabs defaultValue="info" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="info">
                <Globe className="h-4 w-4 mr-2" />
                Informations
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <Star className="h-4 w-4 mr-2" />
                Avis
              </TabsTrigger>
              <TabsTrigger value="coupon">
                <Bookmark className="h-4 w-4 mr-2" />
                Coupon
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="animate-fade-in">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">À propos</h3>
                  <p className="text-muted-foreground">{store.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Horaires d'ouverture</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {store.openingHours.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{item.day}</span>
                        </div>
                        <span className="font-medium">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Produits proposés</h3>
                  <div className="space-y-3">
                    {store.products.map((product, index) => (
                      <div key={index} className="bg-secondary p-3 rounded-md">
                        <div className="font-medium">{product.category}</div>
                        <div className="text-sm text-muted-foreground flex justify-between">
                          <span>Origine: {product.origin}</span>
                          <span>Qualité: {product.quality}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Coordonnées</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a 
                        href={store.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {store.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`tel:${store.phone}`} className="hover:underline">
                        {store.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="animate-fade-in">
              <ReviewSection reviews={store.reviews} />
            </TabsContent>
            
            <TabsContent value="coupon" className="animate-fade-in">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-4 text-center">Coupon de réduction exclusif</h3>
                <CouponCard 
                  code={store.coupon.code} 
                  discount={store.coupon.discount} 
                  validUntil={store.coupon.validUntil}
                  storeName={store.name}
                />
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Présentez ce coupon en boutique ou utilisez le code lors de vos achats en ligne pour profiter de la réduction.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;
