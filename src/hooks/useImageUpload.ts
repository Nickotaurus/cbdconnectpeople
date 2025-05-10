
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { storeImage } from '@/types/classified';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const useImageUpload = () => {
  const [images, setImages] = useState<storeImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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

        // Get the public URL
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
      const errorMessage = err.message || "Failed to upload images.";
      setError(errorMessage);
      toast({
        title: "Error uploading images",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    images,
    setImages,
    isUploading,
    error,
    handleImageUpload
  };
};
