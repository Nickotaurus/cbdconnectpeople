
import { useState } from 'react';
import { Filter, Search, MapPin, Leaf } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator, 
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type FilterOptions = {
  cultivationType: string | null;
  certifications: string[];
}

interface ProducerFiltersProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const ProducerFilters = ({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFilterChange 
}: ProducerFiltersProps) => {
  // Available certification options
  const certificationOptions = ["Bio", "Sans pesticides", "Eco-responsable", "Qualité Premium"];
  
  // Update cultivation type filter
  const handleCultivationTypeChange = (type: string | null) => {
    onFilterChange({
      ...filters,
      cultivationType: type
    });
  };
  
  // Toggle certification filter
  const toggleCertification = (certification: string) => {
    const currentCertifications = [...filters.certifications];
    
    if (currentCertifications.includes(certification)) {
      onFilterChange({
        ...filters,
        certifications: currentCertifications.filter(c => c !== certification)
      });
    } else {
      onFilterChange({
        ...filters,
        certifications: [...currentCertifications, certification]
      });
    }
  };

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
            <Leaf className="h-4 w-4" />
            Culture
            {filters.cultivationType && <span className="ml-1 bg-primary/20 rounded-full w-2 h-2"></span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem 
            onClick={() => handleCultivationTypeChange(null)}
            className={!filters.cultivationType ? "bg-accent" : ""}
          >
            Tous les types
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleCultivationTypeChange("Indoor")}
            className={filters.cultivationType === "Indoor" ? "bg-accent" : ""}
          >
            Culture indoor
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleCultivationTypeChange("Outdoor")}
            className={filters.cultivationType === "Outdoor" ? "bg-accent" : ""}
          >
            Culture outdoor
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleCultivationTypeChange("Greenhouse")}
            className={filters.cultivationType === "Greenhouse" ? "bg-accent" : ""}
          >
            Sous serre
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Certifications
            {filters.certifications.length > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-white">
                {filters.certifications.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Certifications</h4>
              <p className="text-sm text-muted-foreground">
                Sélectionnez les certifications recherchées
              </p>
            </div>
            <div className="grid gap-2">
              {certificationOptions.map((cert) => (
                <div key={cert} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cert-${cert}`}
                    checked={filters.certifications.includes(cert)}
                    onCheckedChange={() => toggleCertification(cert)}
                  />
                  <Label htmlFor={`cert-${cert}`}>{cert}</Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Button variant="outline" className="gap-2">
        <MapPin className="h-4 w-4" />
        Proximité
      </Button>
    </div>
  );
};

export default ProducerFilters;
