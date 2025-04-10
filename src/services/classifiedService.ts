
import { supabase } from "@/integrations/supabase/client";
import { Classified, ClassifiedImage, ClassifiedStatus, ClassifiedType } from "@/types/classified";
import { User } from "@/types/auth";

export const classifiedService = {
  /**
   * Récupère toutes les annonces approuvées
   */
  getApprovedClassifieds: async (): Promise<Classified[]> => {
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
      category: classified.category,
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
  },

  /**
   * Récupère toutes les annonces en fonction de leur statut (pour admins)
   */
  getClassifiedsByStatus: async (status?: ClassifiedStatus): Promise<Classified[]> => {
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
      category: classified.category,
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
  },

  /**
   * Récupère les annonces d'un utilisateur
   */
  getUserClassifieds: async (userId: string): Promise<Classified[]> => {
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
      category: classified.category,
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
  },

  /**
   * Crée une nouvelle annonce
   */
  createClassified: async (
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
  },

  /**
   * Met à jour le statut d'une annonce (pour admins)
   */
  updateClassifiedStatus: async (classifiedId: string, status: ClassifiedStatus): Promise<void> => {
    const { error } = await supabase
      .from('classifieds')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', classifiedId);

    if (error) {
      console.error("Erreur lors de la mise à jour du statut de l'annonce:", error);
      throw error;
    }
  },

  /**
   * Ajoute des images à une annonce
   */
  addClassifiedImages: async (classifiedId: string, images: { url: string, name: string }[]): Promise<void> => {
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
  },

  /**
   * Supprime une annonce
   */
  deleteClassified: async (classifiedId: string): Promise<void> => {
    const { error } = await supabase
      .from('classifieds')
      .delete()
      .eq('id', classifiedId);

    if (error) {
      console.error("Erreur lors de la suppression de l'annonce:", error);
      throw error;
    }
  }
};
