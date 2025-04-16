
import { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { PartnerCategory } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';

// Data
import { mockPartners } from '@/data/partnersData';

// Components
import PartnersList from '@/components/partners/PartnersList';
import PremiumAccessBanner from '@/components/partners/PremiumAccessBanner';
import PartnerSearchFilters from '@/components/partners/PartnerSearchFilters';
import PartnerSubscriptionOffers from '@/components/partners/PartnerSubscriptionOffers';
import BecomePartnerCTA from '@/components/partners/BecomePartnerCTA';

// Utilities
import { getCategoryLabel, filterPartners } from '@/utils/partnerUtils';
import { partnerCategories } from '@/data/partnerCategoriesData';

const Partners = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [filteredPartners, setFilteredPartners] = useState(mockPartners);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  
  const isProfessional = user?.role === "store" || user?.role === "partner";
  const hasPremium = user?.role === "store" && user.isVerified; // Assuming isVerified indicates premium status
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilteredPartners(filterPartners(mockPartners, term, categoryFilter));
  };
  
  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    setFilteredPartners(filterPartners(mockPartners, searchTerm, category));
  };
  
  const handleContactClick = (partnerId: string) => {
    if (hasPremium) {
      console.log(`Showing contact info for partner ${partnerId}`);
      setSelectedPartnerId(partnerId);
    } else {
      console.log('User needs premium to view contact info');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Partenaires CBD Connect</h1>
          <p className="text-muted-foreground mb-6">
            {isProfessional 
              ? "Connectez-vous avec tous les partenaires de l'écosystème CBD" 
              : "Découvrez les partenaires qui font vivre l'écosystème CBD en France"}
          </p>
          {!user && (
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate('/register?role=partner')}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Référencer mon activité gratuitement
            </Button>
          )}
        </div>
        
        <PartnerSearchFilters
          searchTerm={searchTerm}
          setSearchTerm={handleSearch}
          categoryFilter={categoryFilter}
          handleCategoryFilter={handleCategoryFilter}
          partnerCategories={partnerCategories}
          getCategoryLabel={getCategoryLabel}
        />
        
        <PremiumAccessBanner 
          isProfessional={isProfessional} 
          hasPremium={hasPremium} 
        />
        
        <PartnersList
          partners={filteredPartners}
          isProfessional={isProfessional}
          hasPremium={hasPremium}
          onContactClick={handleContactClick}
        />

        <BecomePartnerCTA />
        
        <PartnerSubscriptionOffers />
      </div>
    </div>
  );
};

export default Partners;
