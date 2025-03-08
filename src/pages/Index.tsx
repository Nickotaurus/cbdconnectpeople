
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import ClientDashboard from '@/components/ClientDashboard';
import StoreDashboard from '@/components/StoreDashboard';
import ProducerDashboard from '@/components/ProducerDashboard';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Show different dashboard based on user role
  if (user) {
    switch (user.role) {
      case 'client':
        return (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Bienvenue sur CBD Boutique Finder</h1>
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
  
  // Default view for non-authenticated users
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Le guide ultime des boutiques et producteurs de CBD
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          Trouvez facilement les meilleures boutiques CBD près de chez vous et connectez-vous avec les producteurs de qualité.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" onClick={() => navigate('/map')}>
            Trouver une boutique
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/guide')}>
            Guide du CBD
          </Button>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center p-6 border rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Pour les clients</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Trouvez les boutiques de CBD les plus proches, consultez les avis et bénéficiez de coupons exclusifs.
            </p>
            <Button variant="link" onClick={() => navigate('/register')}>S'inscrire en tant que client</Button>
          </div>
          
          <div className="text-center p-6 border rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Pour les boutiques</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Référencez votre boutique, créez des coupons de réduction et accédez à notre base de producteurs de CBD.
            </p>
            <Button variant="link" onClick={() => navigate('/register')}>S'inscrire en tant que boutique</Button>
          </div>
          
          <div className="text-center p-6 border rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M2 22c1.25-.9 2.78-1.37 4.34-1.34A6.39 6.39 0 0 1 12 22a6.3 6.3 0 0 1 5.65-1.33c1.56-.03 3.09.44 4.35 1.33"></path><path d="M2 12c1.25-.9 2.78-1.37 4.34-1.34A6.39 6.39 0 0 1 12 12a6.3 6.3 0 0 1 5.65-1.33c1.56-.03 3.09.44 4.35 1.33"></path><path d="M2 2c1.25-.9 2.78-1.37 4.34-1.34A6.39 6.39 0 0 1 12 2a6.3 6.3 0 0 1 5.65-1.33c1.56-.03 3.09.44 4.35 1.33"></path></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Pour les producteurs</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Présentez vos produits et entrez en contact direct avec les boutiques pour développer votre activité.
            </p>
            <Button variant="link" onClick={() => navigate('/register')}>S'inscrire en tant que producteur</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
