
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import StoreForm from '@/components/StoreForm';
import StoreAssociationTool from '@/components/store/store-association/StoreAssociationTool';
import { Store } from '@/types/store';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

const AddStore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [existingStoreId, setExistingStoreId] = useState<string | null>(null);
  const [isCheckingExistingStore, setIsCheckingExistingStore] = useState(true);
  const [showAssociationTool, setShowAssociationTool] = useState(false);
  
  const { fromRegistration, storeType, requiresSubscription } = 
    (location.state as { 
      fromRegistration?: boolean; 
      storeType?: string; 
      requiresSubscription?: boolean;
    }) || {};

  // Avant toute vérification, nettoyons le localStorage/sessionStorage
  useEffect(() => {
    if (user?.email === 'histoiredechanvre29@gmail.com') {
      localStorage.removeItem('userStoreId');
      sessionStorage.removeItem('userStoreId');
      sessionStorage.removeItem('newlyAddedStore');
      
      // Pour cet utilisateur spécifique, montrer directement l'outil d'association
      setShowAssociationTool(true);
      setIsCheckingExistingStore(false);
      return;
    }
    
    const checkExistingStore = async () => {
      if (!user) {
        setIsCheckingExistingStore(false);
        return;
      }
      
      try {
        // Vérifier si l'utilisateur a un store_id dans son profil
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('store_id')
          .eq('id', user.id)
          .single();
          
        if (!profileError && profileData?.store_id) {
          setExistingStoreId(profileData.store_id);
          localStorage.setItem('userStoreId', profileData.store_id);
          sessionStorage.setItem('userStoreId', profileData.store_id);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la boutique existante:", error);
      } finally {
        setIsCheckingExistingStore(false);
      }
    };
    
    checkExistingStore();
  }, [user]);

  const handleStoreAdded = async (store: Store) => {
    setIsTransitioning(true);
    
    // Construire un message de confirmation personnalisé en fonction du type de boutique
    let confirmationMessage = "Votre boutique a été référencée dans l'annuaire.";
    
    if (store.isEcommerce && store.hasGoogleBusinessProfile) {
      confirmationMessage = "Votre boutique physique et votre site e-commerce ont été référencés avec succès. Les informations de votre fiche Google Business ont été importées.";
    } else if (store.isEcommerce) {
      confirmationMessage = "Votre boutique physique et votre site e-commerce ont été référencés avec succès.";
    } else if (store.hasGoogleBusinessProfile) {
      confirmationMessage = "Votre boutique a été référencée avec succès. Les informations de votre fiche Google Business ont été importées.";
    }
    
    toast({
      title: "Boutique ajoutée avec succès",
      description: confirmationMessage,
      duration: 5000,
    });

    // Enregistrer l'ID de la nouvelle boutique dans localStorage et sessionStorage pour plus de fiabilité
    localStorage.setItem('userStoreId', store.id);
    sessionStorage.setItem('userStoreId', store.id);
    sessionStorage.setItem('newlyAddedStore', store.id);

    // Si provient de l'inscription et nécessite un abonnement (ecommerce ou les deux)
    if (fromRegistration && requiresSubscription) {
      setTimeout(() => {
        navigate('/partners/subscription', { 
          state: { 
            fromStoreRegistration: true,
            storeId: store.id
          },
          replace: true  // Utiliser replace pour éviter les problèmes de navigation arrière
        });
        setIsTransitioning(false);
      }, 1500);
    } else {
      // Navigation vers le tableau de bord de la boutique
      setTimeout(() => {
        navigate(`/store/${store.id}/admin`, { replace: true });
        setIsTransitioning(false);
      }, 1500);
    }
  };
  
  const handleAssociationSuccess = () => {
    const storeId = localStorage.getItem('userStoreId') || sessionStorage.getItem('userStoreId');
    if (storeId) {
      navigate(`/store/${storeId}/admin`, { replace: true });
    } else {
      // Si aucun ID de boutique n'est trouvé, recharger la page
      window.location.reload();
    }
  };

  // Rediriger vers la boutique existante si on en trouve une
  useEffect(() => {
    if (!isCheckingExistingStore && existingStoreId && !showAssociationTool) {
      toast({
        title: "Vous avez déjà une boutique",
        description: "Vous allez être redirigé vers votre espace boutique existant.",
        duration: 5000,
      });
      
      setTimeout(() => {
        navigate(`/store/${existingStoreId}/admin`, { replace: true });
      }, 1500);
    }
  }, [existingStoreId, isCheckingExistingStore, toast, navigate, showAssociationTool]);

  if (isCheckingExistingStore) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification de votre profil...</p>
        </div>
      </div>
    );
  }
  
  if (showAssociationTool) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="gap-2" 
            onClick={() => navigate('/map')}
            disabled={isTransitioning}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la carte
          </Button>
        </div>
        
        <div className="mb-8 max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Associer votre boutique</h1>
          <p className="text-muted-foreground">
            Utilisez cet outil pour associer votre boutique existante à votre profil.
          </p>
        </div>
        
        <StoreAssociationTool onSuccess={handleAssociationSuccess} />
      </div>
    );
  }

  if (existingStoreId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center p-6 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Vous avez déjà une boutique</h2>
          <p className="mb-6 text-muted-foreground">
            Vous allez être redirigé vers votre espace boutique existant.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="gap-2" 
          onClick={() => navigate('/map')}
          disabled={isTransitioning}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la carte
        </Button>
      </div>
      
      <div className="mb-8 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-2">Ajouter une boutique CBD</h1>
        <p className="text-muted-foreground">
          {fromRegistration && requiresSubscription 
            ? "Enregistrez d'abord votre boutique physique. Vous pourrez ensuite configurer votre e-commerce."
            : "Utilisez ce formulaire pour ajouter une nouvelle boutique CBD à notre base de données."}
        </p>
      </div>
      
      <StoreForm 
        onSuccess={handleStoreAdded} 
        storeType={storeType} 
      />
    </div>
  );
};

export default AddStore;
