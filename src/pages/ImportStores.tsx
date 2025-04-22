
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Download, Loader2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { searchCBDShops, getPlaceDetails, convertToStoreFormat } from '@/utils/googlePlacesService';
import { addStore } from '@/utils/data';

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
      // Call searchCBDShops with the correct parameters (we remove the third argument)
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
          // Call getPlaceDetails with only the place_id parameter (removing the second argument)
          const details = await getPlaceDetails(place.place_id);
          
          // Convertir les données au format de notre application
          const storeData = convertToStoreFormat(details);
          
          // Ajouter la boutique à notre base de données
          addStore(storeData);
          
        } catch (error) {
          console.error(`Erreur lors de l'importation de ${place.name}:`, error);
          // Continuer avec les autres boutiques même si une échoue
        }
      }
      
      toast({
        title: "Importation réussie",
        description: `${importProgress.current} boutiques ont été importées avec succès.`,
      });
      
      // Rediriger vers la page de la carte après une importation réussie
      setTimeout(() => navigate('/map'), 1500);
      
    } catch (error) {
      console.error('Erreur globale lors de l\'importation:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'importation');
    } finally {
      setIsImporting(false);
    }
  };

  const selectedCount = searchResults.filter(result => result.selected).length;

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
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Configuration de l'API</CardTitle>
          <CardDescription>
            Vous aurez besoin d'une clé API Google Places pour utiliser cette fonctionnalité.
            <a href="https://developers.google.com/maps/documentation/places/web-service/get-api-key" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-primary underline ml-1">
              Comment obtenir une clé API
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="api-key">Clé API Google Places</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Entrez votre clé API"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="search-query">Terme de recherche</Label>
              <Input
                id="search-query"
                placeholder="Ex: boutique CBD, CBD shop"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                placeholder="Ex: Paris, Lyon, France"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full md:w-auto" 
            onClick={handleSearch} 
            disabled={isSearching || !apiKey}
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recherche en cours...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Rechercher des boutiques CBD
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium">Erreur</h3>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {searchResults.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Résultats de recherche</CardTitle>
              <CardDescription>
                {searchResults.length} boutiques trouvées
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="select-all" 
                checked={searchResults.every(r => r.selected)}
                onCheckedChange={toggleSelectAll}
              />
              <Label htmlFor="select-all">Tout sélectionner</Label>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead className="hidden md:table-cell">Adresse</TableHead>
                    <TableHead className="w-24 text-right">Avis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map(result => (
                    <TableRow key={result.place_id}>
                      <TableCell>
                        <Checkbox 
                          checked={result.selected}
                          onCheckedChange={(checked) => 
                            toggleSelectItem(result.place_id, checked === true)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{result.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{result.formatted_address}</TableCell>
                      <TableCell className="text-right">
                        {result.rating ? (
                          <Badge variant="secondary" className="ml-auto">
                            {result.rating} ★ ({result.user_ratings_total || 0})
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <Badge variant="outline">
                {selectedCount} boutique{selectedCount > 1 ? 's' : ''} sélectionnée{selectedCount > 1 ? 's' : ''}
              </Badge>
            </div>
            <Button 
              onClick={handleImport} 
              disabled={isImporting || selectedCount === 0}
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importation {importProgress.current}/{importProgress.total}
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Importer les boutiques sélectionnées
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ImportStores;
