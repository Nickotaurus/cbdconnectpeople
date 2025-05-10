
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Check, Image as ImageIcon } from 'lucide-react';

interface LogoUploadProps {
  onUpload: (file: File) => Promise<string | null>;
  currentLogoUrl?: string | null;
  isUploading?: boolean;
}

const LogoUpload = ({ onUpload, currentLogoUrl, isUploading = false }: LogoUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Valider le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }
    
    // Valider la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. La taille maximale est de 2MB.');
      return;
    }
    
    // Créer une prévisualisation locale
    const objUrl = URL.createObjectURL(file);
    setPreviewUrl(objUrl);
    
    // Envoyer le fichier pour téléchargement
    const logoUrl = await onUpload(file);
    
    // Si le téléchargement échoue, restaurer l'ancienne prévisualisation
    if (!logoUrl && currentLogoUrl) {
      setPreviewUrl(currentLogoUrl);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      {previewUrl ? (
        <div className="relative overflow-hidden rounded-md border border-border">
          <img
            src={previewUrl}
            alt="Logo de la boutique"
            className="w-full h-48 object-contain bg-secondary/20 p-4"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
            <Button
              variant="secondary"
              onClick={handleButtonClick}
              disabled={isUploading}
              className="bg-white hover:bg-gray-100 text-black"
            >
              {isUploading ? 'Chargement...' : 'Modifier le logo'}
            </Button>
          </div>
          {!isUploading && (
            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          className="w-full h-48 border-dashed flex flex-col items-center justify-center gap-2"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <div className="animate-spin h-8 w-8 border-2 border-current border-t-transparent rounded-full" />
              <span>Téléchargement en cours...</span>
            </>
          ) : (
            <>
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
              <div className="text-center">
                <p>Déposer votre logo ici</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ou cliquer pour sélectionner un fichier<br/>
                  JPG, PNG ou GIF, max 2MB
                </p>
              </div>
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default LogoUpload;
