
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/types/store-form';
import { createFormDataFromStoreDB } from '@/utils/storeFormUtils';

interface UseStoreDataFetcherProps {
  isEdit: boolean;
  storeId?: string;
}

interface UseStoreDataFetcherResult {
  formData: FormData | null;
  isLoading: boolean;
  error: any | null;
}

export const useStoreDataFetcher = ({ isEdit, storeId }: UseStoreDataFetcherProps): UseStoreDataFetcherResult => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);
  
  useEffect(() => {
    if (!isEdit || !storeId) {
      return;
    }
    
    setIsLoading(true);
    
    const fetchStoreData = async () => {
      try {
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .eq('id', storeId)
          .single();

        if (error) {
          console.error("Error fetching store data:", error);
          setError(error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les informations de la boutique.",
            variant: "destructive"
          });
        } else if (data) {
          setFormData(createFormDataFromStoreDB(data));
        }
      } catch (error) {
        console.error("Error in fetch:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStoreData();
  }, [isEdit, storeId, toast]);

  return { formData, isLoading, error };
};
