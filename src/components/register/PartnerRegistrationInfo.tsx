
import { TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PartnerCategory } from '@/types/auth';
import { partnerCategories } from '@/data/partnerCategoriesData';

interface PartnerRegistrationInfoProps {
  partnerCategory: PartnerCategory | '';
  setPartnerCategory: (category: PartnerCategory | '') => void;
}

const PartnerRegistrationInfo = ({ partnerCategory, setPartnerCategory }: PartnerRegistrationInfoProps) => {
  return (
    <TabsContent value="partner" className="mt-2">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Proposez vos services spécialisés aux professionnels du CBD et développez votre activité.
        </p>
        
        <div className="grid gap-2">
          <Label htmlFor="partnerCategory">Catégorie de partenaire</Label>
          <Select 
            value={partnerCategory} 
            onValueChange={(value) => {
              // Ensure value is cast to the correct type
              setPartnerCategory(value as PartnerCategory | '');
            }}
          >
            <SelectTrigger id="partnerCategory">
              <SelectValue placeholder="Sélectionnez votre activité" />
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
    </TabsContent>
  );
};

export default PartnerRegistrationInfo;
