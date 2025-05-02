
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/types/store-form';

export const useStoreDuplicateCheck = (formData: FormData) => {
  const { toast } = useToast();
  const duplicateCheckRunRef = useRef(false);

  useEffect(() => {
    const checkForDuplicate = async () => {
      if (!formData.address || !formData.latitude || !formData.longitude || duplicateCheckRunRef.current) {
        return;
      }
      
      duplicateCheckRunRef.current = true;
      
      try {
        const { data } = await supabase
          .from('stores')
          .select('id, name, address')
          .eq('address', formData.address)
          .eq('latitude', formData.latitude)
          .eq('longitude', formData.longitude);
        
        if (data && data.length > 0) {
          toast({
            title: "Boutique existante",
            description: "Une boutique existe déjà à cette adresse.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error checking for duplicate:", error);
      }
    };
    
    checkForDuplicate();
  }, [formData.address, formData.latitude, formData.longitude, toast]);
};
