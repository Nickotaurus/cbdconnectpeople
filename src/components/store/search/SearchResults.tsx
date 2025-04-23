
import React from 'react';

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
  if (!results.length) return null;

  return (
    <div className="flex-1 overflow-y-auto">
      <h3 className="font-medium mb-2">Résultats de recherche</h3>
      <div className="space-y-2">
        {results.map((place) => (
          <div 
            key={place.place_id} 
            className="p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
            onClick={() => onSelectPlace(place.place_id)}
          >
            <p className="font-medium">{place.name || "Établissement"}</p>
            <p className="text-sm text-muted-foreground">{place.formatted_address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
