
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Globe, Star, Bookmark } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import CouponCard from '@/components/CouponCard';
import ReviewSection from '@/components/ReviewSection';
import AdBanner from '@/components/AdBanner';
import { getStoreById } from '@/utils/data';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { ClientUser } from '@/types/auth';
import StoreHeader from '@/components/store-detail/StoreHeader';
import StoreInfo from '@/components/store-detail/StoreInfo';
import StoreActions from '@/components/store-detail/StoreActions';
import StoreInfoTab from '@/components/store-detail/StoreInfoTab';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PartyPopper } from "lucide-react";

const StoreDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState(id ? getStoreById(id) : null);
  const [activeTab, setActiveTab] = useState("info");
  const { user, updateUserPreferences } = useAuth();
  const clientUser = user as ClientUser;
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Check if store is in user's favorites
  const [isFavorite, setIsFavorite] = useState(false);
  
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
    
    // Show welcome message for newly added stores
    const isNewlyAdded = sessionStorage.getItem('newlyAddedStore') === id;
    if (isNewlyAdded) {
      setShowWelcome(true);
      sessionStorage.removeItem('newlyAddedStore');
    }
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

  return (
    <div className="min-h-screen pb-12">
      <StoreHeader 
        store={store} 
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
      />
      
      {/* Store info */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-background rounded-lg shadow-lg p-6 animate-fade-up">
          {showWelcome && (
            <Alert className="bg-green-50 border-green-200 mb-6">
              <PartyPopper className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-700">Bravo et bienvenue dans le réseau !</AlertTitle>
              <AlertDescription className="text-green-600">
                En rejoignant la plateforme, vous faites un pas concret vers plus de visibilité, 
                de connexions utiles et d'entraide entre pros du CBD. Ensemble, on va plus loin.
              </AlertDescription>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => setShowWelcome(false)}
              >
                J'ai compris
              </Button>
            </Alert>
          )}
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <StoreInfo store={store} />
            <StoreActions 
              store={store} 
              isFavorite={isFavorite} 
              toggleFavorite={toggleFavorite}
            />
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
              <StoreInfoTab store={store} />
            </TabsContent>
            
            <TabsContent value="reviews" className="animate-fade-in">
              <ReviewSection reviews={store.reviews} />
            </TabsContent>
            
            <TabsContent value="coupon" className="animate-fade-in">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-4 text-center">Coupon de réduction exclusif</h3>
                <CouponCard 
                  code={store.coupon?.code || "WELCOME10"} 
                  discount={store.coupon?.discount || "10%"} 
                  validUntil={store.coupon?.validUntil || "2023-12-31"}
                  storeName={store.name}
                  isAffiliate={store.coupon?.isAffiliate || false}
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
