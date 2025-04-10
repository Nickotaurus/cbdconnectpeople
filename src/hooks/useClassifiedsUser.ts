
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { classifiedService } from "@/services/classifiedService";
import { ClassifiedType, ClassifiedCategory } from "@/types/classified";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useClassifiedsUser = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  // Récupérer les annonces de l'utilisateur
  const { data: userClassifieds, isLoading, error, refetch } = useQuery({
    queryKey: ['userClassifieds', user?.id],
    queryFn: async () => {
      if (!user) return [];
      return await classifiedService.getUserClassifieds(user.id);
    },
    enabled: !!user
  });
  
  // Mutation pour créer une nouvelle annonce
  const { mutate: createClassified } = useMutation({
    mutationFn: async ({
      type,
      category,
      title,
      description,
      location,
      price,
      isPremium,
      images
    }: {
      type: ClassifiedType;
      category: ClassifiedCategory;
      title: string;
      description: string;
      location: string;
      price?: string;
      isPremium: boolean;
      images: File[];
    }) => {
      if (!user) throw new Error("Vous devez être connecté pour publier une annonce");
      
      setIsUploading(true);
      
      try {
        // 1. Créer l'annonce
        const classifiedId = await classifiedService.createClassified(
          user.id,
          { type, category, title, description, location, price, isPremium }
        );
        
        // 2. Traiter les images si nécessaire
        if (images && images.length > 0) {
          const uploadedImages = await Promise.all(
            images.map(async (file) => {
              const fileExt = file.name.split('.').pop();
              const fileName = `${user.id}/${classifiedId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
              
              const { error: uploadError, data } = await supabase.storage
                .from('classifieds')
                .upload(fileName, file);
                
              if (uploadError) throw uploadError;
              
              const { data: urlData } = supabase.storage
                .from('classifieds')
                .getPublicUrl(fileName);
                
              return {
                url: urlData.publicUrl,
                name: file.name
              };
            })
          );
          
          // 3. Associer les images à l'annonce
          await classifiedService.addClassifiedImages(classifiedId, uploadedImages);
        }
        
        return classifiedId;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Annonce publiée",
        description: "Votre annonce a été soumise avec succès et sera examinée par nos équipes."
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de publier votre annonce.",
        variant: "destructive"
      });
      console.error("Erreur lors de la publication de l'annonce:", error);
    }
  });
  
  // Mutation pour supprimer une annonce
  const { mutate: deleteClassified } = useMutation({
    mutationFn: async (classifiedId: string) => {
      await classifiedService.deleteClassified(classifiedId);
    },
    onSuccess: () => {
      toast({
        title: "Annonce supprimée",
        description: "Votre annonce a été supprimée avec succès."
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer votre annonce.",
        variant: "destructive"
      });
      console.error("Erreur lors de la suppression de l'annonce:", error);
    }
  });

  return {
    userClassifieds,
    isLoading,
    error,
    isUploading,
    createClassified,
    deleteClassified
  };
};
