
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download, Loader2 } from "lucide-react";

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  selected: boolean;
}

interface SearchResultsProps {
  results: PlaceResult[];
  isImporting: boolean;
  importProgress: { current: number; total: number };
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelectItem: (placeId: string, checked: boolean) => void;
  onImport: () => void;
}

const SearchResults = ({
  results,
  isImporting,
  importProgress,
  onToggleSelectAll,
  onToggleSelectItem,
  onImport,
}: SearchResultsProps) => {
  const selectedCount = results.filter(result => result.selected).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Résultats de recherche</CardTitle>
          <CardDescription>
            {results.length} boutiques trouvées
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="select-all" 
            checked={results.every(r => r.selected)}
            onCheckedChange={onToggleSelectAll}
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
              {results.map(result => (
                <TableRow key={result.place_id}>
                  <TableCell>
                    <Checkbox 
                      checked={result.selected}
                      onCheckedChange={(checked) => 
                        onToggleSelectItem(result.place_id, checked === true)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">{result.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {result.formatted_address}
                  </TableCell>
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
          onClick={onImport} 
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
  );
};

export default SearchResults;
