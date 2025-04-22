
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { searchCBDShops, getPlaceDetails, convertToStoreFormat } from '@/utils/googlePlacesService';
import { addStore } from '@/utils/data';
import ApiKeyConfig from '@/components/import-stores/ApiKeyConfig';
import SearchResults from '@/components/import-stores/SearchResults';
import ErrorMessage from '@/components/import-stores/ErrorMessage';

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  selected: boolean;
}

const ImportStores = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [searchQuery, setSearchQuery] = useState('boutique CBD');
  const [location, setLocation] = useState('France');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!apiKey) {
      setError('Veuillez entrer une clé API Google Places');
      return;
    }

    setIsSearching(true);
    setError(null);
    
    try {
      const results = await searchCBDShops(searchQuery, location);
      setSearchResults(results.map(result => ({
        ...result,
        selected: true
      })));
    } catch (error) {
      console.error('Erreur de recherche:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la recherche');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    setSearchResults(searchResults.map(result => ({
      ...result,
      selected: checked
    })));
  };

  const toggleSelectItem = (placeId: string, checked: boolean) => {
    setSearchResults(searchResults.map(result => 
      result.place_id === placeId ? { ...result, selected: checked } : result
    ));
  };

  const handleImport = async () => {
    const selectedPlaces = searchResults.filter(result => result.selected);
    
    if (selectedPlaces.length === 0) {
      toast({
        title: "Aucune boutique sélectionnée",
        description: "Veuillez sélectionner au moins une boutique à importer.",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    setImportProgress({ current: 0, total: selectedPlaces.length });
    setError(null);

    try {
      for (let i = 0; i < selectedPlaces.length; i++) {
        const place = selectedPlaces[i];
        setImportProgress({ current: i + 1, total: selectedPlaces.length });
        
        try {
          const details = await getPlaceDetails(place.place_id);
          const storeData = convertToStoreFormat(details);
          addStore(storeData);
        } catch (error) {
          console.error(`Erreur lors de l'importation de ${place.name}:`, error);
        }
      }
      
      toast({
        title: "Importation réussie",
        description: `${importProgress.current} boutiques ont été importées avec succès.`,
      });
      
      setTimeout(() => navigate('/map'), 1500);
      
    } catch (error) {
      console.error('Erreur globale lors de l\'importation:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'importation');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="gap-2" 
          onClick={() => navigate('/map')}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la carte
        </Button>
      </div>
      
      <div className="mb-8 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-2">Importer des boutiques CBD</h1>
        <p className="text-muted-foreground">
          Utilisez l'API Google Places pour rechercher et importer automatiquement des boutiques CBD en France
        </p>
      </div>
      
      <ApiKeyConfig
        apiKey={apiKey}
        searchQuery={searchQuery}
        location={location}
        isSearching={isSearching}
        onApiKeyChange={setApiKey}
        onSearchQueryChange={setSearchQuery}
        onLocationChange={setLocation}
        onSearch={handleSearch}
      />
      
      <ErrorMessage message={error || ''} />
      
      {searchResults.length > 0 && (
        <SearchResults
          results={searchResults}
          isImporting={isImporting}
          importProgress={importProgress}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectItem={toggleSelectItem}
          onImport={handleImport}
        />
      )}
    </div>
  );
};

export default ImportStores;
