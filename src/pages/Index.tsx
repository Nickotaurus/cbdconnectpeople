
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import ClientDashboard from '@/components/ClientDashboard';
import StoreDashboard from '@/components/StoreDashboard';
import ProducerDashboard from '@/components/ProducerDashboard';
import { MessageSquare, Network, Users, Store, Leaf } from 'lucide-react';

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
      case 'producer':
        return (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Espace Producteur</h1>
            <ProducerDashboard />
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
            La plateforme qui relie clients, boutiques et producteurs de CBD
          </p>
        </div>
        
        <div className="mb-20">
          <h2 className="text-2xl font-semibold mb-6">Je suis...</h2>
          
          <div className="grid gap-6 md:grid-cols-3">
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
                onClick={() => navigate('/register?role=client')}
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
                onClick={() => navigate('/register?role=store')}
              >
                Espace Boutique
              </Button>
            </div>
            
            {/* Producer Profile Selection */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 transition-all hover:shadow-md hover:scale-105 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Un Producteur</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-grow">
                Je souhaite promouvoir mes produits auprès des boutiques
              </p>
              <Button 
                size="lg" 
                className="w-full" 
                onClick={() => navigate('/register?role=producer')}
              >
                Espace Producteur
              </Button>
            </div>
          </div>
        </div>
        
        {/* Nouvelle section pour le forum */}
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
