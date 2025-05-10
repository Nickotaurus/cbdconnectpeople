
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { ClassifiedFormData } from '@/types/classified';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { useImageUpload } from './useImageUpload';

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

  const createClassified = async (data: ClassifiedFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!user?.id) {
        throw new Error("User not authenticated.");
      }

      // Format the data to match the database schema
      const classifiedData = {
        type: data.type,
        category: data.category,
        title: data.title,
        description: data.description,
        location: data.location,
        price: data.price,
        is_premium: false, // Always false since premium option has been removed
        user_id: user.id,
      };

      // Insert the classified
      const { error: insertError, data: classifiedResult } = await supabase
        .from('classifieds')
        .insert([classifiedData])
        .select('id')
        .single();

      if (insertError) {
        console.error("Error submitting classified:", insertError);
        throw new Error("Failed to submit classified.");
      }

      // If there are images, add them to the classified_images table
      if (images.length > 0 && classifiedResult) {
        const classifiedImages = images.map(image => ({
          classified_id: classifiedResult.id,
          url: image.url,
          name: image.name
        }));

        const { error: imagesError } = await supabase
          .from('classified_images')
          .insert(classifiedImages);

        if (imagesError) {
          console.error("Error submitting classified images:", imagesError);
          // Don't throw error here, as the classified has been created
          toast({
            title: "Warning",
            description: "Your classified was created, but there was an issue with the images.",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Classified submitted",
        description: "Your classified has been successfully submitted for review.",
      });

      navigate('/classifieds');
    } catch (err: any) {
      const errorMessage = err.message || "Failed to submit classified.";
      setError(errorMessage);
      toast({
        title: "Error submitting classified",
        description: errorMessage,
        variant: "destructive",
      });
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
    handleClassifiedSubmit: createClassified,
    createClassified
  };
};
