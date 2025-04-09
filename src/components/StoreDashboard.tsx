import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Building, Users, BarChart3, ChevronRight, Gift, Leaf, BookmarkCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StoreUser } from '@/types/auth';

const StoreDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const storeUser = user as StoreUser;
  
  // Mock data - would come from API in real app
  const profileCompleteness = 65;
  const storeVerificationStatus = storeUser?.siretVerified ? "Vérifié" : "En attente";
  const storeId = storeUser?.storeId || "new";
  const partnerFavorites = storeUser?.partnerFavorites || [];
  
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
            
            {!storeUser?.storeId && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-300">Votre fiche boutique n'est pas encore créée.</p>
                <p className="text-muted-foreground mt-1">Complétez votre profil pour être visible sur notre plateforme.</p>
                <Button className="mt-2 w-full md:w-auto" onClick={() => navigate('/add-store')}>
                  Créer ma fiche boutique
                </Button>
              </div>
            )}
            
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
          </CardContent>
          <CardFooter className="flex-col items-start space-y-2">
            {storeUser?.storeId && (
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
              onClick={() => navigate('/producers')}
            >
              <Leaf className="mr-2 h-4 w-4" />
              Annuaire des producteurs
            </Button>
            
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
