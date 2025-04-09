
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AccordionContent } from "@/components/ui/accordion";
import { Gift } from "lucide-react";

interface PromoCodeFieldsProps {
  formData: {
    originalIncentive: string;
    incentiveDescription: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PromoCodeFields: React.FC<PromoCodeFieldsProps> = ({ formData, handleChange }) => {
  return (
    <AccordionContent>
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label htmlFor="originalIncentive">
            Avantage Original*
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="originalIncentive" 
            name="originalIncentive" 
            value={formData.originalIncentive} 
            onChange={handleChange} 
            placeholder="Ex: Dégustation gratuite de tisane CBD" 
            required
          />
          <p className="text-sm text-muted-foreground">
            Créez un avantage unique qui donnera envie aux clients de visiter votre boutique.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="incentiveDescription">Description de l'avantage*</Label>
          <Input 
            id="incentiveDescription" 
            name="incentiveDescription" 
            value={formData.incentiveDescription} 
            onChange={handleChange} 
            placeholder="Ex: Première dégustation offerte pour tout nouvel achat" 
            required
          />
        </div>
      </div>
    </AccordionContent>
  );
};

export default PromoCodeFields;
