
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface PartnerDescriptionFieldProps {
  description: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PartnerDescriptionField = ({ description, handleChange }: PartnerDescriptionFieldProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="description">Description de votre activité</Label>
      <div className="flex gap-2">
        <FileText className="h-4 w-4 mt-3 text-muted-foreground" />
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={handleChange}
          className="flex-1"
          placeholder="Décrivez votre activité, vos services..."
          rows={4}
        />
      </div>
    </div>
  );
};

export default PartnerDescriptionField;
