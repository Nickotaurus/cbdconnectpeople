
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

// Données de test à utiliser lorsque aucun partenaire réel n'est trouvé
const testPartnerData: Partner[] = [
  {
    id: '1',
    name: 'ABC Comptabilité',
    category: 'accountant',
    location: 'Paris',
    description: 'Cabinet comptable spécialisé dans le secteur du CBD',
    certifications: ['Expert-comptable', 'Certification CBD'],
    distance: 5,
    imageUrl: 'https://via.placeholder.com/150?text=ABC'
  },
  {
    id: '2',
    name: 'GreenBank',
    category: 'bank',
    location: 'Lyon',
    description: 'Banque offrant des services financiers adaptés aux entreprises CBD',
    certifications: ['Banque éthique', 'Financement vert'],
    distance: 120,
    imageUrl: 'https://via.placeholder.com/150?text=Bank'
  },
  {
    id: '3',
    name: 'JuriCBD',
    category: 'legal',
    location: 'Bordeaux',
    description: 'Experts juridiques spécialisés dans la législation CBD',
    certifications: ['Droit des affaires', 'Réglementation CBD'],
    distance: 230,
    imageUrl: 'https://via.placeholder.com/150?text=Legal'
  },
  {
    id: '4',
    name: 'Assur CBD',
    category: 'insurance',
    location: 'Marseille',
    description: 'Solutions d\'assurance sur mesure pour les boutiques CBD',
    certifications: ['Assurance professionnelle', 'Risques spécifiques CBD'],
    distance: 45,
    imageUrl: 'https://via.placeholder.com/150?text=Insurance'
  },
  {
    id: '5',
    name: 'CBD Lab',
    category: 'laboratory',
    location: 'Toulouse',
    description: 'Laboratoire d\'analyse et de certification de produits CBD',
    certifications: ['ISO 9001', 'Analyses THC/CBD'],
    distance: 190,
    imageUrl: 'https://via.placeholder.com/150?text=Lab'
  },
  {
    id: '6',
    name: 'CBD Media',
    category: 'media',
    location: 'Nantes',
    description: 'Agence médiatique spécialisée dans la promotion des produits CBD',
    certifications: ['Marketing digital', 'Relations presse'],
    distance: 75,
    imageUrl: 'https://via.placeholder.com/150?text=Media'
  }
];

export const usePartners = (searchTerm: string, categoryFilter: string) => {
  const [partnerProfiles, setPartnerProfiles] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useTestData, setUseTestData] = useState(false);

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
          setUseTestData(false);
        } else {
          console.warn("❗ No partner profiles found matching criteria - Using test data");
          setPartnerProfiles(testPartnerData);
          const filtered = filterPartners(testPartnerData, searchTerm, categoryFilter);
          setFilteredPartners(filtered);
          setUseTestData(true);
        }
      } catch (err) {
        console.error("🚨 Unexpected error:", err);
        setError("Une erreur s'est produite lors du chargement des partenaires");
        
        // En cas d'erreur, utiliser les données de test
        console.log("⚠️ Using test data due to error");
        setPartnerProfiles(testPartnerData);
        const filtered = filterPartners(testPartnerData, searchTerm, categoryFilter);
        setFilteredPartners(filtered);
        setUseTestData(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartnerProfiles();
    const intervalId = setInterval(fetchPartnerProfiles, 30000); // Rafraîchissement toutes les 30 secondes
    return () => clearInterval(intervalId);
  }, [searchTerm, categoryFilter]);

  return { partnerProfiles, filteredPartners, isLoading, error, useTestData };
};
