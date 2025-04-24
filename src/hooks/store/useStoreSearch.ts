
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface UseStoreSearchProps {
  onStoreSelect: (store: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    placeId: string;
    photos?: string[];
    phone?: string;
    website?: string;
    rating?: number;
    totalReviews?: number;
  }) => void;
}

export const useStoreSearch = ({ onStoreSelect }: UseStoreSearchProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Champ vide",
        description: "Veuillez saisir un terme de recherche",
        variant: "default"
      });
      return;
    }

    setIsSearching(true);
    setNoResults(false);
    
    try {
      // Your search logic here
      // This will be implemented by components using this hook
    } catch (error) {
      console.error('Error searching for stores:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rechercher des établissements",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return {
    isSearching,
    setIsSearching,
    noResults,
    setNoResults,
    searchQuery,
    setSearchQuery,
    handleSearch
  };
};
