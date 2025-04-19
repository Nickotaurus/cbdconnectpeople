
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
        
        // Requête détaillée pour inspecter tous les profils partenaires
        const { data: allProfiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'partner');
        
        if (profileError) {
          console.error("Erreur lors de la récupération des profils:", profileError);
          return;
        }

        console.log("TOUS les profils récupérés:", allProfiles);
        console.log("Nombre total de profils partenaires:", allProfiles?.length || 0);

        // Requête filtrée avec les conditions précises
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'partner')
          .eq('is_verified', true)
          .not('partner_category', 'is', null);
        
        if (error) {
          console.error("Erreur lors du filtrage des partenaires:", error);
          toast({
            title: "Erreur de chargement",
            description: "Impossible de charger les partenaires.",
            variant: "destructive",
          });
          return;
        }

        console.log("Profils partenaires filtrés:", data);
        console.log("Nombre de profils partenaires filtrés:", data?.length || 0);
        
        if (data && data.length > 0) {
          // Log détaillé de chaque profil
          data.forEach(profile => {
            console.log("Détails du profil partenaire:", {
              id: profile.id,
              nom: profile.name,
              role: profile.role,
              categoriePartenaire: profile.partner_category,
              estVerifie: profile.is_verified,
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

          console.log("Profils partenaires formatés:", formattedProfiles);
          setPartnerProfiles(formattedProfiles);
          
          const filtered = filterPartners(formattedProfiles, searchTerm, categoryFilter);
          console.log("Résultat du filtrage des partenaires:", filtered.map(p => p.name));
          setFilteredPartners(filtered);
        } else {
          console.log("Aucun profil partenaire trouvé avec les critères spécifiés");
          setPartnerProfiles([]);
          setFilteredPartners([]);
        }
      } catch (err) {
        console.error("Erreur inattendue lors de la récupération des partenaires:", err);
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
