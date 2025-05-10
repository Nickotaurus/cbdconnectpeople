
import { supabase } from "@/integrations/supabase/client";
import { ClassifiedType } from "@/types/classified";

/**
 * Crée une nouvelle annonce
 */
export const createClassified = async (
  userId: string,
  classifiedData: {
    type: ClassifiedType;
    category: string;
    title: string;
    description: string;
    location: string;
    price?: string;
    isPremium: boolean;
  }
): Promise<string> => {
  // Vérifier que la catégorie est valide selon le type ClassifiedCategory
  const { data, error } = await supabase
    .from('classifieds')
    .insert({
      user_id: userId,
      type: classifiedData.type,
      category: classifiedData.category,
      title: classifiedData.title,
      description: classifiedData.description,
      location: classifiedData.location,
      price: classifiedData.price,
      is_premium: classifiedData.isPremium,
      date: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) {
    console.error("Erreur lors de la création de l'annonce:", error);
    throw error;
  }

  return data.id;
};
