
import { ClassifiedCategory } from '@/types/classified';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategorySelectorProps {
  category: ClassifiedCategory | '';
  setCategory: (category: ClassifiedCategory) => void;
}

const CategorySelector = ({ category, setCategory }: CategorySelectorProps) => {
  const categories = [
    { value: 'store', label: 'Boutique CBD' },
    { value: 'ecommerce', label: 'E-commerce CBD' },
    { value: 'realestate', label: 'Immobilier CBD' },
    { value: 'employer', label: 'Employeur CBD' },
    { value: 'employee', label: 'Employé CBD' },
    { value: 'bank', label: 'Banque' },
    { value: 'accountant', label: 'Comptable' },
    { value: 'legal', label: 'Juriste' },
    { value: 'insurance', label: 'Assurance' },
    { value: 'logistics', label: 'Logistique' },
    { value: 'breeder', label: 'Breeder' },
    { value: 'label', label: 'Label' },
    { value: 'association', label: 'Association' },
    { value: 'media', label: 'Média' },
    { value: 'laboratory', label: 'Laboratoire' },
    { value: 'production', label: 'Production' },
    { value: 'realEstate', label: 'Agence immobilière' },
    { value: 'other', label: 'Autre' }
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="category" className="text-base">Catégorie*</Label>
      <Select value={category} onValueChange={(value) => setCategory(value as ClassifiedCategory)}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez une catégorie" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;
