
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AccordionContent } from "@/components/ui/accordion";
import { Percent } from "lucide-react";

interface PromoCodeFieldsProps {
  formData: {
    couponCode: string;
    couponDiscount: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PromoCodeFields: React.FC<PromoCodeFieldsProps> = ({ formData, handleChange }) => {
  return (
    <AccordionContent>
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label htmlFor="couponCode">
            Code Promo*
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="couponCode" 
            name="couponCode" 
            value={formData.couponCode} 
            onChange={handleChange} 
            placeholder="Ex: MONCODE10" 
            required
          />
          <p className="text-sm text-muted-foreground">
            Ce code sera utilisé par les clients sur votre boutique ou site web.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="couponDiscount">Description de la remise*</Label>
          <Input 
            id="couponDiscount" 
            name="couponDiscount" 
            value={formData.couponDiscount} 
            onChange={handleChange} 
            placeholder="Ex: 10% sur tout le magasin" 
            required
          />
        </div>
      </div>
    </AccordionContent>
  );
};

export default PromoCodeFields;
