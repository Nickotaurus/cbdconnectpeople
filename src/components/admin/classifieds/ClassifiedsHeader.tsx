
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import { ClassifiedStatus } from "@/types/classified";

interface ClassifiedsHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: ClassifiedStatus | 'all';
  setStatusFilter: (value: ClassifiedStatus | 'all') => void;
}

export const ClassifiedsHeader = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter
}: ClassifiedsHeaderProps) => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Administration des annonces</h1>
          <p className="text-muted-foreground">
            Validez, modifiez ou rejetez les annonces soumises par les utilisateurs
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value as ClassifiedStatus | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="approved">Approuvées</SelectItem>
              <SelectItem value="rejected">Rejetées</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mb-6 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher dans les annonces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtres avancés
        </Button>
      </div>
    </>
  );
};
