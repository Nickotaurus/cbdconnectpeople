
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon, ChevronDown, ShoppingBag, Ticket, BarChart4, CreditCard, Pencil, Save } from "lucide-react";
import CouponCard from "@/components/CouponCard";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { getStoreById } from "@/utils/data";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import StoreForm from "@/components/StoreForm";
import { Store } from "@/types/store";
import { StoreData } from "@/types/store-types";

const StoreAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const initialTab = searchParams.get('tab') || "dashboard";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [couponForm, setCouponForm] = useState({
    code: "",
    discount: "",
    validUntil: new Date(),
    isAffiliate: false
  });
  
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const loadStore = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!id) {
          // Si id n'est pas présent, essayons de récupérer depuis sessionStorage
          const sessionStoreId = sessionStorage.getItem('userStoreId');
          if (sessionStoreId) {
            navigate(`/store/${sessionStoreId}/admin`, { replace: true });
            return;
          }
          
          // Si on a un utilisateur connecté, recherchons sa boutique
          if (user?.id) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('store_id')
              .eq('id', user.id)
              .single();
              
            if (profileError && profileError.code !== 'PGRST116') {
              throw new Error("Impossible de récupérer votre profil.");
            }
            
            if (profileData?.store_id) {
              navigate(`/store/${profileData.store_id}/admin`, { replace: true });
              return;
            }
            
            // Vérifier les boutiques associées à cet utilisateur
            const { data: storeData, error: storeError } = await supabase
              .from('stores')
              .select('id')
              .eq('user_id', user.id)
              .limit(1)
              .single();
              
            if (storeError && storeError.code !== 'PGRST116') {
              throw new Error("Impossible de rechercher vos boutiques.");
            }
            
            if (storeData) {
              navigate(`/store/${storeData.id}/admin`, { replace: true });
              return;
            }
            
            throw new Error("Vous n'avez pas encore créé de boutique.");
          }
          
          throw new Error("Identifiant de boutique manquant");
        }
        
        // Essayer d'abord la méthode locale pour les anciennes données
        const localStore = getStoreById(id);
        if (localStore) {
          setStore(localStore);
          setLoading(false);
          return;
        }
        
        // Ensuite, essayons Supabase
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('id', id)
          .single();
          
        if (storeError) {
          throw new Error("Boutique non trouvée dans la base de données.");
        }
        
        // Adapter au format attendu par l'interface
        const adaptedStore = {
          id: storeData.id,
          name: storeData.name,
          address: storeData.address,
          city: storeData.city,
          postalCode: storeData.postal_code,
          latitude: storeData.latitude,
          longitude: storeData.longitude,
          phone: storeData.phone || '',
          website: storeData.website || '',
          description: storeData.description || '',
          imageUrl: storeData.photo_url || '',
          logo_url: storeData.logo_url || '',
          photo_url: storeData.photo_url || '',
          rating: 0,
          reviewCount: 0,
          placeId: storeData.google_place_id || '',
          isPremium: storeData.is_premium || false,
          premiumUntil: storeData.premium_until,
          isEcommerce: storeData.is_ecommerce || false,
          ecommerceUrl: storeData.ecommerce_url || '',
          hasGoogleBusinessProfile: storeData.has_google_profile || false,
          coupon: {
            code: `WELCOME${Math.floor(Math.random() * 1000)}`,
            discount: "10% sur tout le magasin",
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            usageCount: 0,
            isAffiliate: false
          },
          reviews: [],
          openingHours: storeData.opening_hours || []
        };
        
        setStore(adaptedStore);
      } catch (err) {
        console.error("Erreur lors du chargement de la boutique:", err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };
    
    loadStore();
  }, [id, user, navigate]);
  
  // Conversion de la boutique au format StoreData pour le formulaire d'édition
  const convertStoreToStoreData = (): StoreData => {
    return {
      name: store.name,
      address: store.address,
      city: store.city,
      postalCode: store.postalCode,
      latitude: store.latitude,
      longitude: store.longitude,
      placeId: store.placeId || '',
      phone: store.phone || '',
      website: store.website || '',
      rating: store.rating || 0,
      totalReviews: store.reviewCount || 0,
      description: store.description || '',
      logo_url: store.logo_url || '',
      photo_url: store.photo_url || '',
      is_ecommerce: store.isEcommerce || false,
      ecommerce_url: store.ecommerceUrl || '',
      has_google_profile: store.hasGoogleBusinessProfile || false,
      openingHours: store.openingHours || []
    };
  };

  const handleStoreUpdate = async (updatedStore: Store) => {
    try {
      // Mise à jour de la boutique dans Supabase
      const { error: updateError } = await supabase
        .from('stores')
        .update({
          name: updatedStore.name,
          address: updatedStore.address,
          city: updatedStore.city,
          postal_code: updatedStore.postalCode,
          latitude: updatedStore.latitude,
          longitude: updatedStore.longitude,
          phone: updatedStore.phone,
          website: updatedStore.website,
          description: updatedStore.description,
          logo_url: updatedStore.logo_url,
          photo_url: updatedStore.photo_url,
          google_place_id: updatedStore.placeId,
          is_ecommerce: updatedStore.isEcommerce,
          ecommerce_url: updatedStore.ecommerceUrl,
          has_google_profile: updatedStore.hasGoogleBusinessProfile
        })
        .eq('id', id);
        
      if (updateError) {
        throw new Error(`Erreur lors de la mise à jour: ${updateError.message}`);
      }
      
      // Mise à jour du store local
      setStore({...store, ...updatedStore});
      setIsEditMode(false);
      
      toast({
        title: "Succès",
        description: "Les informations de la boutique ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la boutique:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour",
        variant: "destructive"
      });
    }
  };
  
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Coupon créé",
      description: `Le coupon ${couponForm.code} a été créé avec succès.`,
    });
  };
  
  const handleCreateAd = () => {
    toast({
      title: "Campagne publicitaire",
      description: "Votre demande de campagne publicitaire a été enregistrée.",
    });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-r-transparent rounded-full"></div>
        <span className="ml-4 text-lg">Chargement de votre boutique...</span>
      </div>
    );
  }
  
  if (error || !store) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Espace boutique</h1>
        <Card>
          <CardHeader>
            <CardTitle>Boutique non trouvée</CardTitle>
            <CardDescription>
              {error || "Cette boutique n'existe pas ou vous n'avez pas les permissions nécessaires."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild>
              <Link to="/">Retour à l'accueil</Link>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/add-store')}
            >
              Créer une boutique
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Si on est en mode édition, afficher le formulaire StoreForm
  if (isEditMode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Modifier votre boutique</CardTitle>
              <CardDescription>Modifiez les informations de votre boutique</CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsEditMode(false)}
            >
              Annuler
            </Button>
          </CardHeader>
          <CardContent>
            <StoreForm 
              isEdit={true} 
              storeId={id}
              onSuccess={handleStoreUpdate}
              initialStoreData={convertStoreToStoreData()}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Espace boutique</h1>
      <p className="text-muted-foreground mb-6">Gérez votre boutique {store.name}</p>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="dashboard">
            <BarChart4 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Tableau de bord</span>
          </TabsTrigger>
          <TabsTrigger value="coupons">
            <Ticket className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Coupons</span>
          </TabsTrigger>
          <TabsTrigger value="premium">
            <ShoppingBag className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Premium</span>
          </TabsTrigger>
          <TabsTrigger value="ads">
            <CreditCard className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Publicité</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Informations de votre boutique</CardTitle>
                <CardDescription>
                  Gérez les informations principales de votre boutique
                </CardDescription>
              </div>
              <Button onClick={() => setIsEditMode(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="bg-secondary rounded-lg p-4">
                    <h3 className="font-medium mb-2">Visites ce mois</h3>
                    <p className="text-2xl font-bold">238</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4">
                    <h3 className="font-medium mb-2">Utilisation des coupons</h3>
                    <p className="text-2xl font-bold">{store.coupon?.usageCount || 0}</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4">
                    <h3 className="font-medium mb-2">Statut</h3>
                    <p className="text-2xl font-bold">{store.isPremium ? "Premium" : "Basique"}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Informations générales</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-muted-foreground text-sm">Nom</p>
                        <p className="font-medium">{store.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Adresse</p>
                        <p className="font-medium">{store.address}</p>
                        <p className="font-medium">{store.postalCode} {store.city}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Téléphone</p>
                        <p className="font-medium">{store.phone || "Non renseigné"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Site web</p>
                        <p className="font-medium">{store.website || "Non renseigné"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Intégration Google</h3>
                    {store.hasGoogleBusinessProfile ? (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center mb-2">
                          <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <p className="font-medium text-green-800">Profil Google Business connecté</p>
                        </div>
                        <p className="text-green-700 text-sm">Vos clients peuvent voir votre boutique sur Google Maps et Google Search.</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-3"
                          onClick={() => setIsEditMode(true)}
                        >
                          Mettre à jour les informations
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <div className="flex items-center mb-2">
                          <svg className="h-5 w-5 text-amber-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <p className="font-medium text-amber-800">Profil Google Business non connecté</p>
                        </div>
                        <p className="text-amber-700 text-sm">Connectez votre profil Google Business pour améliorer votre visibilité.</p>
                        <Button 
                          className="mt-3"
                          onClick={() => setIsEditMode(true)}
                        >
                          Connecter Google Business
                        </Button>
                      </div>
                    )}

                    {store.isEcommerce ? (
                      <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center mb-2">
                          <svg className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                          </svg>
                          <p className="font-medium text-blue-800">Boutique E-commerce activée</p>
                        </div>
                        <p className="text-blue-700 text-sm">URL: {store.ecommerceUrl || "Non renseignée"}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
                
                {store.description && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-gray-700">{store.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="coupons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gérer vos coupons</CardTitle>
              <CardDescription>
                Créez et suivez vos coupons de réduction pour attirer de nouveaux clients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">Coupon actif</h3>
                  <CouponCard 
                    code={store.coupon?.code || "WELCOME123"}
                    discount={store.coupon?.discount || "10% sur tout le magasin"}
                    validUntil={store.coupon?.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    storeName={store.name}
                    usageCount={store.coupon?.usageCount || 0}
                    isAffiliate={store.coupon?.isAffiliate || false}
                    showStats={true}
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Créer un nouveau coupon</h3>
                  <form onSubmit={handleCouponSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">Code</Label>
                      <Input 
                        id="code" 
                        placeholder="Ex: WELCOME10" 
                        value={couponForm.code}
                        onChange={e => setCouponForm({...couponForm, code: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discount">Réduction</Label>
                      <Input 
                        id="discount" 
                        placeholder="Ex: 10% sur tout le magasin" 
                        value={couponForm.discount}
                        onChange={e => setCouponForm({...couponForm, discount: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Date d'expiration</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isAffiliate"
                        className="h-4 w-4"
                        checked={couponForm.isAffiliate}
                        onChange={e => setCouponForm({...couponForm, isAffiliate: e.target.checked})}
                      />
                      <Label htmlFor="isAffiliate" className="font-normal">Coupon affilié (avec commission)</Label>
                    </div>
                    
                    <Button type="submit" className="w-full">Créer un coupon</Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="premium" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Offres premium</CardTitle>
              <CardDescription>
                Démarquez-vous de la concurrence avec nos offres premium.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Votre abonnement actuel</h3>
                <div className="p-4 rounded-md bg-secondary">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {store.isPremium ? "Plan Premium" : "Plan Basique"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {store.isPremium
                          ? `Valide jusqu'au ${store.premiumUntil}`
                          : "Fonctionnalités limitées"}
                      </p>
                    </div>
                    {store.isPremium ? (
                      <Button variant="outline" size="sm">Gérer</Button>
                    ) : (
                      <Button size="sm" onClick={() => setActiveTab("premium")}>Passer au Premium</Button>
                    )}
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-4">Nos offres</h3>
              <SubscriptionPlans className="mt-4" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campagnes publicitaires</CardTitle>
              <CardDescription>
                Créez des campagnes publicitaires ciblées pour augmenter votre visibilité.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Créer une nouvelle campagne</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="adTitle">Titre de l'annonce</Label>
                      <Input id="adTitle" placeholder="Ex: Nouvelle collection CBD" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="adDescription">Description</Label>
                      <Textarea 
                        id="adDescription" 
                        placeholder="Décrivez votre offre en quelques mots..." 
                        className="resize-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget</Label>
                        <div className="relative">
                          <Input id="budget" type="number" placeholder="0" min="10" />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-muted-foreground">€</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="duration">Durée</Label>
                        <div className="relative">
                          <select
                            id="duration"
                            className={cn(
                              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm appearance-none"
                            )}
                          >
                            <option value="7">7 jours</option>
                            <option value="15">15 jours</option>
                            <option value="30">30 jours</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={handleCreateAd} className="w-full">
                      Lancer la campagne
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Campagnes actives</h3>
                  <div className="text-center py-8 bg-secondary/50 rounded-md">
                    <p className="text-muted-foreground">
                      Vous n'avez aucune campagne active en ce moment.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreAdmin;

