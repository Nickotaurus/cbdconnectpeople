
import { Filter, Search, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ProducerFiltersProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProducerFilters = ({ searchTerm, onSearchChange }: ProducerFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher par nom, région ou variété..."
          value={searchTerm}
          onChange={onSearchChange}
          className="pl-10"
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrer
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>
            Tous les producteurs
          </DropdownMenuItem>
          <DropdownMenuItem>
            Culture indoor
          </DropdownMenuItem>
          <DropdownMenuItem>
            Culture outdoor
          </DropdownMenuItem>
          <DropdownMenuItem>
            Certifié Bio
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button variant="outline" className="gap-2">
        <MapPin className="h-4 w-4" />
        Proximité
      </Button>
    </div>
  );
};

export default ProducerFilters;
