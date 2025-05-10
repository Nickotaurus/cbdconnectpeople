
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface EcommerceSpecialtyFilterProps {
  filterSpecialty: string | null;
  allSpecialties: string[];
  onSpecialtyFilter: (specialty: string | null) => void;
}

const EcommerceSpecialtyFilter = ({ 
  filterSpecialty, 
  allSpecialties, 
  onSpecialtyFilter 
}: EcommerceSpecialtyFilterProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          {filterSpecialty || 'Filtrer par spécialité'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSpecialtyFilter(null)}>
          Toutes les spécialités
        </DropdownMenuItem>
        {allSpecialties.map((specialty) => (
          <DropdownMenuItem 
            key={specialty}
            onClick={() => onSpecialtyFilter(specialty)}
          >
            {specialty}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EcommerceSpecialtyFilter;
