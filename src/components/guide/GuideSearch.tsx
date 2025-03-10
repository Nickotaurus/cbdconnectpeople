
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface GuideSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const GuideSearch = ({ searchTerm, onSearchChange }: GuideSearchProps) => {
  return (
    <div className="relative mb-8">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        className="pl-10"
        placeholder="Rechercher dans le guide..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default GuideSearch;
