import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { storeImage, ClassifiedFormData } from '@/types/classified';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/auth';

interface UseClassifiedsUserProps {
  userId?: string | null;
}

export const useClassifiedsUser = ({ userId }: UseClassifiedsUserProps = {}) => {
  const [images, setImages] = useState<storeImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user && !userId) {
      navigate('/login');
    }
  }, [user, userId, navigate]);

  const handleImageUpload = async (files: File[]) => {
    setIsUploading(true);
    setError(null);

    try {
      const uploadPromises = files.map(async (file) => {
        const imageName = `${uuidv4()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('classifieds')
          .upload(imageName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error("Error uploading image:", error);
          throw new Error(`Failed to upload image: ${file.name}`);
        }

        // Utiliser une méthode publique pour obtenir l'URL
        const { data: { publicUrl } } = supabase.storage
          .from('classifieds')
          .getPublicUrl(imageName);

        return { name: file.name, url: publicUrl };
      });

      const newImages = await Promise.all(uploadPromises);
      setImages(prevImages => [...prevImages, ...newImages]);

      toast({
        title: "Images uploaded",
        description: "Your images have been successfully uploaded.",
      });
    } catch (err: any) {
      setError(err.message || "Failed to upload images.");
      toast({
        title: "Error uploading images",
        description: err.message || "Failed to upload images.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

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
        is_premium: data.isPremium,
        user_id: user.id,
        // Other fields can be added here
      };

      const { error: insertError } = await supabase
        .from('classifieds')
        .insert([classifiedData]);

      if (insertError) {
        console.error("Error submitting classified:", insertError);
        throw new Error("Failed to submit classified.");
      }

      toast({
        title: "Classified submitted",
        description: "Your classified has been successfully submitted.",
      });

      navigate('/classifieds');
    } catch (err: any) {
      setError(err.message || "Failed to submit classified.");
      toast({
        title: "Error submitting classified",
        description: err.message || "Failed to submit classified.",
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
