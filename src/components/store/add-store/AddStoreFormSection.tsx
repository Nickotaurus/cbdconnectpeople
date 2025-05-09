
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from 'lucide-react';
import { Store } from '@/types/store';
import ManualStoreSearch from '../ManualStoreSearch';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StoreForm from '@/components/StoreForm';

interface AddStoreFormSectionProps {
  onBackClick: () => void;
  onStoreAdded: (store: Store) => Promise<void>;
  storeType?: string;
  fromRegistration?: boolean;
  requiresSubscription?: boolean; // We keep this prop for backward compatibility
  isTransitioning: boolean;
}

const AddStoreFormSection: React.FC<AddStoreFormSectionProps> = ({
  onBackClick,
  onStoreAdded,
  storeType,
  fromRegistration,
  requiresSubscription,
  isTransitioning
}) => {
  const [selectedStoreData, setSelectedStoreData] = React.useState<any>(null);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="gap-2" 
          onClick={onBackClick}
          disabled={isTransitioning}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
      </div>
      
      <div className="mb-8 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-2">Ajouter votre boutique CBD</h1>
        <p className="text-muted-foreground">
          Recherchez et associez votre boutique à votre profil en quelques étapes simples.
        </p>
      </div>
      
      {!selectedStoreData ? (
        <div className="max-w-lg mx-auto">
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-700">Trouvez votre boutique</AlertTitle>
            <AlertDescription className="text-blue-600">
              Pour commencer, recherchez votre établissement par nom et localité. Cette étape vous permet de récupérer 
              automatiquement toutes vos informations depuis Google Business.
            </AlertDescription>
          </Alert>
          
          <ManualStoreSearch 
            onStoreSelect={(storeData) => {
              setSelectedStoreData(storeData);
            }}
            isRegistration={true}
          />
        </div>
      ) : (
        <Card className="max-w-2xl mx-auto mb-6">
          <CardHeader>
            <CardTitle>Finaliser les informations de votre boutique</CardTitle>
            <CardDescription>
              Nous avons trouvé votre établissement. Complétez ou modifiez les informations si nécessaire.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StoreForm 
              onSuccess={onStoreAdded} 
              storeType={storeType}
              initialStoreData={selectedStoreData}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddStoreFormSection;
