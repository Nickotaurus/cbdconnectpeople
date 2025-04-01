
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import ClientDashboard from '@/components/ClientDashboard';
import StoreDashboard from '@/components/StoreDashboard';
import { Users, Store, Briefcase, MapPin, Award, Newspaper, MessageCircle, Globe } from 'lucide-react';
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
            <Store className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            CBD Connect People
          </h1>
          <p className="text-xl text-muted-foreground mb-10">
            La plateforme qui connecte tous les acteurs de l'écosystème CBD
          </p>
        </div>
        
        {/* 3 profils principaux */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <ProfileCard 
            icon={<Users className="h-12 w-12 text-primary" />}
            title="Je suis un Client"
            description="Trouvez facilement des boutiques physiques, des sites e-commerce et des professionnels du CBD"
            primaryAction={() => navigate('/map')}
            primaryLabel="Trouver une boutique"
            secondaryAction={() => navigate('/partners')}
            secondaryLabel="Trouver un professionnel"
          />
          
          <ProfileCard 
            icon={<Store className="h-12 w-12 text-primary" />}
            title="Je suis une Boutique"
            description="Référencez gratuitement votre boutique physique ou inscrivez votre site e-commerce pour gagner en visibilité"
            primaryAction={() => navigate('/register?role=store')}
            primaryLabel="Référencer ma boutique"
            banner="Gratuit pour les boutiques physiques"
          />
          
          <ProfileCard 
            icon={<Briefcase className="h-12 w-12 text-primary" />}
            title="Je suis un Partenaire"
            description="Proposez vos services et connectez-vous avec les acteurs du CBD"
            primaryAction={() => navigate('/register?role=partner')}
            primaryLabel="Devenir partenaire"
            banner="Avocats, comptables, banques, assurances..."
          />
        </div>
        
        {/* Services principaux */}
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
            icon={<Award className="h-8 w-8 text-primary" />}
            title="Classements"
            description="Top boutiques et produits"
            onClick={() => navigate('/ranking')}
          />
        </div>
        
        {/* Actualités */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4 gap-2">
            <Newspaper className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Actualités du CBD</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Restez informé des dernières actualités et tendances du monde du CBD
          </p>
          <Button variant="outline" onClick={() => navigate('/news')}>
            <Newspaper className="h-4 w-4 mr-2" />
            Voir les actualités
          </Button>
        </div>
      </div>
    </div>
  );
};

// Composant pour les cartes de profil
const ProfileCard = ({ 
  icon, 
  title, 
  description,
  primaryAction,
  primaryLabel,
  secondaryAction,
  secondaryLabel,
  banner
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  primaryAction: () => void;
  primaryLabel: string;
  secondaryAction?: () => void;
  secondaryLabel?: string;
  banner?: string;
}) => (
  <Card className="flex flex-col h-full">
    <CardHeader className="pb-3">
      <div className="flex justify-center mb-3">
        {icon}
      </div>
      <CardTitle className="text-xl text-center">{title}</CardTitle>
      {banner && (
        <div className="mt-2 bg-primary/10 text-primary text-sm py-1 px-2 rounded-md text-center">
          {banner}
        </div>
      )}
    </CardHeader>
    <CardContent className="flex-grow">
      <CardDescription className="text-center mb-6">
        {description}
      </CardDescription>
      <div className="flex flex-col gap-2 mt-auto">
        <Button 
          className="w-full" 
          onClick={primaryAction}
        >
          {primaryLabel}
        </Button>
        {secondaryAction && secondaryLabel && (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={secondaryAction}
          >
            {secondaryLabel}
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

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
