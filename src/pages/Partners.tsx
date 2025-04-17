
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { PartnerCategory } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from '@/components/ui/use-toast';

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
    // Function to fetch partners from database
    const fetchPartnerProfiles = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching partner profiles from database with searchTerm:", searchTerm, "and category:", categoryFilter);
        
        // Use a more reliable query that works when logged in or logged out
        // We want all profiles where role='partner' regardless of authentication state
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'partner')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching partner profiles:", error);
          toast({
            title: "Erreur lors du chargement des partenaires",
            description: "Affichage des données par défaut.",
            variant: "destructive",
          });
          setError("Unable to load partners from database");
          setFilteredPartners(filterPartners(mockPartners, searchTerm, categoryFilter));
          setIsLoading(false);
          return;
        }

        console.log("Raw partner profiles fetched:", data);
        console.log("Partner profiles count:", data?.length || 0);
        
        // Start with mock partners as a fallback
        let combinedPartners = [...mockPartners];
        
        if (data && data.length > 0) {
          // Format the database partner profiles with more detailed logging
          const formattedProfiles = data.map(profile => {
            console.log("Processing partner profile:", profile);
            return {
              id: profile.id,
              name: profile.name || 'Unknown Partner',
              category: (profile.partner_category || 'other') as PartnerCategory,
              location: profile.partner_favorites && profile.partner_favorites.length >= 4 ? 
                profile.partner_favorites[3] || 'France' : 'France', 
              description: profile.partner_favorites && profile.partner_favorites.length >= 7 ? 
                profile.partner_favorites[6] || 'No description available' : 'No description available',
              certifications: profile.certifications || [],
              distance: Math.floor(Math.random() * 300),
              imageUrl: profile.logo_url || 'https://via.placeholder.com/150'
            };
          });

          console.log("Formatted partner profiles:", formattedProfiles);
          setPartnerProfiles(formattedProfiles);
          
          // Prioritize database partners in the display
          combinedPartners = [...formattedProfiles, ...mockPartners];
        } else {
          console.log("No partner profiles found in database, using mock data only");
        }
        
        console.log("Combined partners before filtering:", combinedPartners);
        
        // Apply filters to combined partners
        const filtered = filterPartners(combinedPartners, searchTerm, categoryFilter);
        console.log("Filtered partners result:", filtered);
        setFilteredPartners(filtered);
      } catch (err) {
        console.error("Error in partner profiles fetch logic:", err);
        setError("An unexpected error occurred");
        setFilteredPartners(filterPartners(mockPartners, searchTerm, categoryFilter));
      } finally {
        setIsLoading(false);
      }
    };

    // Execute the fetch function
    fetchPartnerProfiles();
  }, [searchTerm, categoryFilter]); // Re-run when filters change

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-lg overflow-hidden border shadow">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
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
