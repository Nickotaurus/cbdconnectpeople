
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Star, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AdBanner from './AdBanner';

const ClientDashboard = () => {
  const navigate = useNavigate();
  
  const featuredStoreImage = "https://images.unsplash.com/photo-1609784969753-182f10261e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  
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
              Meilleures boutiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Découvrez les boutiques les mieux notées par la communauté
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/ranking')}
            >
              Voir le classement
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
