
import { supabase } from "@/integrations/supabase/client";
import { ClassifiedType } from "@/types/classified";
import { storeImage } from "@/types/classified";

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
    images?: storeImage[];
    jobType?: string;
    salary?: string;
    experience?: string;
    contractType?: string;
    companyName?: string;
    contactEmail?: string;
  }
): Promise<string> => {
  try {
    // Créer l'annonce
    const { data: classified, error: classifiedError } = await supabase
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

    if (classifiedError) {
      console.error("Erreur lors de la création de l'annonce:", classifiedError);
      throw classifiedError;
    }

    // Si l'annonce a des images, les ajouter à la table classified_images
    if (classifiedData.images && classifiedData.images.length > 0) {
      const classifiedImages = classifiedData.images.map(image => ({
        classified_id: classified.id,
        url: image.url,
        name: image.name
      }));

      const { error: imagesError } = await supabase
        .from('classified_images')
        .insert(classifiedImages);

      if (imagesError) {
        console.error("Erreur lors de l'ajout des images:", imagesError);
        // Ne pas échouer la création de l'annonce si l'ajout d'images échoue
      }
    }

    return classified.id;
  } catch (error) {
    console.error("Erreur lors de la création de l'annonce:", error);
    throw error;
  }
};
