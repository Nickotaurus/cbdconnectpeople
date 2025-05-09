
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

// Custom hook for partners data
import { usePartners } from '@/hooks/usePartners';

// Components
import PartnersHeader from '@/components/partners/PartnersHeader';
import PartnerSearchFilters from '@/components/partners/PartnerSearchFilters';
import PartnersContent from '@/components/partners/PartnersContent';

// Utilities
import { getCategoryLabel } from '@/utils/partnerUtils';
import { partnerCategories } from '@/data/partnerCategoriesData';

const Partners = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  
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
    if (isProfessional) {
      console.log(`Showing contact info for partner ${partnerId}`);
      setSelectedPartnerId(partnerId);
    } else {
      console.log('Login required to view contact info');
      navigate('/login');
    }
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
          hasPremium={isProfessional}
          onContactClick={handleContactClick}
          useTestData={useTestData}
        />
      </div>
    </div>
  );
};

export default Partners;
