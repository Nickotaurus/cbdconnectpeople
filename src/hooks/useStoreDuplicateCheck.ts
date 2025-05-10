
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/types/store/form-types';

export const useStoreDuplicateCheck = (formData: FormData) => {
  const { toast } = useToast();
  const [isDuplicate, setIsDuplicate] = useState(false);
  const duplicateCheckRunRef = useRef(false);

  useEffect(() => {
    const checkForDuplicate = async () => {
      // Only check if we have enough data, and only once per form session
      if (!formData.name || !formData.address || !formData.latitude || !formData.longitude || duplicateCheckRunRef.current) {
        return;
      }
      
      // Mark that we've run this check
      duplicateCheckRunRef.current = true;
      
      try {
        // Check by coordinates (more reliable)
        const { data: coordData } = await supabase
          .from('stores')
          .select('id, name, address')
          .eq('latitude', formData.latitude)
          .eq('longitude', formData.longitude);
        
        if (coordData && coordData.length > 0) {
          toast({
            title: "Boutique existante",
            description: `Une boutique (${coordData[0].name}) est déjà enregistrée à cette adresse.`,
            variant: "destructive"
          });
          setIsDuplicate(true);
          return;
        }
        
        // Check by name and address
        const normalizedName = formData.name.toLowerCase().trim();
        const normalizedAddress = formData.address.toLowerCase().trim();
        
        const { data: nameAddressData } = await supabase
          .from('stores')
          .select('id, name, address')
          .ilike('name', `%${normalizedName}%`)
          .ilike('address', `%${normalizedAddress}%`);
        
        if (nameAddressData && nameAddressData.length > 0) {
          toast({
            title: "Boutique existante",
            description: `Une boutique similaire "${nameAddressData[0].name}" est déjà enregistrée.`,
            variant: "destructive"
          });
          setIsDuplicate(true);
          return;
        }
      } catch (error) {
        console.error("Error checking for duplicate:", error);
      }
    };
    
    checkForDuplicate();
  }, [formData.name, formData.address, formData.latitude, formData.longitude, toast]);

  return { isDuplicate };
};
