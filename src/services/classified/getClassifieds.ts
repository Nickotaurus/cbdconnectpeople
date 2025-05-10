
import { supabase } from "@/integrations/supabase/client";
import { Classified, ClassifiedImage, ClassifiedStatus, ClassifiedType, ClassifiedCategory } from "@/types/classified";

/**
 * Récupère toutes les annonces approuvées
 */
export const getApprovedClassifieds = async (): Promise<Classified[]> => {
  const { data, error } = await supabase
    .from('classifieds')
    .select(`
      *,
      classified_images(*)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des annonces:", error);
    throw error;
  }

  // Transformer les données pour correspondre au format attendu
  return data.map(classified => ({
    id: classified.id,
    type: classified.type as ClassifiedType,
    category: classified.category as ClassifiedCategory,
    title: classified.title,
    description: classified.description,
    location: classified.location,
    price: classified.price || undefined,
    date: classified.date,
    status: classified.status as ClassifiedStatus,
    user: {
      id: classified.user_id,
      name: '', // Ces informations seront complétées plus tard
      email: '',
    },
    isPremium: classified.is_premium,
    images: classified.classified_images as ClassifiedImage[]
  }));
};

/**
 * Récupère toutes les annonces en fonction de leur statut (pour admins)
 */
export const getClassifiedsByStatus = async (status?: ClassifiedStatus): Promise<Classified[]> => {
  let query = supabase
    .from('classifieds')
    .select(`
      *,
      classified_images(*)
    `);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des annonces:", error);
    throw error;
  }

  // Transformer les données pour correspondre au format attendu
  return data.map(classified => ({
    id: classified.id,
    type: classified.type as ClassifiedType,
    category: classified.category as ClassifiedCategory,
    title: classified.title,
    description: classified.description,
    location: classified.location,
    price: classified.price || undefined,
    date: classified.date,
    status: classified.status as ClassifiedStatus,
    user: {
      id: classified.user_id,
      name: '', // Ces informations seront complétées plus tard
      email: '',
    },
    isPremium: classified.is_premium,
    images: classified.classified_images as ClassifiedImage[]
  }));
};

/**
 * Récupère les annonces d'un utilisateur
 */
export const getUserClassifieds = async (userId: string): Promise<Classified[]> => {
  const { data, error } = await supabase
    .from('classifieds')
    .select(`
      *,
      classified_images(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des annonces:", error);
    throw error;
  }

  // Transformer les données
  return data.map(classified => ({
    id: classified.id,
    type: classified.type as ClassifiedType,
    category: classified.category as ClassifiedCategory,
    title: classified.title,
    description: classified.description,
    location: classified.location,
    price: classified.price || undefined,
    date: classified.date,
    status: classified.status as ClassifiedStatus,
    user: {
      id: classified.user_id,
      name: '', // Ces informations seront complétées plus tard
      email: '',
    },
    isPremium: classified.is_premium,
    images: classified.classified_images as ClassifiedImage[]
  }));
};
