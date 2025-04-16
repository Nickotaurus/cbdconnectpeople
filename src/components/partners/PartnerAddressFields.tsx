
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PartnerAddressFieldsProps {
  address: string;
  city: string;
  postalCode: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PartnerAddressFields = ({ 
  address, 
  city, 
  postalCode, 
  handleChange 
}: PartnerAddressFieldsProps) => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="address" className="flex gap-1">
            Adresse
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="address"
            name="address"
            value={address}
            onChange={handleChange}
            placeholder="Rue, numéro..."
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="city" className="flex gap-1">
            Ville
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            name="city"
            value={city}
            onChange={handleChange}
            placeholder="ex: Paris"
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="postalCode" className="flex gap-1">
          Code postal
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="postalCode"
          name="postalCode"
          value={postalCode}
          onChange={handleChange}
          placeholder="ex: 75001"
          required
        />
      </div>
    </>
  );
};

export default PartnerAddressFields;
