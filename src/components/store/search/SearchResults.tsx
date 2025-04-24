
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface SearchResult {
  place_id: string;
  name?: string;
  formatted_address?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  onSelectPlace: (placeId: string) => void;
}

const SearchResults = ({ results, onSelectPlace }: SearchResultsProps) => {
  if (results.length === 0) return null;
  
  return (
    <div className="my-4 space-y-2">
      <h3 className="text-sm font-semibold">Résultats de la recherche :</h3>
      <div className="space-y-2">
        {results.map((place) => (
          <Button
            key={place.place_id}
            variant="outline"
            className="w-full justify-start text-left h-auto py-2.5"
            onClick={() => onSelectPlace(place.place_id)}
          >
            <div className="flex flex-row gap-2 items-start">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{place.name || "Sans nom"}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {place.formatted_address}
                </p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
