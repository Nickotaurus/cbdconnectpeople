import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import ClientDashboard from '@/components/ClientDashboard';
import StoreDashboard from '@/components/StoreDashboard';
import { MessageSquare, Network, Users, Store, Leaf, Briefcase } from 'lucide-react';
import { PartnerUser } from '@/types/auth';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Show different dashboard based on user role
  if (user) {
    switch (user.role) {
      case 'client':
        return (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Bienvenue sur CBDConnectWorld</h1>
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
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-10">
          <div className="flex justify-center mb-4">
            <Network className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Connecter le monde du CBD
          </h1>
          <p className="text-xl text-muted-foreground">
            La plateforme qui relie clients, boutiques, producteurs et partenaires de CBD
          </p>
        </div>
        
        <div className="mb-20">
          <h2 className="text-2xl font-semibold mb-6">Je suis...</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Client Profile Selection */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 transition-all hover:shadow-md hover:scale-105 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Un Client</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-grow">
                Je cherche des boutiques de CBD, des conseils ou des promotions
              </p>
              <Button 
                size="lg" 
                className="w-full" 
                onClick={() => navigate('/onboarding?role=client')}
              >
                Espace Client
              </Button>
            </div>
            
            {/* Store Profile Selection */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 transition-all hover:shadow-md hover:scale-105 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Une Boutique</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-grow">
                Je veux référencer ma boutique et attirer de nouveaux clients
              </p>
              <Button 
                size="lg" 
                className="w-full" 
                onClick={() => navigate('/onboarding?role=store')}
              >
                Espace Boutique
              </Button>
            </div>
            
            {/* Partner Profile Selection */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 transition-all hover:shadow-md hover:scale-105 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Un Partenaire</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-grow">
                Je propose des services spécialisés aux professionnels du CBD
              </p>
              <Button 
                size="lg" 
                className="w-full" 
                onClick={() => navigate('/onboarding?role=partner')}
              >
                Espace Partenaire
              </Button>
            </div>
          </div>
        </div>
        
        {/* Forum section */}
        <div className="mb-16">
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

export default Index;
