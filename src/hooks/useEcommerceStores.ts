
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { ClientUser } from '@/types/auth';
import { EcommerceStore } from '@/types/ecommerce';
import { getEcommerceStores } from '@/services/ecommerceStoreService';
import { filterStores, extractAllSpecialties } from '@/utils/ecommerceFilters';

export const useEcommerceStores = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const clientUser = user as ClientUser;
  const [isLoading, setIsLoading] = useState(true);
  const [stores, setStores] = useState<EcommerceStore[]>([]);
  const [filteredStores, setFilteredStores] = useState<EcommerceStore[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState<string | null>(null);
  const [favoriteEcommerces, setFavoriteEcommerces] = useState<string[]>([]);

  useEffect(() => {
    fetchEcommerceStores();
    
    if (user?.role === 'client' && clientUser?.favorites) {
      setFavoriteEcommerces(clientUser.favorites.filter(id => id.startsWith('ec')));
    }
  }, [user]);

  const fetchEcommerceStores = async () => {
    setIsLoading(true);
    try {
      const storeData = await getEcommerceStores();
      setStores(storeData);
      setFilteredStores(storeData);
    } catch (error) {
      console.error('Error in useEcommerceStores:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les e-commerces CBD.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilteredStores(filterStores(stores, term, filterSpecialty));
  };
  
  const handleSpecialtyFilter = (specialty: string | null) => {
    setFilterSpecialty(specialty);
    setFilteredStores(filterStores(stores, searchTerm, specialty));
  };

  return {
    stores,
    filteredStores,
    isLoading,
    searchTerm,
    filterSpecialty,
    favoriteEcommerces,
    setFavoriteEcommerces,
    handleSearch,
    handleSpecialtyFilter,
    allSpecialties: extractAllSpecialties(stores)
  };
};
