
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { Building, Users, BarChart3, ChevronRight, Gift, Leaf, BookmarkCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StoreUser } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from "@/components/ui/skeleton"; 
import StoreAssociationTool from '@/components/store/StoreAssociationTool';

const StoreDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const storeUser = user as StoreUser;
  
  const [storeId, setStoreId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showAssociationTool, setShowAssociationTool] = useState(false);
  const maxRetries = 3;
  
  // Autres états
  const profileCompleteness = 65;
  const storeVerificationStatus = storeUser?.siretVerified ? "Vérifié" : "En attente";
  const partnerFavorites = storeUser?.partnerFavorites || [];
  
  // Vérifier si l'utilisateur est "histoiredechanvre29@gmail.com"
  // et n'a pas encore de boutique associée
  const isHistoireDeChanvreUser = user?.email === "histoiredechanvre29@gmail.com";

  useEffect(() => {
    const fetchStoreId = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Vérifier toutes les sources possibles du storeId
        let foundStoreId = null;
        
        // 1. Vérifier d'abord le localStorage puis sessionStorage
        foundStoreId = localStorage.getItem('userStoreId') || sessionStorage.getItem('userStoreId');
        
        if (foundStoreId) {
          console.log("StoreID trouvé dans le storage local:", foundStoreId);
          // Vérifier que le storeId existe dans la base de données
          const { data: storeData, error: storeCheckError } = await supabase
            .from('stores')
            .select('id')
            .eq('id', foundStoreId)
            .single();
            
          if (!storeCheckError && storeData) {
            setStoreId(foundStoreId);
            // Stocker dans les deux stockages pour plus de fiabilité
            localStorage.setItem('userStoreId', foundStoreId);
            sessionStorage.setItem('userStoreId', foundStoreId);
            setIsLoading(false);
            return;
          } else {
            console.warn("StoreID trouvé dans le stockage local mais non valide:", storeCheckError);
            // Effacer les valeurs invalides
            localStorage.removeItem('userStoreId');
            sessionStorage.removeItem('userStoreId');
          }
        }
        
        // 2. Si pas dans le storage local et qu'on a un utilisateur connecté, vérifier dans le profil
        if (user && user.id) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('store_id')
            .eq('id', user.id)
            .single();
            
          if (profileError) {
            console.error("Erreur lors de la récupération du profil:", profileError);
            throw new Error("Impossible de récupérer votre profil.");
          }
          
          if (profileData && profileData.store_id) {
            console.log("StoreID trouvé dans le profil:", profileData.store_id);
            setStoreId(profileData.store_id);
            localStorage.setItem('userStoreId', profileData.store_id);
            sessionStorage.setItem('userStoreId', profileData.store_id);
            setIsLoading(false);
            return;
          }
          
          // 3. Si pas de store_id dans le profil, rechercher les boutiques créées par l'utilisateur
          const { data: storeData, error: storeError } = await supabase
            .from('stores')
            .select('id')
            .eq('user_id', user.id)
            .order('registration_date', { ascending: false })
            .limit(1);
            
          if (storeError) {
            console.error("Erreur lors de la recherche de boutique:", storeError);
            throw new Error("Impossible de rechercher vos boutiques.");
          }
          
          if (storeData && storeData.length > 0) {
            console.log("StoreID trouvé dans les boutiques de l'utilisateur:", storeData[0].id);
            // Mettre à jour le profil avec l'ID de la boutique trouvée
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ store_id: storeData[0].id })
              .eq('id', user.id);
              
            if (updateError) {
              console.error("Erreur lors de la mise à jour du profil:", updateError);
            }
            
            setStoreId(storeData[0].id);
            localStorage.setItem('userStoreId', storeData[0].id);
            sessionStorage.setItem('userStoreId', storeData[0].id);
            setIsLoading(false);
            return;
          }
          
          // 4. Pour Histoire de Chanvre spécifiquement, offrir l'outil d'association
          if (isHistoireDeChanvreUser) {
            setShowAssociationTool(true);
            setIsLoading(false);
            return;
          }
        }

        // Si aucune boutique trouvée
        if (retryCount < maxRetries) {
          console.log(`Aucune boutique trouvée, nouvelle tentative dans 1s (${retryCount + 1}/${maxRetries})`);
          setRetryCount(prevCount => prevCount + 1);
          setTimeout(() => fetchStoreId(), 1000); // Réessayer dans 1 seconde
        } else {
          setIsLoading(false); // Terminer le chargement même sans boutique
          console.log("Nombre maximal de tentatives atteint, aucune boutique trouvée");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'ID de la boutique:", err);
        setError("Impossible de récupérer les informations de votre boutique.");
        setIsLoading(false);
        
        toast({
          title: "Erreur",
          description: err instanceof Error ? err.message : "Une erreur est survenue lors du chargement de votre boutique.",
          variant: "destructive",
        });
      }
    };
    
    fetchStoreId();
  }, [user, toast, retryCount, isHistoireDeChanvreUser]);
  
  // Rendre un état de chargement sur mobile et desktop
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="w-full md:w-2/3">
            <CardHeader>
              <Skeleton className="h-6 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-full md:w-1/3">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Montrer l'outil d'association pour Histoire de Chanvre
  if (showAssociationTool) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Association de votre boutique</CardTitle>
            <CardDescription>
              Nous avons trouvé votre boutique "CBD Histoire de Chanvre" dans notre base de données. 
              Veuillez confirmer l'association de cette boutique à votre profil.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StoreAssociationTool />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-2/3">
          <CardHeader>
            <CardTitle>Tableau de bord boutique</CardTitle>
            <CardDescription>
              Gérez votre boutique et améliorez votre visibilité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Complétude du profil</span>
                <span className="text-sm font-medium">{profileCompleteness}%</span>
              </div>
              <Progress value={profileCompleteness} className="h-2" />
            </div>
            
            {error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-md text-sm">
                <p className="font-medium text-red-800 dark:text-red-300">Erreur de chargement</p>
                <p className="text-muted-foreground mt-1">{error}</p>
                <Button className="mt-2 w-full md:w-auto" variant="destructive" onClick={() => {
                  setRetryCount(0);
                  setIsLoading(true);
                }}>
                  Réessayer
                </Button>
              </div>
            ) : !storeId ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-300">Votre fiche boutique n'est pas encore créée.</p>
                <p className="text-muted-foreground mt-1">Complétez votre profil pour être visible sur notre plateforme.</p>
                <Button className="mt-2 w-full md:w-auto" onClick={() => navigate('/add-store')}>
                  Créer ma fiche boutique
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center p-3 border rounded-md">
                  <Building className="h-9 w-9 p-1.5 rounded-md bg-primary/10 text-primary mr-3" />
                  <div>
                    <p className="text-sm font-medium">Statut SIRET</p>
                    <p className={`text-sm ${storeUser?.siretVerified ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {storeVerificationStatus}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border rounded-md">
                  <Users className="h-9 w-9 p-1.5 rounded-md bg-primary/10 text-primary mr-3" />
                  <div>
                    <p className="text-sm font-medium">Accès partenaires</p>
                    <p className="text-sm text-muted-foreground">
                      {storeUser?.siretVerified ? 'Disponible' : 'Débloqué après vérification'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start space-y-2">
            {storeId && (
              <Button 
                variant="outline" 
                className="w-full md:w-auto" 
                onClick={() => navigate(`/store/${storeId}/admin`)}
              >
                Gérer ma boutique
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Accès rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/partners')}
            >
              <Leaf className="mr-2 h-4 w-4" />
              Annuaire des partenaires
            </Button>
            
            {storeId && (
              <>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => navigate(`/store/${storeId}/admin?tab=coupons`)}
                >
                  <Gift className="mr-2 h-4 w-4" />
                  Gérer mes coupons
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => navigate(`/store/${storeId}/admin?tab=stats`)}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Statistiques
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Mes partenaires favoris</CardTitle>
            <CardDescription>Partenaires et producteurs avec qui vous collaborez</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/partners')} 
            className="text-primary"
          >
            Voir tous
          </Button>
        </CardHeader>
        <CardContent>
          {partnerFavorites && partnerFavorites.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="border rounded-lg p-4 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Demo Producteur CBD</h4>
                  <p className="text-sm text-muted-foreground">Producteur, Isère</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookmarkCheck className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <h4 className="text-lg font-medium">Aucun partenaire favori</h4>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Ajoutez des partenaires à vos favoris pour les retrouver facilement ici
              </p>
              <Button onClick={() => navigate('/partners')}>
                Parcourir les partenaires
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreDashboard;
