
import { useState } from 'react';
import { X, Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { storeImage } from "@/types/classified";

interface ImageUploadProps {
  images: storeImage[];
  setImages: React.Dispatch<React.SetStateAction<storeImage[]>>;
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
}

const ImageUpload = ({ images, setImages, onFilesSelected, isUploading }: ImageUploadProps) => {
  const { toast } = useToast();
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      const maxImages = 20; // Fixed limit of 20 images
      
      if (images.length + fileList.length > maxImages) {
        toast({
          title: "Limite de photos atteinte",
          description: "Vous ne pouvez pas dépasser 20 photos au total.",
          variant: "destructive"
        });
        return;
      }
      
      // Pass the files to parent component for handling upload
      onFilesSelected(fileList);
    }
  };
  
  const removeImage = (indexToRemove: number) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      <Label className="text-base">Photos (0-20)</Label>
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square bg-muted rounded-md overflow-hidden group">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-80 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex justify-center">
        <Label 
          htmlFor="image-upload" 
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-secondary/20 ${
            images.length >= 20 || isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 mb-2 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Téléchargement en cours...
                </p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                <p className="mb-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Cliquez pour ajouter des photos</span>
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP (max. 5MB)</p>
              </>
            )}
          </div>
          <Input
            id="image-upload"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={handleImageUpload}
            multiple
            disabled={images.length >= 20 || isUploading}
          />
        </Label>
      </div>
    </div>
  );
};

export default ImageUpload;
