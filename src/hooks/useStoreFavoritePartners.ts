
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Partner } from '@/hooks/usePartners';
import { PartnerCategory } from '@/types/auth';

export const useStoreFavoritePartners = (userId: string | undefined) => {
  const [favoritePartners, setFavoritePartners] = useState<Partner[]>([]);
  const [isLoadingPartners, setIsLoadingPartners] = useState(false);
  
  useEffect(() => {
    const fetchFavoritePartners = async () => {
      if (!userId) return;
      
      setIsLoadingPartners(true);
      try {
        // Récupérer les IDs des partenaires favoris de l'utilisateur
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('partner_favorites')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error("Erreur lors de la récupération des favoris:", userError);
          return;
        }

        if (!userData?.partner_favorites || userData.partner_favorites.length === 0) {
          // Aucun partenaire favori
          setIsLoadingPartners(false);
          return;
        }

        // Récupérer les partenaires vérifiés
        const { data: partners, error: partnersError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'partner')
          .eq('is_verified', true);

        if (partnersError) {
          console.error("Erreur lors de la récupération des partenaires:", partnersError);
          setIsLoadingPartners(false);
          return;
        }

        if (partners && partners.length > 0) {
          // Convertir les données des partenaires au format Partner
          const formattedPartners = partners.map(partner => ({
            id: partner.id,
            name: partner.name || 'Partenaire sans nom',
            category: (partner.partner_category || 'other') as PartnerCategory,
            location: partner.partner_favorites?.[3] || 'France',
            description: partner.partner_favorites?.[6] || 'Aucune description',
            certifications: partner.certifications || [],
            distance: Math.floor(Math.random() * 300),
            imageUrl: partner.logo_url || 'https://via.placeholder.com/150'
          }));

          setFavoritePartners(formattedPartners);
        }
      } catch (err) {
        console.error("Erreur inattendue:", err);
      } finally {
        setIsLoadingPartners(false);
      }
    };

    fetchFavoritePartners();
  }, [userId]);
  
  return { favoritePartners, isLoadingPartners };
};
