
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Filter, Search } from 'lucide-react';

interface EcommerceFiltersProps {
  searchTerm: string;
  filterSpecialty: string | null;
  allSpecialties: string[];
  onSearch: (term: string) => void;
  onSpecialtyFilter: (specialty: string | null) => void;
}

const EcommerceFilters = ({ 
  searchTerm, 
  filterSpecialty, 
  allSpecialties, 
  onSearch, 
  onSpecialtyFilter 
}: EcommerceFiltersProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher un site e-commerce..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10"
        />
      </div>
      
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
    </div>
  );
};

export default EcommerceFilters;
