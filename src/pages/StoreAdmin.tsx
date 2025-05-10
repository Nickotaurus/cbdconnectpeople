
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { BarChart4, Users } from "lucide-react";
import { getStoreById } from "@/utils/data";
import { Store } from "@/types/store";
import { StoreData } from "@/types/store-types";
import { toast } from "@/hooks/use-toast";
import { useStoreFavoritePartners } from "@/hooks/useStoreFavoritePartners";
import StoreDashboardTab from "@/components/store-admin/StoreDashboardTab";
import StorePartnersTab from "@/components/store-admin/StorePartnersTab";
import StoreLoadingState from "@/components/store-admin/StoreLoadingState";
import StoreErrorState from "@/components/store-admin/StoreErrorState";
import StoreEditForm from "@/components/store-admin/StoreEditForm";

const StoreAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const initialTab = searchParams.get('tab') || "dashboard";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const { favoritePartners, isLoadingPartners } = useStoreFavoritePartners(user?.id);
  
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
          setStore({
            ...localStore,
            favoritePartnersCount: favoritePartners.length
          });
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
        const adaptedStore: Store = {
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
          openingHours: storeData.opening_hours || [],
          products: [],
          favoritePartnersCount: favoritePartners.length
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
  }, [id, user, navigate, favoritePartners.length]);

  // Conversion de la boutique au format StoreData pour le formulaire d'édition
  const convertStoreToStoreData = (): StoreData => {
    if (!store) return {} as StoreData;
    
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
      setStore(prevStore => {
        if (!prevStore) return updatedStore;
        return { ...prevStore, ...updatedStore };
      });
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
  
  if (loading) {
    return <StoreLoadingState />;
  }
  
  if (error || !store) {
    return <StoreErrorState error={error} />;
  }
  
  // Si on est en mode édition, afficher le formulaire StoreForm
  if (isEditMode) {
    return (
      <StoreEditForm 
        id={id}
        store={store}
        onCancel={() => setIsEditMode(false)}
        onSuccess={handleStoreUpdate}
        convertStoreToStoreData={convertStoreToStoreData}
      />
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
          <StoreDashboardTab store={store} onEditClick={() => setIsEditMode(true)} />
        </TabsContent>
        
        <TabsContent value="partners" className="space-y-6">
          <StorePartnersTab 
            favoritePartners={favoritePartners}
            isLoadingPartners={isLoadingPartners}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreAdmin;
