
import { StoreAssociationToolProps } from './store-association/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useStoreAssociation } from './store-association/useStoreAssociation';
import AssociationForm from './store-association/AssociationForm';
import ResultAlert from './store-association/ResultAlert';
import AssociateButton from './store-association/AssociateButton';

const StoreAssociationTool = ({ 
  defaultEmail = "histoiredechanvre29@gmail.com",
  defaultStoreName = "CBD Histoire de Chanvre",
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
