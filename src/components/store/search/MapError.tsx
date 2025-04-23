
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface MapErrorProps {
  error: string;
  errorType: string;
  onRetry: () => void;
  onManualAdd: () => void;
}

const MapError = ({ error, errorType, onRetry, onManualAdd }: MapErrorProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <p className="text-center text-destructive font-medium mb-2">{error}</p>
      <p className="text-center text-muted-foreground mb-4">
        {errorType === 'RefererNotAllowedMapError' 
          ? "L'URL du site n'est pas autorisée à utiliser cette clé API Google Maps. L'administrateur du site doit ajouter ce domaine aux domaines autorisés dans les paramètres de la clé API."
          : "Veuillez vous assurer que la géolocalisation est activée et que votre connexion internet est stable."
        }
      </p>
      <div className="flex gap-2">
        <Button onClick={onRetry}>
          Réessayer
        </Button>
        <Button variant="outline" onClick={onManualAdd}>
          Ajouter manuellement
        </Button>
      </div>
    </div>
  );
};

export default MapError;
