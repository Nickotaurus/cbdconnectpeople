
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface LogoUploadProps {
  onUploadComplete: (url: string) => void;
  logoUrl?: string;
}

const LogoUpload = ({ onUploadComplete, logoUrl }: LogoUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(logoUrl || null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Format non supporté",
        description: "Veuillez choisir une image (JPG, PNG)",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 2MB",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create temporary preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Upload to Supabase Storage
      const fileName = `partner-logo-${Date.now()}-${file.name}`;
      
      // Ensure the bucket exists
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('partner-logos');
      
      if (bucketError && bucketError.message.includes('not found')) {
        // Create the bucket if it doesn't exist
        const { error: createBucketError } = await supabase.storage.createBucket('partner-logos', {
          public: true,
          fileSizeLimit: 2097152, // 2MB
        });
        
        if (createBucketError) {
          throw createBucketError;
        }
      } else if (bucketError) {
        throw bucketError;
      }
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from('partner-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('partner-logos')
        .getPublicUrl(data.path);
      
      // Pass URL back to parent component
      onUploadComplete(publicUrlData.publicUrl);
      
      toast({
        title: "Upload réussi",
        description: "Votre logo a été téléchargé avec succès",
      });
      
    } catch (error: any) {
      console.error("Logo upload error:", error);
      toast({
        title: "Erreur d'upload",
        description: error.message || "Une erreur est survenue durant le téléchargement",
        variant: "destructive",
      });
      
      // Reset preview if upload failed
      if (logoUrl) {
        setPreviewUrl(logoUrl);
      } else {
        setPreviewUrl(null);
      }
      
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="logo">Logo de l'entreprise</Label>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 rounded-md">
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt="Logo" className="object-cover" />
          ) : (
            <AvatarFallback className="rounded-md bg-muted">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1">
          <Input
            id="logo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById('logo')?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-primary rounded-full mr-2"></div>
                Téléchargement...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {previewUrl ? "Changer de logo" : "Télécharger un logo"}
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            Formats acceptés: JPG, PNG. Max: 2MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoUpload;
