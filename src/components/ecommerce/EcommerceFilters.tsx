
import EcommerceSearch from './EcommerceSearch';
import EcommerceSpecialtyFilter from './EcommerceSpecialtyFilter';

interface EcommerceFiltersProps {
  searchTerm: string;
  filterSpecialty: string | null;
  allSpecialties: string[];
  onSearch: (term: string) => void;
  onSpecialtyFilter: (specialty: string | null) => void;
}

const EcommerceFilters = ({ 
  searchTerm, 
  filterSpecialty, 
  allSpecialties, 
  onSearch, 
  onSpecialtyFilter 
}: EcommerceFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
      <EcommerceSearch 
        searchTerm={searchTerm} 
        onSearch={onSearch} 
      />
      <EcommerceSpecialtyFilter 
        filterSpecialty={filterSpecialty}
        allSpecialties={allSpecialties}
        onSpecialtyFilter={onSpecialtyFilter}
      />
    </div>
  );
};

export default EcommerceFilters;
