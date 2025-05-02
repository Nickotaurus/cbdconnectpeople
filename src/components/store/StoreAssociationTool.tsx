
import { useState } from 'react';
import { associateStoreWithUser } from '@/utils/storeUtils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface StoreAssociationToolProps {
  defaultEmail?: string;
  defaultStoreName?: string;
}

const StoreAssociationTool = ({ 
  defaultEmail = "histoiredechanvre29@gmail.com",
  defaultStoreName = "CBD Histoire de Chanvre"
}: StoreAssociationToolProps) => {
  const [email, setEmail] = useState(defaultEmail);
  const [storeName, setStoreName] = useState(defaultStoreName);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    storeId?: string;
  }>({});
  const navigate = useNavigate();

  const handleAssociate = async () => {
    if (!email || !storeName) return;

    setProcessing(true);
    setResult({});

    try {
      const response = await associateStoreWithUser(email, storeName);
      setResult(response);
      
      // Si l'association a réussi, attendre 2 secondes avant de rediriger vers la gestion de la boutique
      if (response.success && response.storeId) {
        setTimeout(() => {
          navigate(`/store/${response.storeId}/admin`);
        }, 2000);
      }
    } catch (error) {
      console.error("Erreur lors de l'association:", error);
      setResult({
        success: false,
        message: "Une erreur inattendue s'est produite"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Association de boutique</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email du propriétaire</label>
          <Input 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="email@exemple.com"
            disabled={processing}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="storeName" className="text-sm font-medium">Nom de la boutique</label>
          <Input 
            id="storeName" 
            value={storeName} 
            onChange={(e) => setStoreName(e.target.value)} 
            placeholder="Nom de la boutique"
            disabled={processing}
          />
        </div>

        {result.message && (
          <Alert 
            variant="default" 
            className={
              result.success 
                ? "border-green-200 bg-green-50" 
                : "border-red-200 bg-red-50"
            }
          >
            {result.success ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={
              result.success ? "text-green-800" : "text-red-800"
            }>
              {result.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleAssociate} 
          disabled={processing || !email || !storeName || result.success}
          className="w-full"
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Association en cours...
            </>
          ) : (
            "Associer la boutique au profil"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoreAssociationTool;
