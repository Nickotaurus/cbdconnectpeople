
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
  const [partnerProfiles, setPartnerProfiles] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isProfessional = user?.role === "store" || user?.role === "partner";
  const hasPremium = user?.role === "store" && user.isVerified;
  
  // Fetch partner profiles independent of authentication state
  useEffect(() => {
    const fetchPartnerProfiles = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching partner profiles from database");
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .not('partner_id', 'is', null)  // Get profiles that have a partner_id
          .not('name', 'is', null)
          .order('created_at', { ascending: false }); // Order by created_at to show newest partners first
        
        if (error) {
          console.error("Error fetching partner profiles:", error);
          setError("Unable to load partners from database");
          // Still show mock data even if there's an error
          setFilteredPartners(filterPartners(mockPartners, searchTerm, categoryFilter));
          setIsLoading(false);
          return;
        }

        console.log("Partner profiles fetched:", data);
        
        // Format and combine partner data
        let combinedPartners = [...mockPartners];
        
        if (data && data.length > 0) {
          const formattedProfiles = data.map(profile => ({
            id: profile.id,
            name: profile.name || 'Unknown Partner',
            category: (profile.partner_category || 'other') as PartnerCategory,
            location: profile.partner_favorites ? profile.partner_favorites[3] || 'France' : 'France', 
            description: profile.partner_favorites ? profile.partner_favorites[6] || 'No description available' : 'No description available',
            certifications: profile.certifications || [],
            distance: Math.floor(Math.random() * 300),
            imageUrl: profile.logo_url || 'https://via.placeholder.com/150'
          }));

          console.log("Formatted partner profiles:", formattedProfiles);
          setPartnerProfiles(formattedProfiles);
          
          // Important: Put formattedProfiles first to ensure newest partners appear first
          combinedPartners = [...formattedProfiles, ...mockPartners];
        }
        
        console.log("Combined partners before filtering:", combinedPartners.length);
        // Apply filters to combined partners
        const filtered = filterPartners(combinedPartners, searchTerm, categoryFilter);
        console.log("Filtered partners:", filtered.length);
        setFilteredPartners(filtered);
      } catch (err) {
        console.error("Error in partner profiles fetch logic:", err);
        setError("An unexpected error occurred");
        // Ensure we still show mock data in case of errors
        setFilteredPartners(filterPartners(mockPartners, searchTerm, categoryFilter));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartnerProfiles();
  }, [searchTerm, categoryFilter]);

  // Handle search filter
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Filtering happens in useEffect
  };
  
  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    // Filtering happens in useEffect
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
        
        {isLoading ? (
          <div className="text-center py-10">
            <p>Chargement des partenaires...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
            <p className="mt-2">Affichage des partenaires par défaut</p>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="text-center py-10">
            <p>Aucun partenaire ne correspond à votre recherche</p>
          </div>
        ) : (
          <PartnersList
            partners={filteredPartners}
            isProfessional={isProfessional}
            hasPremium={hasPremium}
            onContactClick={handleContactClick}
          />
        )}
      </div>
    </div>
  );
};

export default Partners;
