
import React from 'react';
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  isSearching: boolean;
  noResults: boolean;
}

const SearchBar = ({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  isSearching,
  noResults
}: SearchBarProps) => {
  return (
    <div className="absolute left-0 right-0 top-0 p-4 z-20">
      <div className="bg-white rounded-md shadow-md p-3">
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Rechercher une boutique CBD..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch();
              }
            }}
            disabled={isSearching}
          />
          <Button 
            onClick={onSearch} 
            disabled={isSearching}
            variant="default"
          >
            {isSearching ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Rechercher
          </Button>
        </div>
        
        {noResults && (
          <div className="p-2 bg-amber-50 text-amber-800 rounded-md flex items-center text-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>Aucune boutique CBD trouvée. Utilisez des termes différents ou ajoutez votre boutique manuellement.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
