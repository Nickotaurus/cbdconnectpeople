
import { Briefcase } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { partnerCategories } from '@/data/partnerCategoriesData';

interface PartnerCategorySelectProps {
  category: string;
  handleSelectChange: (name: string, value: string) => void;
}

const PartnerCategorySelect = ({ category, handleSelectChange }: PartnerCategorySelectProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="category">Secteur d'activité</Label>
      <div className="flex gap-2">
        <Briefcase className="h-4 w-4 mt-3 text-muted-foreground" />
        <Select 
          value={category} 
          onValueChange={(value) => handleSelectChange('category', value)}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Sélectionnez votre secteur" />
          </SelectTrigger>
          <SelectContent>
            {partnerCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PartnerCategorySelect;
