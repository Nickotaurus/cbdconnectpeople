
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Briefcase } from 'lucide-react';
import { partners } from '@/data/partnersData';
import { partnerCategories, getCategoryIcon } from '@/components/partners/PartnerFilters';
import PartnerFilters from '@/components/partners/PartnerFilters';
import PartnersTable from '@/components/partners/PartnersTable';
import PartnerSubscriptionModal from '@/components/partners/PartnerSubscriptionModal';
import BecomePartnerCTA from '@/components/partners/BecomePartnerCTA';

const getCategoryName = (category: string) => {
  const found = partnerCategories.find(c => c.value === category);
  return found ? found.label : category;
};

const Partners = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [showSubscription, setShowSubscription] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  
  // Vérifie si l'utilisateur a un abonnement premium (pour la démo)
  const hasPremium = user?.role === 'store' || user?.role === 'producer';
  
  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         partner.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? partner.category === categoryFilter : true;
    const matchesLocation = locationFilter ? partner.location.toLowerCase() === locationFilter.toLowerCase() : true;
    return matchesSearch && matchesCategory && matchesLocation;
  });
  
  const handleViewContact = (partnerId: string) => {
    if (hasPremium) {
      // Dans une app réelle, afficherait les coordonnées ou redirigerait vers un profil détaillé
      alert("Contact affiché (simulation) - Dans une version en production, vous verriez les coordonnées complètes du partenaire.");
    } else {
      setSelectedPartnerId(partnerId);
      setShowSubscription(true);
    }
  };
  
  const handleSubscription = (planId: string) => {
    // Dans une app réelle, traiterait l'abonnement
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
      
      {/* Composant de filtres */}
      <PartnerFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
      />
      
      {/* Affichage du modal d'abonnement ou de la table des partenaires */}
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
      
      {/* Section pour devenir partenaire - affiché seulement pour les non-partenaires */}
      {!user || user.role !== 'partner' ? (
        <BecomePartnerCTA />
      ) : null}
    </div>
  );
};

export default Partners;
