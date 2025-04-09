
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockProducers } from '@/data/producersData';
import ProducerFilters from '@/components/producers/ProducerFilters';
import ProducerList from '@/components/producers/ProducerList';
import RegisterCta from '@/components/producers/RegisterCta';
import { Producer } from '@/components/producers/ProducerCard';

const Producers = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducers, setFilteredProducers] = useState<Producer[]>(mockProducers);
  
  const isStore = user?.role === "store";
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredProducers(mockProducers);
      return;
    }
    
    const filtered = mockProducers.filter(
      producer => 
        producer.name.toLowerCase().includes(term.toLowerCase()) ||
        producer.location.toLowerCase().includes(term.toLowerCase()) ||
        producer.varieties.some(v => v.toLowerCase().includes(term.toLowerCase()))
    );
    
    setFilteredProducers(filtered);
  };
  
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
