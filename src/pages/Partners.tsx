
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Briefcase, Award } from 'lucide-react';
import { partners } from '@/data/partnersData';
import { getCategoryIcon, partnerCategories } from '@/components/partners/PartnerFilters';
import PartnerFilters from '@/components/partners/PartnerFilters';
import PartnersTable from '@/components/partners/PartnersTable';
import PartnerSubscriptionModal from '@/components/partners/PartnerSubscriptionModal';
import BecomePartnerCTA from '@/components/partners/BecomePartnerCTA';
import UserBadges from '@/components/badges/UserBadges';

const getCategoryName = (category: string) => {
  const found = partnerCategories.find(c => c.value === category);
  return found ? found.label : category;
};

const Partners = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [showSubscription, setShowSubscription] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  
  const hasPremium = user?.role === 'store' || user?.role === 'producer';
  
  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         partner.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' ? true : partner.category === categoryFilter;
    const matchesLocation = locationFilter === 'all' ? true : partner.location.toLowerCase() === locationFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesLocation;
  });
  
  const handleViewContact = (partnerId: string) => {
    // Ajouter le badge Pro Connect si c'est une première mise en relation
    const earnedBadge = {
      id: "pro_connect",
      name: "Pro Connect",
      description: "Faire une première mise en relation avec un partenaire",
      icon: "Handshake",
      earnedAt: new Date().toISOString()
    };

    if (hasPremium) {
      if (user && (!user.badges || !user.badges.some(b => b.id === "pro_connect"))) {
        // Dans un environnement réel, une fonction updateUserBadges serait appelée ici
        // pour mettre à jour la base de données
        console.log("Badge Pro Connect obtenu !", earnedBadge);
      }
      alert("Contact affiché (simulation) - Dans une version en production, vous verriez les coordonnées complètes du partenaire.");
    } else {
      setSelectedPartnerId(partnerId);
      setShowSubscription(true);
    }
  };
  
  const handleSubscription = (planId: string) => {
    setShowSubscription(false);
    setSelectedPartnerId(null);
    alert(`Abonnement ${planId} souscrit (simulation) - Dans une version en production, vous auriez accès aux coordonnées des partenaires.`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Annuaire des Partenaires</h1>
          <p className="text-muted-foreground">Trouvez des services spécialisés pour votre activité CBD</p>
        </div>
        
        {(user?.role === 'partner') && (
          <Button className="mt-4 md:mt-0" onClick={() => navigate('/partner/profile')}>
            <Briefcase className="mr-2 h-4 w-4" />
            Gérer mon profil partenaire
          </Button>
        )}
      </div>
      
      {user && (
        <div className="mb-6 bg-card rounded-lg border p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Vos badges</h3>
            </div>
            <UserBadges user={user} />
          </div>
        </div>
      )}
      
      <PartnerFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
      />
      
      {showSubscription ? (
        <PartnerSubscriptionModal 
          onClose={() => setShowSubscription(false)} 
          onSubscribe={handleSubscription} 
        />
      ) : (
        <PartnersTable 
          partners={filteredPartners} 
          hasPremium={hasPremium} 
          onViewContact={handleViewContact}
          getCategoryName={getCategoryName}
        />
      )}
      
      {!user || user.role !== 'partner' ? (
        <BecomePartnerCTA />
      ) : null}
    </div>
  );
};

export default Partners;
