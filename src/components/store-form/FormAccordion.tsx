
import React from 'react';
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Percent, Gift } from "lucide-react";
import DiscountFields from './DiscountFields';
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
  storeType?: string;
}

const FormAccordion: React.FC<FormAccordionProps> = ({ formData, handleChange, storeType }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="discount" className="border-primary/30">
        <AccordionTrigger className="py-4">
          <div className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary" />
            <span className="font-medium">Discount (Obligatoire)</span>
          </div>
        </AccordionTrigger>
        <DiscountFields formData={formData} handleChange={handleChange} storeType={storeType} />
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
