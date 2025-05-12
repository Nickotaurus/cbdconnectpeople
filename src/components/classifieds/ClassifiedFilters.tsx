
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search } from 'lucide-react';
import AdvancedFiltersPopover from './AdvancedFiltersPopover';

interface ClassifiedFiltersProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (value: string) => void;
  onAdvancedFilterChange: (filters: {
    minPrice?: string;
    maxPrice?: string;
    dateFrom?: Date;
    isPremium?: boolean;
  }) => void;
  advancedFilters: {
    minPrice?: string;
    maxPrice?: string;
    dateFrom?: Date;
    isPremium?: boolean;
  };
}

const ClassifiedFilters = ({ 
  searchTerm, 
  onSearchChange, 
  onTypeChange,
  onAdvancedFilterChange,
  advancedFilters
}: ClassifiedFiltersProps) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-3xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une annonce..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-10"
          />
        </div>
        
        <AdvancedFiltersPopover 
          onFilterChange={onAdvancedFilterChange}
          filters={advancedFilters}
        />
        
        <Button variant="default" className="gap-2">
          <MapPin className="h-4 w-4" />
          Carte
        </Button>
      </div>
      
      <Tabs defaultValue="all" onValueChange={onTypeChange} className="w-full max-w-3xl mx-auto">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="buy">Achat</TabsTrigger>
          <TabsTrigger value="sell">Vente</TabsTrigger>
          <TabsTrigger value="service">Services</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
};

export default ClassifiedFilters;
