
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Filter, Search, MapPin } from 'lucide-react';
import { PartnerCategory } from '@/types/auth';
import { getCategoryIcon } from "@/utils/partnerUtils";
import React from "react";

interface PartnerSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  handleCategoryFilter: (category: string) => void;
  partnerCategories: {
    value: string;
    label: string;
    iconName: string;
  }[];
  getCategoryLabel: (categoryValue: PartnerCategory) => string;
}

const PartnerSearchFilters = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  handleCategoryFilter,
  partnerCategories,
  getCategoryLabel
}: PartnerSearchFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher par nom, région ou service..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            {categoryFilter === 'all' ? 'Toutes catégories' : getCategoryLabel(categoryFilter as PartnerCategory)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => handleCategoryFilter('all')}>
            Toutes catégories
          </DropdownMenuItem>
          {partnerCategories.map((category) => (
            <DropdownMenuItem 
              key={category.value} 
              onClick={() => handleCategoryFilter(category.value)}
              className="flex items-center gap-2"
            >
              {getCategoryIcon(category.value as PartnerCategory)}
              {category.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button variant="outline" className="gap-2">
        <MapPin className="h-4 w-4" />
        Proximité
      </Button>
    </div>
  );
};

export default PartnerSearchFilters;
