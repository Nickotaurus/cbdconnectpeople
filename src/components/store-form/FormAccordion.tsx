
import React from 'react';
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Percent, Gift } from "lucide-react";
import PromoCodeFields from './PromoCodeFields';
import LotteryPrizeFields from './LotteryPrizeFields';

interface FormAccordionProps {
  formData: {
    originalIncentive: string;
    incentiveDescription: string;
    lotteryPrizeName: string;
    lotteryPrizeDescription: string;
    lotteryPrizeValue: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FormAccordion: React.FC<FormAccordionProps> = ({ formData, handleChange }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="coupon" className="border-primary/30">
        <AccordionTrigger className="py-4">
          <div className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary" />
            <span className="font-medium">Code Promo (Obligatoire)</span>
          </div>
        </AccordionTrigger>
        <PromoCodeFields formData={formData} handleChange={handleChange} />
      </AccordionItem>
      
      <AccordionItem value="lottery" className="border-primary/30">
        <AccordionTrigger className="py-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            <span className="font-medium">Lot pour la loterie (Facultatif)</span>
          </div>
        </AccordionTrigger>
        <LotteryPrizeFields formData={formData} handleChange={handleChange} />
      </AccordionItem>
    </Accordion>
  );
};

export default FormAccordion;
