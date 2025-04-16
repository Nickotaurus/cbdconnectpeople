
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
      <Label htmlFor="description" className="flex gap-1">
        Description de votre activité
        <span className="text-destructive">*</span>
      </Label>
      <div className="flex gap-2">
        <FileText className="h-4 w-4 mt-3 text-muted-foreground" />
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={handleChange}
          className="flex-1"
          placeholder="Dites-nous quel service vous pouvez apporter à d'autres entreprises liées au CBD"
          rows={4}
          required
        />
      </div>
    </div>
  );
};

export default PartnerDescriptionField;
