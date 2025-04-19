
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { PartnerUser } from '@/types/auth';

export const usePendingPartners = () => {
  const [pendingPartners, setPendingPartners] = useState<PartnerUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingPartners = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pending_partners')
        .select('*');

      if (error) throw error;

      setPendingPartners(data as PartnerUser[]);
    } catch (err: any) {
      console.error('Erreur lors du chargement des partenaires:', err);
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les partenaires en attente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approvePartner = async (partnerId: string) => {
    try {
      const { error } = await supabase
        .rpc('approve_partner', { partner_profile_id: partnerId });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le partenaire a été approuvé",
      });

      // Rafraîchir la liste
      await fetchPendingPartners();
    } catch (err: any) {
      console.error('Erreur lors de l\'approbation:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'approuver le partenaire",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPendingPartners();
  }, []);

  return {
    pendingPartners,
    isLoading,
    error,
    approvePartner,
    refreshPartners: fetchPendingPartners
  };
};
