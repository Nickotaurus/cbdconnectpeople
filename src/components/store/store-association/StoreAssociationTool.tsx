
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StoreAssociationToolProps } from './types';
import { useStoreAssociation } from './useStoreAssociation';
import AssociationForm from './AssociationForm';
import ResultAlert from './ResultAlert';
import AssociateButton from './AssociateButton';

const StoreAssociationTool = ({ 
  defaultEmail = "histoiredechanvre29@gmail.com",
  defaultStoreName = "Histoire de Chanvre",
  onSuccess
}: StoreAssociationToolProps) => {
  const {
    email,
    setEmail,
    storeName,
    setStoreName,
    processing,
    result,
    handleAssociate
  } = useStoreAssociation(defaultEmail, defaultStoreName, onSuccess);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Association de boutique</CardTitle>
        <CardDescription>Associez votre boutique existante à votre profil</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AssociationForm 
          email={email}
          storeName={storeName}
          onEmailChange={setEmail}
          onStoreNameChange={setStoreName}
          disabled={processing || !!result.success}
        />

        <ResultAlert result={result} />
      </CardContent>
      <CardFooter>
        <AssociateButton 
          onClick={handleAssociate} 
          disabled={processing || !email || !storeName || !!result.success}
          processing={processing}
          success={!!result.success}
        />
      </CardFooter>
    </Card>
  );
};

export default StoreAssociationTool;
