
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Mail, Phone, Globe } from "lucide-react";

interface PartnerBasicFieldsProps {
  companyName: string;
  website: string;
  email: string;
  phone: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PartnerBasicFields = ({ companyName, website, email, phone, handleChange }: PartnerBasicFieldsProps) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="companyName" className="flex gap-1">
          Nom de l'entreprise
          <span className="text-destructive">*</span>
        </Label>
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
        <Label htmlFor="email" className="flex gap-1">
          Email
          <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-2">
          <Mail className="h-4 w-4 mt-3 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            className="flex-1"
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone" className="flex gap-1">
          Téléphone
          <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-2">
          <Phone className="h-4 w-4 mt-3 text-muted-foreground" />
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={handleChange}
            className="flex-1"
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="website">
          Site web
        </Label>
        <div className="flex gap-2">
          <Globe className="h-4 w-4 mt-3 text-muted-foreground" />
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
