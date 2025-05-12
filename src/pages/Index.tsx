
import React from 'react';
import { useAuth } from '@/contexts/auth';
import StoreDashboard from '@/components/StoreDashboard';
import PartnerDashboard from '@/components/dashboards/PartnerDashboard';
import HeroSection from '@/components/home/HeroSection';
import ProfilesSection from '@/components/home/ProfilesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import NewsSection from '@/components/home/NewsSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  
  if (user) {
    switch (user.role) {
      case 'store':
        return (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Espace Boutique</h1>
            <StoreDashboard />
          </div>
        );
      case 'partner':
        return <PartnerDashboard />;
      case 'admin':
        return (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Espace Administration</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Petites Annonces</h2>
                <p className="text-muted-foreground mb-4">
                  Gérez les petites annonces soumises par les utilisateurs.
                </p>
                <Button asChild>
                  <Link to="/admin/classifieds">Gérer les annonces</Link>
                </Button>
              </div>
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Partenaires</h2>
                <p className="text-muted-foreground mb-4">
                  Gérez les partenaires de la plateforme.
                </p>
                <Button asChild>
                  <Link to="/admin/partners">Gérer les partenaires</Link>
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        break;
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <HeroSection 
          logoSrc="/lovable-uploads/553fc45c-9d08-41b8-abd8-7cceb445942c.png"
          tagline="Rejoignez la première communauté dédiée aux professionnels du CBD : trouvez des partenaires fiables, accédez à des ressources exclusives et développez votre activité plus vite — inscription gratuite !"
        />
        
        <ProfilesSection />
        <FeaturesSection />
        <NewsSection />
      </div>
    </div>
  );
};

export default Index;
