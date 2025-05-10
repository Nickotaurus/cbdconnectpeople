
import { supabase } from "@/integrations/supabase/client";

/**
 * Ajoute des images à une annonce
 */
export const addClassifiedImages = async (classifiedId: string, images: { url: string, name: string }[]): Promise<void> => {
  const imagesWithClassifiedId = images.map(img => ({
    ...img,
    classified_id: classifiedId
  }));

  const { error } = await supabase
    .from('classified_images')
    .insert(imagesWithClassifiedId);

  if (error) {
    console.error("Erreur lors de l'ajout d'images à l'annonce:", error);
    throw error;
  }
};
