
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Star, Tag, Ticket, Award, BookmarkCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AdBanner from './AdBanner';
import { useAuth } from '@/contexts/auth';
import { ClientUser } from '@/types/auth';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const clientUser = user as ClientUser;
  
  const featuredStoreImage = "https://images.unsplash.com/photo-1609784969753-182f10261e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  
  const favoriteCount = clientUser?.favorites?.length || 0;
  const productCount = clientUser?.favoriteProducts?.length || 0;
  
  return (
    <div className="space-y-6">
      <AdBanner
        title="Nouvelle collection d'huiles Premium"
        description="Découvrez notre gamme d'huiles CBD bio cultivées en France"
        imageUrl={featuredStoreImage}
        storeName="CBD Excellence"
        onCTAClick={() => navigate('/store/1')}
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Search className="h-5 w-5 mr-2 text-primary" />
              Trouver une boutique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Trouvez rapidement une boutique CBD près de chez vous
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/map')}
            >
              <MapPin className="h-4 w-4 mr-2" /> 
              Voir la carte
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Tag className="h-5 w-5 mr-2 text-primary" />
              Promotions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Accédez aux meilleures offres et coupons de réduction
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/ranking')}
            >
              Voir les offres
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Star className="h-5 w-5 mr-2 text-primary" />
              Mes meilleures boutiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {favoriteCount > 0 
                ? `Vous avez ${favoriteCount} favoris` 
                : "Sélectionnez vos boutiques CBD préférées"}
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/my-favorites')}
            >
              Gérer mes favoris
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BookmarkCheck className="h-5 w-5 mr-2 text-primary" />
              Mes meilleurs produits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {productCount > 0
                ? `Vous avez ${productCount} produits favoris`
                : "Sélectionnez vos produits CBD préférés"}
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/my-products')}
            >
              Voir mes produits
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Ticket className="h-5 w-5 mr-2 text-primary" />
              Loterie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Tickets disponibles: {clientUser?.tickets || 0}
              </p>
              <p className="text-sm text-muted-foreground">
                Gains en attente: {clientUser?.rewards || 0}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/lottery')}
            >
              Participer au tirage
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              CBD Quest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Accomplissez des missions pour gagner des avantages exclusifs
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/quests')}
            >
              Voir mes quêtes
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M2 12h6"></path><path d="M22 12h-6"></path><path d="M12 2v6"></path><path d="M12 22v-6"></path><path d="M17 12a5 5 0 0 0-10 0"></path><path d="M17 17a5 5 0 0 0-10 0"></path></svg>
              Guide CBD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Apprenez tout sur le CBD : bénéfices, législation, conseils
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/guide')}
            >
              Consulter le guide
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
