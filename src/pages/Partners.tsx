
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

// Custom hook for partners data
import { usePartners } from '@/hooks/usePartners';

// Components
import PartnersHeader from '@/components/partners/PartnersHeader';
import PartnerSearchFilters from '@/components/partners/PartnerSearchFilters';
import PartnersContent from '@/components/partners/PartnersContent';
import PartnerContactModal from '@/components/partners/PartnerContactModal';

// Utilities
import { getCategoryLabel } from '@/utils/partnerUtils';
import { partnerCategories } from '@/data/partnerCategoriesData';
import { Partner } from '@/types/partners/partner';
import { toast } from '@/components/ui/use-toast';

const Partners = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  // Get partners data from custom hook
  const { partnerProfiles, filteredPartners, isLoading, error, useTestData } = usePartners(searchTerm, categoryFilter);
  
  const isProfessional = user?.role === "store" || user?.role === "partner";
  
  // Handle search filter
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
  };
  
  const handleContactClick = (partnerId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour voir les coordonnées.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    const partner = partnerProfiles.find(p => p.id === partnerId);
    if (partner) {
      setSelectedPartner(partner);
      setIsContactModalOpen(true);
    }
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setSelectedPartner(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <PartnersHeader 
          isProfessional={isProfessional}
          isLoggedIn={!!user}
        />
        
        <PartnerSearchFilters
          searchTerm={searchTerm}
          setSearchTerm={handleSearch}
          categoryFilter={categoryFilter}
          handleCategoryFilter={handleCategoryFilter}
          partnerCategories={partnerCategories}
          getCategoryLabel={getCategoryLabel}
        />
        
        <PartnersContent 
          isLoading={isLoading}
          error={error}
          filteredPartners={filteredPartners}
          partnerProfilesCount={partnerProfiles.length}
          isProfessional={isProfessional}
          hasPremium={!!user} // Maintenant on vérifie si l'utilisateur est connecté
          onContactClick={handleContactClick}
          useTestData={useTestData}
        />

        <PartnerContactModal 
          partner={selectedPartner} 
          isOpen={isContactModalOpen} 
          onClose={closeContactModal}
        />
      </div>
    </div>
  );
};

export default Partners;
