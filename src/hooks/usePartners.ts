
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Partner } from '@/data/partnersData';
import { mockPartners } from '@/data/partnersData';
import { filterPartners } from '@/utils/partnerUtils';
import { PartnerCategory } from '@/types/auth';

export const usePartners = (searchTerm: string, categoryFilter: string) => {
  const [partnerProfiles, setPartnerProfiles] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchPartnerProfiles = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching partner profiles from database with searchTerm:", searchTerm, "and category:", categoryFilter);
        
        // Récupération des partenaires depuis la base de données
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'partner')
          .eq('is_verified', true); // Only fetch verified partners
        
        if (error) {
          console.error("Error fetching partner profiles:", error);
          toast({
            title: "Erreur lors du chargement des partenaires",
            description: "Affichage des données par défaut.",
            variant: "destructive",
          });
          setError("Unable to load partners from database");
          setUseMockData(true);
          setFilteredPartners(filterPartners(mockPartners, searchTerm, categoryFilter));
          setIsLoading(false);
          return;
        }

        console.log("Raw partner profiles fetched:", data);
        console.log("Partner profiles count:", data?.length || 0);
        
        if (data && data.length > 0) {
          // Affichage détaillé des profils pour le débogage
          data.forEach(profile => {
            console.log("Profile details:", {
              id: profile.id,
              name: profile.name,
              role: profile.role,
              is_verified: profile.is_verified,
              partner_category: profile.partner_category,
              partner_id: profile.partner_id
            });
          });
          
          const formattedProfiles = data
            .filter(profile => {
              // Log détaillé pour chaque profil
              console.log(`Checking profile ${profile.name} (id: ${profile.id}):`);
              console.log(`- role: ${profile.role}`);
              console.log(`- is_verified: ${profile.is_verified}`);
              console.log(`- partner_category: ${profile.partner_category}`);
              console.log(`- partner_id: ${profile.partner_id}`);
              
              // Inclure les profils qui ont une catégorie ou un ID de partenaire
              return profile.partner_category || profile.partner_id;
            })
            .map(profile => {
              console.log("Processing partner profile:", profile.name, profile.partner_category);
              
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
          
          if (formattedProfiles.length > 0) {
            console.log("Using real partner data - found", formattedProfiles.length, "partner(s)");
            setUseMockData(false);
            setPartnerProfiles(formattedProfiles);
            
            const filtered = filterPartners(formattedProfiles, searchTerm, categoryFilter);
            console.log("Filtered real partners result:", filtered.map(p => p.name));
            setFilteredPartners(filtered);
          } else {
            console.log("No valid partner profiles found in database, using mock data");
            setUseMockData(true);
            setPartnerProfiles([]);
            
            const filtered = filterPartners(mockPartners, searchTerm, categoryFilter);
            console.log("Filtered mock partners result:", filtered.map(p => p.name));
            setFilteredPartners(filtered);
          }
        } else {
          console.log("No partner profiles found in database, using mock data");
          setUseMockData(true);
          setPartnerProfiles([]);
          
          const filtered = filterPartners(mockPartners, searchTerm, categoryFilter);
          console.log("Filtered mock partners result:", filtered.map(p => p.name));
          setFilteredPartners(filtered);
        }
      } catch (err) {
        console.error("Error in partner profiles fetch logic:", err);
        setError("An unexpected error occurred");
        setUseMockData(true);
        setFilteredPartners(filterPartners(mockPartners, searchTerm, categoryFilter));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartnerProfiles();

    const intervalId = setInterval(fetchPartnerProfiles, 30000);
    
    return () => clearInterval(intervalId);
  }, [searchTerm, categoryFilter]);

  return { partnerProfiles, filteredPartners, isLoading, error, useMockData };
};
