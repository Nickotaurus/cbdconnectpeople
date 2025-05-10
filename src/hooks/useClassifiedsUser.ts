
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { ClassifiedFormData } from '@/types/classified';
import { useAuth } from '@/contexts/auth';
import { useImageUpload } from './useImageUpload';
import { createClassified } from '@/services/classified/createClassified';

interface UseClassifiedsUserProps {
  userId?: string | null;
}

export const useClassifiedsUser = ({ userId }: UseClassifiedsUserProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { images, setImages, isUploading, handleImageUpload } = useImageUpload();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!user && !userId) {
      navigate('/login');
    }
  }, [user, userId, navigate]);

  const handleClassifiedSubmit = async (data: ClassifiedFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!user?.id) {
        throw new Error("User not authenticated.");
      }

      // Create the classified using our service
      const classifiedId = await createClassified(user.id, {
        type: data.type,
        category: data.category,
        title: data.title,
        description: data.description,
        location: data.location,
        price: data.price,
        isPremium: data.isPremium,
        images: images,
        jobType: data.jobType,
        salary: data.salary,
        experience: data.experience,
        contractType: data.contractType,
        companyName: data.companyName,
        contactEmail: data.contactEmail
      });

      toast({
        title: "Annonce soumise",
        description: "Votre annonce a été soumise avec succès et sera examinée par notre équipe.",
      });

      // Reset form state
      setImages([]);
      
      // Redirect to classifieds page
      navigate('/classifieds');
      return classifiedId;
    } catch (err: any) {
      const errorMessage = err.message || "Échec de la soumission de l'annonce.";
      setError(errorMessage);
      toast({
        title: "Erreur de soumission d'annonce",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    images,
    setImages,
    isLoading,
    isUploading,
    error,
    handleImageUpload,
    handleClassifiedSubmit,
    createClassified: handleClassifiedSubmit // Pour compatibilité avec le code existant
  };
};
