
import React, { useState, useRef } from 'react';
import { Upload, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';

// Simuler le stockage d'images (dans une vraie application, utilisez un service comme Supabase Storage)
const simulateImageUpload = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // Dans une vraie implémentation, uploadez le fichier vers un service de stockage
    // et renvoyez l'URL
    const reader = new FileReader();
    reader.onloadend = () => {
      // Dans une vraie application, retournez l'URL du serveur
      // Ici nous utilisons juste la base64 pour simuler
      setTimeout(() => {
        resolve(reader.result as string);
      }, 500);
    };
    reader.readAsDataURL(file);
  });
};

interface StoreImageUploadProps {
  type: 'logo' | 'photo';
  label: string;
  onImageUpload: (type: 'logo' | 'photo', url: string) => void;
  previewUrl?: string;
}

const StoreImageUpload = ({ type, label, onImageUpload, previewUrl }: StoreImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(previewUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const imageUrl = await simulateImageUpload(file);
      setPreviewImage(imageUrl);
      onImageUpload(type, imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Mettre à jour le prévisualisation si previewUrl change
  React.useEffect(() => {
    if (previewUrl && previewUrl !== previewImage) {
      setPreviewImage(previewUrl);
    }
  }, [previewUrl]);

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      {previewImage ? (
        <div className="relative aspect-video w-full bg-muted rounded-md overflow-hidden group">
          <img
            src={previewImage}
            alt={`${type} preview`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleButtonClick}
              className="bg-white/90 hover:bg-white"
            >
              Changer l'image
            </Button>
          </div>
          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
            <Check className="h-4 w-4" />
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          className="w-full py-8 border-dashed"
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
              Chargement...
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <span>{label}</span>
              <span className="text-xs text-muted-foreground mt-1">
                JPG, PNG ou GIF, max 5MB
              </span>
            </div>
          )}
        </Button>
      )}
    </div>
  );
};

export default StoreImageUpload;
