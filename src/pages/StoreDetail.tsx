
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, MapPin, Globe, Phone, Clock, Bookmark, 
  Share2, Heart, Calendar, Settings 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import CouponCard from '@/components/CouponCard';
import ReviewSection from '@/components/ReviewSection';
import AdBanner from '@/components/AdBanner';
import { getStoreById } from '@/utils/data';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ClientUser } from '@/types/auth';

const StoreDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState(id ? getStoreById(id) : null);
  const [activeTab, setActiveTab] = useState("info");
  const { user, updateUserPreferences } = useAuth();
  const clientUser = user as ClientUser;
  
  // Check if store is in user's favorites
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
    
    // Check if it's in favorites
    if (user && user.role === 'client' && store) {
      setIsFavorite((clientUser?.favorites || []).includes(store.id));
    }
    
    // Scroll to top when component loads
    window.scrollTo(0, 0);
  }, [id, navigate, store, user, clientUser?.favorites]);
  
  if (!store) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Chargement en cours...</p>
        </div>
      </div>
    );
  }
  
  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des favoris.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (user.role !== 'client') {
      toast({
        title: "Action non disponible",
        description: "Seuls les clients peuvent ajouter des favoris.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const updatedFavorites = isFavorite
        ? (clientUser.favorites || []).filter(favId => favId !== store.id)
        : [...(clientUser.favorites || []), store.id];
      
      await updateUserPreferences({ favorites: updatedFavorites });
      setIsFavorite(!isFavorite);
      
      toast({
        title: isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
        description: isFavorite 
          ? `${store.name} a été retiré de vos favoris.` 
          : `${store.name} a été ajouté à vos favoris.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos favoris.",
        variant: "destructive",
      });
    }
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

  const handleGoogleReview = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté en tant que client pour noter cette boutique.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (user.role !== 'client') {
      toast({
        title: "Action non disponible",
        description: "Seuls les clients peuvent laisser des avis.",
        variant: "destructive",
      });
      return;
    }
    
    // Google review URL - in real world would be dynamic based on actual Google Place ID
    const googleReviewUrl = `https://search.google.com/local/writereview?placeid=${encodeURIComponent(`place_id_for_${store.name.replace(/\s+/g, '_').toLowerCase()}`)}`;
    
    // Open Google review in a new tab
    window.open(googleReviewUrl, '_blank');
    
    toast({
      title: "Action enregistrée",
      description: "Merci de contribuer. Cette action compte pour vos quêtes !",
    });
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
            className={`bg-background/80 backdrop-blur-sm ${isFavorite ? 'border-destructive' : ''}`}
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
          <Button
            variant="outline"
            size="icon"
            className="bg-background/80 backdrop-blur-sm"
            asChild
          >
            <Link to={`/store/${store.id}/admin`}>
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Store info */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-background rounded-lg shadow-lg p-6 animate-fade-up">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold">{store.name}</h1>
                {store.isPremium && (
                  <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                    Premium
                  </Badge>
                )}
              </div>
              
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
              {user && user.role === 'client' && (
                <Button 
                  variant={isFavorite ? "outline" : "default"}
                  onClick={toggleFavorite}
                  className={`w-full md:w-auto ${isFavorite ? 'border-destructive text-destructive' : ''}`}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-destructive' : ''}`} />
                  {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </Button>
              )}
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
              <Button 
                variant="secondary" 
                onClick={handleGoogleReview} 
                className="w-full md:w-auto"
              >
                <Star className="mr-2 h-4 w-4" />
                Laisser un avis Google
              </Button>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Only show this ad banner for non-premium stores sometimes */}
          {!store.isPremium && Math.random() > 0.5 && (
            <AdBanner
              title="Cette boutique pourrait être mise en avant"
              description="Les boutiques premium apparaissent en haut des résultats de recherche et bénéficient d'une meilleure visibilité."
              imageUrl="https://images.unsplash.com/photo-1603726623530-8a99ef1f1d93?q=80&w=1000"
              storeName="CBD Bordeaux"
              ctaText="Voir l'offre premium"
            />
          )}
          
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
                  isAffiliate={store.coupon.isAffiliate}
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
