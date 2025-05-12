
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

interface UnauthorizedAccessProps {
  storeId?: string;
}

const UnauthorizedAccessStore = ({ storeId }: UnauthorizedAccessProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-md mx-auto py-8">
      <Card className="border-destructive/30">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-destructive/10 p-3 rounded-full">
              <Lock className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-center">Accès non autorisé</CardTitle>
          <CardDescription className="text-center">
            Vous n'avez pas les permissions pour administrer cette boutique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            L'espace administration de boutique est réservé à l'utilisateur qui l'a revendiqué ou créé.
          </p>
          <div className="flex justify-center mt-4">
            {storeId && (
              <Button variant="outline" onClick={() => navigate(`/store/${storeId}`)}>
                Voir la fiche boutique
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-2">
          <Button onClick={() => navigate("/")}>
            Retour à l'accueil
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UnauthorizedAccessStore;
