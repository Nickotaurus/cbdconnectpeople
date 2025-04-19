
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
        console.log("🔍 Fetching partner profiles");
        
        // Detailed query to inspect ALL partner profiles
        const { data: allProfiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'partner');
        
        if (profileError) {
          console.error("❌ Error fetching profiles:", profileError);
          setError("Impossible de charger les profils partenaires");
          return;
        }

        console.log("📋 Total partner profiles found:", allProfiles?.length || 0);
        
        if (allProfiles && allProfiles.length > 0) {
          allProfiles.forEach(profile => {
            console.log("🕵️ Profile Details:", {
              id: profile.id,
              name: profile.name,
              role: profile.role,
              verified: profile.is_verified,
              category: profile.partner_category,
              partners_favorites: profile.partner_favorites
            });
          });
        }

        // Filtered query with precise conditions
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'partner')
          .eq('is_verified', true)
          .not('partner_category', 'is', null);
        
        if (error) {
          console.error("❌ Error filtering partners:", error);
          toast({
            title: "Erreur de chargement",
            description: "Impossible de charger les partenaires.",
            variant: "destructive",
          });
          return;
        }

        console.log("✅ Filtered partner profiles:", data?.length || 0);
        
        if (data && data.length > 0) {
          data.forEach(profile => {
            console.log("✨ Partner Profile:", {
              id: profile.id,
              name: profile.name,
              category: profile.partner_category,
              location: profile.partner_favorites?.[3] || 'Non spécifiée',
              description: profile.partner_favorites?.[6] || 'Aucune description'
            });
          });
          
          const formattedProfiles = data.map(profile => ({
            id: profile.id,
            name: profile.name || 'Partenaire sans nom',
            category: (profile.partner_category || 'other') as PartnerCategory,
            location: profile.partner_favorites?.[3] || 'France',
            description: profile.partner_favorites?.[6] || 'Aucune description',
            certifications: profile.certifications || [],
            distance: Math.floor(Math.random() * 300),
            imageUrl: profile.logo_url || 'https://via.placeholder.com/150'
          }));

          console.log("🏆 Formatted Profiles:", formattedProfiles);
          setPartnerProfiles(formattedProfiles);
          
          const filtered = filterPartners(formattedProfiles, searchTerm, categoryFilter);
          console.log("🔍 Filtered Partners Result:", filtered.map(p => p.name));
          setFilteredPartners(filtered);
        } else {
          console.warn("❗ No partner profiles found matching criteria");
          setPartnerProfiles([]);
          setFilteredPartners([]);
        }
      } catch (err) {
        console.error("🚨 Unexpected error:", err);
        setError("Une erreur s'est produite lors du chargement des partenaires");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartnerProfiles();
    const intervalId = setInterval(fetchPartnerProfiles, 30000); // Rafraîchissement toutes les 30 secondes
    return () => clearInterval(intervalId);
  }, [searchTerm, categoryFilter]);

  return { partnerProfiles, filteredPartners, isLoading, error };
};
