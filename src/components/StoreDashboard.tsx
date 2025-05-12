
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Store as StoreIcon } from 'lucide-react';
import { useStoreDashboard } from '@/hooks/useStoreDashboard';
import { useToast } from '@/hooks/use-toast'; // Ajout de l'import useToast

// Import our new component tabs
import StoreOverviewTab from '@/components/store-dashboard/StoreOverviewTab';
import StoreDetailsTab from '@/components/store-dashboard/StoreDetailsTab';
import StoreLocationTab from '@/components/store-dashboard/StoreLocationTab';
import StoreEcommerceTab from '@/components/store-dashboard/StoreEcommerceTab';
import NoStoreCard from '@/components/store-dashboard/NoStoreCard';
import SuccessMessage from '@/components/store-dashboard/SuccessMessage';
import { useAuth } from '@/contexts/auth';

const StoreDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { toast } = useToast(); // Utilisation de useToast
  
  const {
    currentStore,
    isLoading,
    showSuccessMessage,
    setShowSuccessMessage,
    ecommerceData,
    isSubmitting,
    uploadingLogo,
    handleEcommerceChange,
    handleEcommerceSubmit,
    handleLogoUpload
  } = useStoreDashboard();
  
  // Vérifier si l'utilisateur est le propriétaire de la boutique
  const isStoreOwner = user && currentStore && 
    (user.id === currentStore.userId || user.id === currentStore.claimedBy);

  const handleEditStore = () => {
    if (!currentStore?.id) return;
    
    if (!isStoreOwner) {
      toast({
        title: "Accès refusé",
        description: "Vous n'êtes pas autorisé à modifier cette boutique",
        variant: "destructive"
      });
      return;
    }
    
    navigate(`/store/${currentStore.id}/admin`);
  };
  
  const handleViewOnMap = () => {
    navigate('/map');
  };

  const handleDismissSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord de votre boutique</h1>
      
      {showSuccessMessage && (
        <SuccessMessage
          onDismiss={handleDismissSuccessMessage}
          onViewMap={handleViewOnMap}
        />
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse">Chargement des informations de votre boutique...</div>
        </div>
      ) : currentStore ? (
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <StoreIcon className="h-4 w-4" />
              <span>Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="location">Localisation</TabsTrigger>
            <TabsTrigger value="ecommerce" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>E-commerce</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <StoreOverviewTab
              store={currentStore}
              onEditClick={handleEditStore}
              onViewMapClick={handleViewOnMap} // Ajout de la prop manquante
              isStoreOwner={isStoreOwner}
            />
          </TabsContent>
          
          <TabsContent value="details">
            <StoreDetailsTab
              store={currentStore}
              onEditClick={handleEditStore}
              isStoreOwner={isStoreOwner}
            />
          </TabsContent>
          
          <TabsContent value="location">
            <StoreLocationTab store={currentStore} />
          </TabsContent>
          
          <TabsContent value="ecommerce">
            <StoreEcommerceTab
              ecommerceData={ecommerceData}
              isSubmitting={isSubmitting}
              onChange={handleEcommerceChange}
              onSubmit={handleEcommerceSubmit}
              onLogoUpload={handleLogoUpload}
              uploadingLogo={uploadingLogo}
              currentLogoUrl={currentStore.logo_url}
              isStoreOwner={isStoreOwner}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <NoStoreCard />
      )}
    </div>
  );
};

export default StoreDashboard;
