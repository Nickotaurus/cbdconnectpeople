
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AccordionContent } from "@/components/ui/accordion";

interface LotteryPrizeFieldsProps {
  formData: {
    lotteryPrizeName: string;
    lotteryPrizeDescription: string;
    lotteryPrizeValue: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const LotteryPrizeFields: React.FC<LotteryPrizeFieldsProps> = ({ formData, handleChange }) => {
  return (
    <AccordionContent>
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label htmlFor="lotteryPrizeName">Nom du lot</Label>
          <Input 
            id="lotteryPrizeName" 
            name="lotteryPrizeName" 
            value={formData.lotteryPrizeName} 
            onChange={handleChange} 
            placeholder="Ex: Coffret découverte CBD" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lotteryPrizeDescription">Description du lot</Label>
          <Textarea 
            id="lotteryPrizeDescription" 
            name="lotteryPrizeDescription" 
            value={formData.lotteryPrizeDescription} 
            onChange={handleChange} 
            placeholder="Ex: Un coffret contenant 5 échantillons de nos meilleures fleurs CBD" 
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lotteryPrizeValue">Valeur estimée du lot (optionnel)</Label>
          <Input 
            id="lotteryPrizeValue" 
            name="lotteryPrizeValue" 
            value={formData.lotteryPrizeValue} 
            onChange={handleChange} 
            placeholder="Ex: 29.99€" 
          />
        </div>
      </div>
    </AccordionContent>
  );
};

export default LotteryPrizeFields;
