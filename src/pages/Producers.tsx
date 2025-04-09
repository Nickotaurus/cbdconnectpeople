
import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockProducers } from '@/data/producersData';
import ProducerFilters, { FilterOptions } from '@/components/producers/ProducerFilters';
import ProducerList from '@/components/producers/ProducerList';
import RegisterCta from '@/components/producers/RegisterCta';
import { Producer } from '@/components/producers/ProducerCard';

const Producers = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    cultivationType: null,
    certifications: [],
  });
  
  const isStore = user?.role === "store";
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  const filteredProducers = useMemo(() => {
    return mockProducers.filter(producer => {
      // Search term filter
      const matchesSearch = !searchTerm.trim() || 
        producer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producer.varieties.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (!matchesSearch) return false;
      
      // Cultivation type filter
      const matchesCultivationType = !filters.cultivationType || 
        producer.cultivationType === filters.cultivationType;
      
      if (!matchesCultivationType) return false;
      
      // Certifications filter
      const matchesCertifications = filters.certifications.length === 0 || 
        filters.certifications.every(cert => producer.certifications.includes(cert));
      
      return matchesCertifications;
    });
  }, [searchTerm, filters, mockProducers]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Annuaire des partenaires</h1>
          <p className="text-muted-foreground">
            {isStore 
              ? "Connectez-vous directement avec les meilleurs producteurs de CBD et de chanvre" 
              : "Découvrez les producteurs qui fournissent les meilleures boutiques CBD en France"}
          </p>
        </div>
        
        <ProducerFilters 
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        
        {!isStore && <RegisterCta />}
        
        <ProducerList 
          producers={filteredProducers}
          isStore={isStore}
        />
      </div>
    </div>
  );
};

export default Producers;
