
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, AlertCircle, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface BusinessProfileProps {
  businessDetails: {
    name: string;
    address: string;
    phone?: string;
    website?: string;
    rating?: number;
    totalReviews?: number;
    photos?: string[];
  } | null;
  isLoading: boolean;
  onAccept: () => void;
  onReject: () => void;
}

const GoogleBusinessIntegration = ({
  businessDetails,
  isLoading,
  onAccept,
  onReject
}: BusinessProfileProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-background/40">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
          <p className="text-sm text-muted-foreground">Recherche d'une fiche Google Business...</p>
        </div>
      </div>
    );
  }

  if (!businessDetails) {
    return (
      <Alert variant="default" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Aucune fiche entreprise trouvée</AlertTitle>
        <AlertDescription>
          Votre boutique n'a pas été trouvée sur Google Business. Vous pouvez continuer l'inscription normalement ou 
          créer une fiche Google Business plus tard pour améliorer votre visibilité.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-green-200 bg-green-50 mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Globe className="mr-2 h-5 w-5 text-green-600" />
              Fiche Google Business trouvée
            </CardTitle>
            <CardDescription>
              Nous avons trouvé votre établissement sur Google. Voulez-vous importer ces informations ?
            </CardDescription>
          </div>
          {businessDetails.rating && (
            <div className="bg-white px-2 py-1 rounded-md flex items-center">
              <span className="text-amber-500 mr-1">★</span>
              <span className="font-medium">{businessDetails.rating}</span>
              <span className="text-xs text-muted-foreground ml-1">
                ({businessDetails.totalReviews || 0} avis)
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div>
          <h4 className="font-semibold text-base">{businessDetails.name}</h4>
          <p className="text-sm text-muted-foreground">{businessDetails.address}</p>
          {businessDetails.phone && (
            <p className="text-sm text-muted-foreground">{businessDetails.phone}</p>
          )}
          {businessDetails.website && (
            <p className="text-sm text-blue-600 underline truncate">
              <a href={businessDetails.website} target="_blank" rel="noopener noreferrer">
                {businessDetails.website.replace(/^https?:\/\//, '')}
              </a>
            </p>
          )}
        </div>

        {businessDetails.photos && businessDetails.photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {businessDetails.photos.slice(0, 3).map((photo, index) => (
              <div key={index} className="aspect-square rounded-md overflow-hidden bg-muted">
                <img src={photo} alt={`${businessDetails.name} ${index + 1}`} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" onClick={onReject}>
          Ignorer
        </Button>
        <Button onClick={onAccept} className="gap-1">
          <Check className="h-4 w-4" />
          Utiliser ces informations
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GoogleBusinessIntegration;
