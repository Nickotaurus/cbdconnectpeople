
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Partner } from '@/types/partners';
import { testPartnerData } from '@/data/testPartnersData';

interface UseStoreFavoritePartnersResult {
  favoritePartners: Partner[];
  isLoadingPartners: boolean;
  error: string | null;
}

export const useStoreFavoritePartners = (userId?: string): UseStoreFavoritePartnersResult => {
  const [favoritePartners, setFavoritePartners] = useState<Partner[]>([]);
  const [isLoadingPartners, setIsLoadingPartners] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoritePartners = async () => {
      if (!userId) {
        setFavoritePartners([]);
        setIsLoadingPartners(false);
        return;
      }

      try {
        setIsLoadingPartners(true);
        
        // For demonstration purposes, we're using sample partner data
        // In a real implementation, you would fetch the user's favorite partners from the database
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get 0-3 random partners from test data to simulate favorite partners
        const randomCount = Math.floor(Math.random() * 4);
        const shuffledPartners = [...testPartnerData].sort(() => 0.5 - Math.random());
        const sampleFavorites = shuffledPartners.slice(0, randomCount);
        
        setFavoritePartners(sampleFavorites);
        setError(null);
      } catch (err) {
        console.error("Error fetching favorite partners:", err);
        setError("Impossible de charger vos partenaires favoris");
      } finally {
        setIsLoadingPartners(false);
      }
    };

    fetchFavoritePartners();
  }, [userId]);

  return { favoritePartners, isLoadingPartners, error };
};
