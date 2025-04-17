
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AccordionContent } from "@/components/ui/accordion";
import { Percent } from "lucide-react";

interface DiscountFieldsProps {
  formData: {
    originalIncentive: string;
    incentiveDescription: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  storeType?: string;
}

const DiscountFields: React.FC<DiscountFieldsProps> = ({ formData, handleChange, storeType }) => {
  // Only show promo code for ecommerce or both types
  const showPromoCode = storeType === 'ecommerce' || storeType === 'both';
  
  return (
    <AccordionContent>
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label htmlFor="originalIncentive">
            {showPromoCode ? "Code promo et avantage*" : "Avantage en boutique*"}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="originalIncentive" 
            name="originalIncentive" 
            value={formData.originalIncentive} 
            onChange={handleChange} 
            placeholder={showPromoCode ? "Ex: BIENVENUE10" : "Ex: -10% sur votre premier achat"} 
            required
          />
          <p className="text-sm text-muted-foreground">
            {showPromoCode 
              ? "Créez un code promo unique pour votre boutique en ligne" 
              : "Proposez un avantage pour inciter les clients à visiter votre boutique"}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="incentiveDescription">Description de l'avantage*</Label>
          <Input 
            id="incentiveDescription" 
            name="incentiveDescription" 
            value={formData.incentiveDescription} 
            onChange={handleChange} 
            placeholder={showPromoCode 
              ? "Ex: -10% sur votre première commande avec le code BIENVENUE10" 
              : "Ex: Première dégustation offerte pour tout nouvel achat"} 
            required
          />
        </div>
      </div>
    </AccordionContent>
  );
};

export default DiscountFields;
