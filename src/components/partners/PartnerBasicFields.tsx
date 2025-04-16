
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";

interface PartnerBasicFieldsProps {
  companyName: string;
  website: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PartnerBasicFields = ({ companyName, website, handleChange }: PartnerBasicFieldsProps) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="companyName">Nom de l'entreprise</Label>
        <div className="flex gap-2">
          <Building className="h-4 w-4 mt-3 text-muted-foreground" />
          <Input
            id="companyName"
            name="companyName"
            value={companyName}
            onChange={handleChange}
            className="flex-1"
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="website">Site web</Label>
        <div className="flex gap-2">
          <Building className="h-4 w-4 mt-3 text-muted-foreground" />
          <Input
            id="website"
            name="website"
            type="url"
            value={website}
            onChange={handleChange}
            className="flex-1"
            placeholder="https://www.example.com"
          />
        </div>
      </div>
    </>
  );
};

export default PartnerBasicFields;
