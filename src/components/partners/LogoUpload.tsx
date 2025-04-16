
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface LogoUploadProps {
  onUploadComplete: (url: string) => void;
}

const LogoUpload = ({ onUploadComplete }: LogoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Créer un aperçu
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Générer un nom unique pour le fichier
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;

      // Uploader le fichier
      const { data, error } = await supabase.storage
        .from('partner-logos')
        .upload(fileName, file);

      if (error) throw error;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('partner-logos')
        .getPublicUrl(fileName);

      onUploadComplete(publicUrl);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du logo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="logo">Logo de l'entreprise</Label>
      </div>

      <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-lg">
        {preview ? (
          <div className="relative w-32 h-32">
            <img
              src={preview}
              alt="Aperçu du logo"
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-32 h-32 flex items-center justify-center bg-muted/30 rounded-lg">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            className="relative"
          >
            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Téléchargement...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {preview ? 'Changer le logo' : 'Ajouter un logo'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoUpload;
