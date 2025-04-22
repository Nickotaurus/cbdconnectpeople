
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface ApiKeyConfigProps {
  apiKey: string;
  searchQuery: string;
  location: string;
  isSearching: boolean;
  onApiKeyChange: (value: string) => void;
  onSearchQueryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
}

const ApiKeyConfig = ({
  apiKey,
  searchQuery,
  location,
  isSearching,
  onApiKeyChange,
  onSearchQueryChange,
  onLocationChange,
  onSearch,
}: ApiKeyConfigProps) => {
  return (
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
            onChange={(e) => onApiKeyChange(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="search-query">Terme de recherche</Label>
            <Input
              id="search-query"
              placeholder="Ex: boutique CBD, CBD shop"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Localisation</Label>
            <Input
              id="location"
              placeholder="Ex: Paris, Lyon, France"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full md:w-auto" 
          onClick={onSearch} 
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
  );
};

export default ApiKeyConfig;
