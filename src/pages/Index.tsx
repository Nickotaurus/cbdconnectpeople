
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import ClientDashboard from '@/components/ClientDashboard';
import StoreDashboard from '@/components/StoreDashboard';
import { MessageSquare, Network, Users, Store, Leaf, Briefcase, MapPin, Award, Newspaper, ShoppingBag, MessageCircle, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Show different dashboard based on user role
  if (user) {
    switch (user.role) {
      case 'client':
        return (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Bienvenue sur CBD Connect People</h1>
            <ClientDashboard />
          </div>
        );
      case 'store':
        return (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Espace Boutique</h1>
            <StoreDashboard />
          </div>
        );
      case 'partner':
        // All partners now show the same dashboard, regardless of category
        return (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Espace Partenaire</h1>
            <p className="text-muted-foreground mb-6">
              Bienvenue dans votre espace partenaire. Depuis cet espace, vous pouvez gérer votre profil et accéder aux statistiques de visite.
            </p>
            {/* À implémenter dans une prochaine itération */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="border rounded-xl p-6 flex flex-col items-center">
                <h3 className="text-xl font-medium mb-3">Profil Partenaire</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Complétez votre profil pour augmenter votre visibilité
                </p>
                <Button onClick={() => navigate('/partner/profile')}>
                  Gérer mon profil
                </Button>
              </div>
              <div className="border rounded-xl p-6 flex flex-col items-center">
                <h3 className="text-xl font-medium mb-3">Mes statistiques</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Consultez les statistiques de visite de votre profil
                </p>
                <Button onClick={() => navigate('/partner/stats')}>
                  Voir les statistiques
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        break;
    }
  }
  
  // Default view for non-authenticated users with prominent profile selection
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex justify-center mb-4">
            <Network className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            CBD Connect People
          </h1>
          <p className="text-xl text-muted-foreground">
            La plateforme qui connecte tous les acteurs de l'écosystème CBD
          </p>
        </div>
        
        {/* Main Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <FeatureCard 
            icon={<MapPin className="h-8 w-8 text-primary" />}
            title="Boutiques"
            description="Trouvez les boutiques CBD près de chez vous"
            onClick={() => navigate('/map')}
          />
          <FeatureCard 
            icon={<Globe className="h-8 w-8 text-primary" />}
            title="E-commerce"
            description="Découvrez les meilleurs sites CBD"
            onClick={() => navigate('/e-commerce')}
          />
          <FeatureCard 
            icon={<MessageCircle className="h-8 w-8 text-primary" />}
            title="Annonces"
            description="Achetez, vendez et échangez"
            onClick={() => navigate('/classifieds')}
          />
          <FeatureCard 
            icon={<ShoppingBag className="h-8 w-8 text-primary" />}
            title="Marketplace"
            description="Tous les produits CBD"
            onClick={() => navigate('/marketplace')}
          />
        </div>
        
        {/* Secondary Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 overflow-hidden bg-primary/5 flex items-center justify-center">
              <Award className="h-16 w-16 text-primary opacity-50" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Classement CBD</CardTitle>
              <CardDescription>
                Top 10 des meilleures boutiques, produits et sites CBD
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => navigate('/ranking')}>
                Voir les classements
              </Button>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 overflow-hidden bg-primary/5 flex items-center justify-center">
              <Newspaper className="h-16 w-16 text-primary opacity-50" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Actualité CBD</CardTitle>
              <CardDescription>
                Les dernières nouvelles et tendances du secteur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => navigate('/news')}>
                Lire les actualités
              </Button>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 overflow-hidden bg-primary/5 flex items-center justify-center">
              <Briefcase className="h-16 w-16 text-primary opacity-50" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Partenaires</CardTitle>
              <CardDescription>
                Tous les professionnels de l'écosystème CBD
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => navigate('/partners')}>
                Voir les partenaires
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Registration CTA */}
        <div className="bg-primary/5 rounded-lg p-8 text-center mb-16">
          <h2 className="text-2xl font-bold mb-4">
            Rejoignez la communauté CBD Connect People
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Créez votre compte gratuit et profitez de tous les services de la plateforme.
            Particuliers, boutiques et partenaires, tout l'écosystème CBD vous attend !
          </p>
          <Button size="lg" className="gap-2" onClick={() => navigate('/register')}>
            Inscription gratuite
          </Button>
        </div>
        
        {/* Forum section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4 gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Forum Communautaire</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Rejoignez notre communauté active de passionnés de CBD. Posez vos questions,
            partagez vos expériences et découvrez les dernières actualités.
          </p>
          <Button variant="outline" onClick={() => navigate('/forum')}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Accéder au forum
          </Button>
        </div>
      </div>
    </div>
  );
};

// Composant pour les cartes de fonctionnalités
const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  onClick 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;

  onClick: () => void;
}) => (
  <div 
    className="bg-primary/5 rounded-lg p-4 flex flex-col items-center text-center hover:bg-primary/10 transition-colors cursor-pointer"
    onClick={onClick}
  >
    <div className="mb-3">{icon}</div>
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Index;
