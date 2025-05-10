
import { supabase } from "@/integrations/supabase/client";
import { ClassifiedStatus } from "@/types/classified";

/**
 * Met à jour le statut d'une annonce (pour admins)
 */
export const updateClassifiedStatus = async (classifiedId: string, status: ClassifiedStatus): Promise<void> => {
  const { error } = await supabase
    .from('classifieds')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', classifiedId);

  if (error) {
    console.error("Erreur lors de la mise à jour du statut de l'annonce:", error);
    throw error;
  }
};
