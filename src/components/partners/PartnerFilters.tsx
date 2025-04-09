
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, MapPin, Building, Calculator, Briefcase, Shield, Package, Tag, Users } from 'lucide-react';

interface PartnerFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
}

// Partner categories data
export const partnerCategories = [
  { value: "bank", label: "Banque" },
  { value: "accountant", label: "Comptable" },
  { value: "legal", label: "Juriste" },
  { value: "insurance", label: "Assurance" },
  { value: "logistics", label: "Logistique" },
  { value: "breeder", label: "Breeder" },
  { value: "label", label: "Label" },
  { value: "association", label: "Association" },
  { value: "media", label: "Média" },
  { value: "laboratory", label: "Laboratoire" },
  { value: "production", label: "Production" },
  { value: "realEstate", label: "Agence immobilière" }
];

// Locations data
export const locations = [
  { value: "paris", label: "Paris" },
  { value: "lyon", label: "Lyon" },
  { value: "marseille", label: "Marseille" },
  { value: "bordeaux", label: "Bordeaux" },
  { value: "toulouse", label: "Toulouse" },
  { value: "nantes", label: "Nantes" }
];

const PartnerFilters = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  locationFilter,
  setLocationFilter
}: PartnerFiltersProps) => {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-4 mb-8">
      <h2 className="text-lg font-medium mb-4">Filtrer les partenaires</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Rechercher un partenaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="pl-9">
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {partnerCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category.value)}
                    {category.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="pl-9">
              <SelectValue placeholder="Filtrer par localisation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les localisations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

// Utility function to get category icon
export const getCategoryIcon = (category: string) => {
  switch(category) {
    case 'bank':
      return <Building className="h-4 w-4" />;
    case 'accountant':
      return <Calculator className="h-4 w-4" />;
    case 'legal':
      return <Briefcase className="h-4 w-4" />;
    case 'insurance':
      return <Shield className="h-4 w-4" />;
    case 'logistics':
      return <Package className="h-4 w-4" />;
    case 'laboratory':
      return <Tag className="h-4 w-4" />;
    case 'realEstate':
      return <Building className="h-4 w-4" />;
    case 'breeder':
    case 'association':
      return <Users className="h-4 w-4" />;
    default:
      return <Briefcase className="h-4 w-4" />;
  }
};

export default PartnerFilters;
