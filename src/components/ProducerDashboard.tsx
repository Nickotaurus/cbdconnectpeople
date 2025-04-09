
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Store, FileText, ShoppingBag, ChevronRight, Users, Sprout } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PartnerUser } from '@/types/auth';

const ProducerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const producerUser = user as PartnerUser;
  
  // Mock data - would come from API in real app
  const profileCompleteness = producerUser?.partnerId ? 100 : 20;
  const producerId = producerUser?.partnerId || null;
  const interestedStores = 8; // Mock data
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-2/3">
          <CardHeader>
            <CardTitle>Tableau de bord producteur</CardTitle>
            <CardDescription>
              Gérez votre profil et connectez-vous avec les boutiques CBD
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
            
            {!producerUser?.partnerId && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-300">Votre profil producteur n'est pas encore créé.</p>
                <p className="text-muted-foreground mt-1">Complétez votre profil pour être visible auprès des boutiques.</p>
                <Button className="mt-2 w-full md:w-auto" onClick={() => navigate('/add-producer')}>
                  Créer mon profil producteur
                </Button>
              </div>
            )}
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center p-3 border rounded-md">
                <Users className="h-9 w-9 p-1.5 rounded-md bg-primary/10 text-primary mr-3" />
                <div>
                  <p className="text-sm font-medium">Boutiques intéressées</p>
                  <p className="text-sm text-muted-foreground">
                    {producerUser?.partnerId ? `${interestedStores} boutiques` : 'Créez votre profil'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center p-3 border rounded-md">
                <Sprout className="h-9 w-9 p-1.5 rounded-md bg-primary/10 text-primary mr-3" />
                <div>
                  <p className="text-sm font-medium">Certifications</p>
                  <p className="text-sm text-muted-foreground">
                    {(producerUser?.certifications?.length || 0)} certification(s)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start space-y-2">
            {producerUser?.partnerId && (
              <Button 
                variant="outline" 
                className="w-full md:w-auto" 
                onClick={() => navigate(`/producer/${producerId}`)}
              >
                Voir mon profil
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
              onClick={() => navigate('/map')}
            >
              <Store className="mr-2 h-4 w-4" />
              Carte des boutiques
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/documents')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Mes documents
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/samples')}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Échantillons
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProducerDashboard;
