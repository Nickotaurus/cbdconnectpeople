
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { BarChart4, Pencil, Users } from "lucide-react";
import { getStoreById } from "@/utils/data";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import StoreForm from "@/components/StoreForm";
import { Store } from "@/types/store";
import { StoreData } from "@/types/store-types";
import { filterPartners } from '@/utils/partnerUtils';
import { Partner } from '@/hooks/usePartners';
import { partnerCategories } from '@/data/partnerCategoriesData';
import { getCategoryLabel, getCategoryIconName } from '@/utils/partnerUtils';
import { PartnerCategory } from '@/types/auth';
import { PartnerIcon } from '@/components/partners/PartnerIcon';

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
  const [favoritePartners, setFavoritePartners] = useState<Partner[]>([]);
  const [isLoadingPartners, setIsLoadingPartners] = useState(false);

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

  // Chargement des partenaires favoris
  useEffect(() => {
    const fetchFavoritePartners = async () => {
      if (!user || !user.id) return;
      
      setIsLoadingPartners(true);
      try {
        // Récupérer les IDs des partenaires favoris de l'utilisateur
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('partner_favorites')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error("Erreur lors de la récupération des favoris:", userError);
          return;
        }

        if (!userData?.partner_favorites || userData.partner_favorites.length === 0) {
          // Aucun partenaire favori
          return;
        }

        // Récupérer les partenaires vérifiés
        const { data: partners, error: partnersError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'partner')
          .eq('is_verified', true);

        if (partnersError) {
          console.error("Erreur lors de la récupération des partenaires:", partnersError);
          return;
        }

        if (partners && partners.length > 0) {
          // Convertir les données des partenaires au format Partner
          const formattedPartners = partners.map(partner => ({
            id: partner.id,
            name: partner.name || 'Partenaire sans nom',
            // Cast string to PartnerCategory to make TypeScript happy
            category: (partner.partner_category || 'other') as PartnerCategory,
            location: partner.partner_favorites?.[3] || 'France',
            description: partner.partner_favorites?.[6] || 'Aucune description',
            certifications: partner.certifications || [],
            distance: Math.floor(Math.random() * 300),
            imageUrl: partner.logo_url || 'https://via.placeholder.com/150'
          }));

          setFavoritePartners(formattedPartners);
        }
      } catch (err) {
        console.error("Erreur inattendue:", err);
      } finally {
        setIsLoadingPartners(false);
      }
    };

    fetchFavoritePartners();
  }, [user]);
  
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
  
  const renderPartnerIcon = (categoryValue: string) => {
    const iconName = getCategoryIconName(categoryValue);
    switch (iconName) {
      case "Building": return <Users className="h-4 w-4 mr-2" />;
      case "Calculator": return <Users className="h-4 w-4 mr-2" />;
      case "Briefcase": return <Users className="h-4 w-4 mr-2" />;
      case "Shield": return <Users className="h-4 w-4 mr-2" />;
      case "Package": return <Users className="h-4 w-4 mr-2" />;
      case "Users": return <Users className="h-4 w-4 mr-2" />;
      case "Tag": return <Users className="h-4 w-4 mr-2" />;
      default: return <Users className="h-4 w-4 mr-2" />;
    }
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
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="dashboard">
            <BarChart4 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Tableau de bord</span>
          </TabsTrigger>
          <TabsTrigger value="partners">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Partenaires favoris</span>
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
                    <h3 className="font-medium mb-2">Partenaires favoris</h3>
                    <p className="text-2xl font-bold">{favoritePartners.length}</p>
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
        
        <TabsContent value="partners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vos partenaires favoris</CardTitle>
              <CardDescription>
                Retrouvez rapidement les partenaires que vous avez marqués comme favoris
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPartners ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full mx-auto mb-4"></div>
                  <p>Chargement de vos partenaires favoris...</p>
                </div>
              ) : favoritePartners.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {favoritePartners.map((partner) => (
                    <div key={partner.id} className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <PartnerIcon category={partner.category} />
                        <div>
                          <h3 className="font-medium">{partner.name}</h3>
                          <p className="text-sm text-muted-foreground">{getCategoryLabel(partner.category)}</p>
                        </div>
                      </div>
                      <p className="text-sm mt-2 line-clamp-2">{partner.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-muted-foreground">{partner.location}</div>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/partners?id=${partner.id}`}>Contacter</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-secondary/50 rounded-md">
                  <p className="text-muted-foreground mb-4">
                    Vous n'avez aucun partenaire favori pour le moment.
                  </p>
                  <Button asChild>
                    <Link to="/partners">Explorer les partenaires</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreAdmin;
