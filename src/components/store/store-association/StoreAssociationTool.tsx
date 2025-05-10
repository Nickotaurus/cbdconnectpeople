
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StoreAssociationToolProps } from './types';
import { useStoreAssociation } from './useStoreAssociation';
import AssociationForm from './AssociationForm';
import ResultAlert from './ResultAlert';
import AssociateButton from './AssociateButton';

const StoreAssociationTool = ({ 
  defaultStoreName = "Histoire de Chanvre",
  defaultCity = "Quimper",
  onSuccess
}: StoreAssociationToolProps) => {
  const {
    storeName,
    setStoreName,
    city,
    setCity,
    processing,
    result,
    handleAssociate
  } = useStoreAssociation(defaultStoreName, defaultCity, onSuccess);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Association de boutique</CardTitle>
        <CardDescription>Associez votre boutique existante à votre profil</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AssociationForm 
          storeName={storeName}
          city={city}
          onStoreNameChange={setStoreName}
          onCityChange={setCity}
          disabled={processing || !!result.success}
        />

        <ResultAlert result={result} />
      </CardContent>
      <CardFooter>
        <AssociateButton 
          onClick={handleAssociate} 
          disabled={processing || !storeName || !!result.success}
          processing={processing}
          success={!!result.success}
        />
      </CardFooter>
    </Card>
  );
};

export default StoreAssociationTool;
