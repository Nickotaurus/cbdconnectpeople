
import { Input } from "@/components/ui/input";

interface AssociationFormProps {
  storeName: string;
  city: string;
  onStoreNameChange: (value: string) => void;
  onCityChange: (value: string) => void;
  disabled: boolean;
}

const AssociationForm = ({
  storeName,
  city,
  onStoreNameChange,
  onCityChange,
  disabled
}: AssociationFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="storeName" className="text-sm font-medium">Nom de la boutique</label>
        <Input 
          id="storeName" 
          value={storeName} 
          onChange={(e) => onStoreNameChange(e.target.value)} 
          placeholder="Nom de la boutique"
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="city" className="text-sm font-medium">Ville</label>
        <Input 
          id="city" 
          value={city} 
          onChange={(e) => onCityChange(e.target.value)} 
          placeholder="Ex: Paris, Quimper, etc."
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default AssociationForm;
