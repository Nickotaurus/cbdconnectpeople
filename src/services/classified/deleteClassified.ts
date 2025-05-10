
import { supabase } from "@/integrations/supabase/client";

/**
 * Supprime une annonce
 */
export const deleteClassified = async (classifiedId: string): Promise<void> => {
  const { error } = await supabase
    .from('classifieds')
    .delete()
    .eq('id', classifiedId);

  if (error) {
    console.error("Erreur lors de la suppression de l'annonce:", error);
    throw error;
  }
};
