
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { PartnerCategory } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';

// Data
import { mockPartners } from '@/data/partnersData';
import { supabase } from '@/integrations/supabase/client';

// Components
import PartnersList from '@/components/partners/PartnersList';
import PremiumAccessBanner from '@/components/partners/PremiumAccessBanner';
import PartnerSearchFilters from '@/components/partners/PartnerSearchFilters';
import PartnerSubscriptionOffers from '@/components/partners/PartnerSubscriptionOffers';
import BecomePartnerCTA from '@/components/partners/BecomePartnerCTA';

// Utilities
import { getCategoryLabel, filterPartners } from '@/utils/partnerUtils';
import { partnerCategories } from '@/data/partnerCategoriesData';
import { Partner } from '@/data/partnersData';

const Partners = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>(mockPartners);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [partnerProfiles, setPartnerProfiles] = useState<any[]>([]);
  
  const isProfessional = user?.role === "store" || user?.role === "partner";
  const hasPremium = user?.role === "store" && user.isVerified;
  
  useEffect(() => {
    const fetchPartnerProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .not('partner_id', 'is', null)  // Changed from .eq('partner_id', null, { foreignTable: false })
        .not('name', 'is', null);
      
      if (error) {
        console.error("Error fetching partner profiles:", error);
        return;
      }

      const formattedProfiles = data.map(profile => ({
        id: profile.id,
        name: profile.name,
        category: profile.partner_category || 'unknown',
        location: profile.partner_favorites ? profile.partner_favorites[3] || 'France' : 'France', 
        description: profile.partner_favorites ? profile.partner_favorites[6] : '',
        certifications: profile.certifications || [],
        distance: Math.floor(Math.random() * 300),
        imageUrl: profile.logo_url || 'https://via.placeholder.com/150'
      }));

      setPartnerProfiles(formattedProfiles);
    };

    fetchPartnerProfiles();
  }, []);

  const combinedPartners = [...mockPartners, ...partnerProfiles];
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilteredPartners(filterPartners(combinedPartners, term, categoryFilter));
  };
  
  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    setFilteredPartners(filterPartners(combinedPartners, searchTerm, category));
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
      </div>
    </div>
  );
};

export default Partners;
