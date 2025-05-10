
import React from 'react';
import { FormData } from '@/types/store/form-types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface DetailsInfoFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const DetailsInfoForm: React.FC<DetailsInfoFormProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Détails complémentaires</h3>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="hasGoogleBusinessProfile" 
          name="hasGoogleBusinessProfile"
          checked={formData.hasGoogleBusinessProfile || false}
          onCheckedChange={(checked) => {
            // Fix: Cast as unknown first, then to the expected type
            const event = { 
              target: { 
                name: 'hasGoogleBusinessProfile', 
                value: checked 
              } 
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleInputChange(event);
          }}
        />
        <Label htmlFor="hasGoogleBusinessProfile">J'ai un profil Google Business</Label>
      </div>
      
      <div className="space-y-4">
        <Label>Horaires d'ouverture</Label>
        <p className="text-sm text-muted-foreground">
          Cette fonctionnalité sera bientôt disponible pour vous permettre d'ajouter vos horaires d'ouverture.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="placeId">Google Place ID (optionnel)</Label>
        <Input 
          id="placeId" 
          name="placeId" 
          value={formData.placeId} 
          onChange={handleInputChange} 
          placeholder="ID Google Places (si disponible)" 
        />
        <p className="text-xs text-muted-foreground mt-1">
          Cet identifiant est utilisé pour récupérer des informations depuis Google Maps.
        </p>
      </div>
    </div>
  );
};

export default DetailsInfoForm;
