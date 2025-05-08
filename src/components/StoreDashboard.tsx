
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Store } from '@/types/store';
import { convertToStore } from '@/utils/storeFormUtils';
import { useStores } from '@/hooks/useStores';
import Map from '@/components/Map';

const StoreDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { stores, refetch } = useStores();

  useEffect(() => {
    const checkNewlyRegistered = () => {
      const isNewlyRegistered = sessionStorage.getItem('newlyRegisteredStore');
      if (isNewlyRegistered === 'true') {
        setShowSuccessMessage(true);
        sessionStorage.removeItem('newlyRegisteredStore');
      }
    };
    
    checkNewlyRegistered();
    
    const fetchUserStore = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error fetching session:", sessionError);
          return;
        }
        
        if (!session?.user?.id) {
          console.log("No user logged in");
          return;
        }
        
        // Get user profile with store_id
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('store_id')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return;
        }
        
        if (!profileData?.store_id) {
          console.log("User has no associated store");
          return;
        }
        
        // Get store details
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('id', profileData.store_id)
          .single();
        
        if (storeError) {
          console.error("Error fetching store:", storeError);
          return;
        }
        
        if (storeData) {
          const storeObject = convertToStore(storeData);
          setCurrentStore(storeObject);
        }
      } catch (error) {
        console.error("Error in fetchUserStore:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserStore();
  }, []);

  const handleEditStore = () => {
    if (currentStore?.id) {
      navigate(`/store/${currentStore.id}/admin`);
    }
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
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold">Félicitations !</h3>
              <p>Votre boutique a été enregistrée avec succès et est maintenant visible sur la carte.</p>
              <Button 
                variant="link" 
                className="text-green-800 p-0 h-auto"
                onClick={handleViewOnMap}
              >
                Voir sur la carte
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDismissSuccessMessage}
            >
              ×
            </Button>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse">Chargement des informations de votre boutique...</div>
        </div>
      ) : currentStore ? (
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="location">Localisation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{currentStore.name}</CardTitle>
                  <CardDescription>Informations générales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentStore.photo_url && (
                      <img 
                        src={currentStore.photo_url} 
                        alt={currentStore.name} 
                        className="w-full h-40 object-cover rounded-md mb-4"
                      />
                    )}
                    <p><strong>Adresse:</strong> {currentStore.address}, {currentStore.postalCode} {currentStore.city}</p>
                    <p><strong>Téléphone:</strong> {currentStore.phone || 'Non renseigné'}</p>
                    <p><strong>Site web:</strong> {currentStore.website || 'Non renseigné'}</p>
                    {currentStore.hasGoogleBusinessProfile && (
                      <div className="mt-4 bg-blue-50 p-3 rounded-md">
                        <p className="text-blue-800 font-semibold">✓ Profil Google Business connecté</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleEditStore}>Modifier les informations</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Visibilité sur la carte</CardTitle>
                  <CardDescription>Prévisualisation de votre boutique</CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <Map 
                    stores={[currentStore]} 
                    selectedStoreId={currentStore.id}
                  />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={handleViewOnMap}>
                    Voir sur la carte complète
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Détails de la boutique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{currentStore.description || 'Aucune description disponible.'}</p>
                  </div>
                  
                  {currentStore.openingHours && currentStore.openingHours.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Horaires d'ouverture</h3>
                      <ul className="space-y-1">
                        {currentStore.openingHours.map((hours, index) => (
                          <li key={index} className="text-sm">
                            <span className="font-medium">{hours.day}:</span> {hours.hours}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {currentStore.isEcommerce && (
                    <div className="bg-green-50 p-3 rounded-md">
                      <h3 className="font-semibold text-green-800">Boutique E-commerce</h3>
                      <p className="text-green-700">
                        Url: {currentStore.ecommerceUrl || currentStore.website || 'Non renseignée'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleEditStore}>Modifier les détails</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle>Localisation</CardTitle>
                <CardDescription>Adresse et coordonnées de votre boutique</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Adresse complète</h3>
                    <p>{currentStore.address}</p>
                    <p>{currentStore.postalCode} {currentStore.city}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Coordonnées</h3>
                    <p>Latitude: {currentStore.latitude}</p>
                    <p>Longitude: {currentStore.longitude}</p>
                  </div>
                  
                  <div className="h-64 mt-4">
                    <Map 
                      stores={[currentStore]}
                      selectedStoreId={currentStore.id}
                      zoom={15}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Aucune boutique associée</CardTitle>
            <CardDescription>
              Vous n'avez pas encore de boutique associée à votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Pour ajouter une boutique, cliquez sur le bouton ci-dessous.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/add-store')}>
              Ajouter une boutique
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default StoreDashboard;
