
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Store } from '@/types/store';
import { useToast } from "@/components/ui/use-toast";

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .eq('is_verified', true);

        if (error) throw error;

        setStores(data || []);
      } catch (error) {
        console.error('Error fetching stores:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les boutiques depuis la base de données",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, [toast]);

  return { stores, isLoading };
};
