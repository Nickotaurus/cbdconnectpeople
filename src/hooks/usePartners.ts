
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { filterPartners } from '@/utils/partnerUtils';
import { PartnerCategory } from '@/types/auth';

export interface Partner {
  id: string;
  name: string;
  category: PartnerCategory;
  location: string;
  description: string;
  certifications: string[];
  distance: number;
  imageUrl: string;
}

export const usePartners = (searchTerm: string, categoryFilter: string) => {
  const [partnerProfiles, setPartnerProfiles] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartnerProfiles = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching partner profiles from database with searchTerm:", searchTerm, "and category:", categoryFilter);
        
        // Get raw database fields first to inspect what we're getting
        const { data: rawData, error: rawError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'partner');
          
        console.log("All partner profiles before filtering:", rawData);
        
        // Then apply the verified filter
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'partner')
          .eq('is_verified', true);
        
        if (error) {
          console.error("Error fetching partner profiles:", error);
          toast({
            title: "Erreur lors du chargement des partenaires",
            description: "Impossible de charger les partenaires.",
            variant: "destructive",
          });
          setError("Impossible de charger les partenaires");
          setIsLoading(false);
          return;
        }

        console.log("Raw partner profiles fetched (verified only):", data);
        console.log("Partner profiles count:", data?.length || 0);
        
        if (data && data.length > 0) {
          // Log each profile to inspect what fields are actually available
          data.forEach(profile => {
            console.log("Profile details:", {
              id: profile.id,
              name: profile.name,
              role: profile.role,
              partner_category: profile.partner_category,
              is_verified: profile.is_verified,
              location: profile.partner_favorites?.[3],
              description: profile.partner_favorites?.[6]
            });
          });
          
          const formattedProfiles = data
            .filter(profile => {
              // Check if profile has a category defined
              const hasCategory = Boolean(profile.partner_category);
              console.log(`Profile ${profile.name}: has category = ${hasCategory}, category = ${profile.partner_category}`);
              return hasCategory;
            })
            .map(profile => ({
              id: profile.id,
              name: profile.name || 'Unknown Partner',
              category: (profile.partner_category || 'other') as PartnerCategory,
              location: profile.partner_favorites?.[3] || 'France',
              description: profile.partner_favorites?.[6] || 'No description available',
              certifications: profile.certifications || [],
              distance: Math.floor(Math.random() * 300),
              imageUrl: profile.logo_url || 'https://via.placeholder.com/150'
            }));

          console.log("Formatted partner profiles:", formattedProfiles);
          setPartnerProfiles(formattedProfiles);
          
          const filtered = filterPartners(formattedProfiles, searchTerm, categoryFilter);
          console.log("Filtered partners result:", filtered.map(p => p.name));
          setFilteredPartners(filtered);
        } else {
          console.log("No partner profiles found in database that are verified");
          setPartnerProfiles([]);
          setFilteredPartners([]);
        }
      } catch (err) {
        console.error("Error in partner profiles fetch logic:", err);
        setError("Une erreur inattendue s'est produite");
        setPartnerProfiles([]);
        setFilteredPartners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartnerProfiles();
    const intervalId = setInterval(fetchPartnerProfiles, 30000);
    return () => clearInterval(intervalId);
  }, [searchTerm, categoryFilter]);

  return { partnerProfiles, filteredPartners, isLoading, error };
};
