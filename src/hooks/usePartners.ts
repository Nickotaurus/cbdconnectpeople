
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
  const [useMockData, setUseMockData] = useState(false);  // Start with assumption we'll use real data

  useEffect(() => {
    // Function to fetch partners from database
    const fetchPartnerProfiles = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching partner profiles from database with searchTerm:", searchTerm, "and category:", categoryFilter);
        
        // Force public access with anon key only - no auth required
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'partner');
        
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
          // Format the database partner profiles with detailed logging
          const formattedProfiles = data
            .filter(profile => {
              console.log("Checking profile:", profile.name, "with partner_category:", profile.partner_category);
              // Ensure we only include profiles that have partner data
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
          
          // Only use real data when we actually have partners
          if (formattedProfiles.length > 0) {
            console.log("Using real partner data - found", formattedProfiles.length, "partner(s)");
            setUseMockData(false);
            setPartnerProfiles(formattedProfiles);
            
            // Apply filters to real data
            const filtered = filterPartners(formattedProfiles, searchTerm, categoryFilter);
            console.log("Filtered real partners result:", filtered.map(p => p.name));
            setFilteredPartners(filtered);
          } else {
            console.log("No valid partner profiles found in database, using mock data");
            setUseMockData(true);
            setPartnerProfiles([]);
            
            // Apply filters to mock data
            const filtered = filterPartners(mockPartners, searchTerm, categoryFilter);
            console.log("Filtered mock partners result:", filtered.map(p => p.name));
            setFilteredPartners(filtered);
          }
        } else {
          console.log("No partner profiles found in database, using mock data");
          setUseMockData(true);
          setPartnerProfiles([]);
          
          // Apply filters to mock data
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

    // Execute the fetch function immediately 
    fetchPartnerProfiles();

    // Create an interval to refetch data every 30 seconds
    // This helps ensure we have updated data but isn't too frequent
    const intervalId = setInterval(fetchPartnerProfiles, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [searchTerm, categoryFilter]); // Re-run when filters change

  return { partnerProfiles, filteredPartners, isLoading, error, useMockData };
};
