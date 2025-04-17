
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Partner } from '@/data/partnersData';
import { mockPartners } from '@/data/partnersData';
import { filterPartners } from '@/utils/partnerUtils';
import { PartnerCategory } from '@/types/auth';

export const usePartners = (searchTerm: string, categoryFilter: string) => {
  const [partnerProfiles, setPartnerProfiles] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>(mockPartners);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch partners from database
    const fetchPartnerProfiles = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching partner profiles from database with searchTerm:", searchTerm, "and category:", categoryFilter);
        console.log("Attempting to fetch partner profiles...");
        
        // Force public access with anon key only - no auth required
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
        
        // Always include mock partners as fallback
        let combinedPartners = [...mockPartners];
        
        if (data && data.length > 0) {
          // Format the database partner profiles with more detailed logging
          const formattedProfiles = data.map(profile => {
            console.log("Processing partner profile:", profile);
            return {
              id: profile.id,
              name: profile.name || 'Unknown Partner',
              // Explicitly cast the category to PartnerCategory type
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

    // Execute the fetch function immediately 
    fetchPartnerProfiles();

    // Create an interval to refetch data every few seconds during development
    // This helps ensure we always have the latest data even after login/logout
    const intervalId = setInterval(fetchPartnerProfiles, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [searchTerm, categoryFilter]); // Re-run when filters change

  return { partnerProfiles, filteredPartners, isLoading, error };
};
