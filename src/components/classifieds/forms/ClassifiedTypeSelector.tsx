
import { ClassifiedType } from '@/types/classified';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ClassifiedTypeSelectorProps {
  type: ClassifiedType | '';
  setType: (type: ClassifiedType) => void;
}

const ClassifiedTypeSelector = ({ type, setType }: ClassifiedTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-base">Type d'annonce*</Label>
      <RadioGroup 
        value={type} 
        onValueChange={(value) => setType(value as ClassifiedType)} 
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sell" id="sell" />
          <Label htmlFor="sell" className="font-normal">Offre (vous vendez)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="buy" id="buy" />
          <Label htmlFor="buy" className="font-normal">Demande (vous achetez)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="service" id="service" />
          <Label htmlFor="service" className="font-normal">Service</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ClassifiedTypeSelector;
