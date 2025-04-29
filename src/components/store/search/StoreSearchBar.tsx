
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle } from "lucide-react";

interface StoreSearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  isSearching: boolean;
  noResults: boolean;
}

const StoreSearchBar = ({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  isSearching,
  noResults
}: StoreSearchBarProps) => {
  return (
    <div className="absolute left-0 right-0 top-0 p-4 z-20">
      <div className="bg-white rounded-md shadow-md p-3">
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Rechercher votre boutique..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (searchQuery.trim()) {
                  onSearch();
                }
              }
            }}
            disabled={isSearching}
          />
          <Button 
            onClick={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                onSearch();
              }
            }} 
            disabled={isSearching || !searchQuery.trim()}
            variant="default"
            type="button"
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
            <span>Aucun résultat trouvé. Essayez des termes différents ou ajoutez votre boutique manuellement.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreSearchBar;
