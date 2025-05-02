
import { Input } from "@/components/ui/input";

interface AssociationFormProps {
  email: string;
  storeName: string;
  onEmailChange: (value: string) => void;
  onStoreNameChange: (value: string) => void;
  disabled: boolean;
}

const AssociationForm = ({
  email,
  storeName,
  onEmailChange,
  onStoreNameChange,
  disabled
}: AssociationFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email du propriétaire</label>
        <Input 
          id="email" 
          value={email} 
          onChange={(e) => onEmailChange(e.target.value)} 
          placeholder="email@exemple.com"
          disabled={disabled}
        />
      </div>
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
    </div>
  );
};

export default AssociationForm;
