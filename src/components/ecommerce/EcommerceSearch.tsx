
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface EcommerceSearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

const EcommerceSearch = ({ searchTerm, onSearch }: EcommerceSearchProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Rechercher un site e-commerce..."
        value={searchTerm}
        onChange={handleSearch}
        className="pl-10"
      />
    </div>
  );
};

export default EcommerceSearch;
