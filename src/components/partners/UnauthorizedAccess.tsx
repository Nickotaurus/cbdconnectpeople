
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const UnauthorizedAccess = () => {
  return (
    <div className="container max-w-md mx-auto py-16">
      <Card>
        <CardHeader>
          <CardTitle>Accès non autorisé</CardTitle>
          <CardDescription>
            Cette page est réservée aux partenaires CBD Connect People
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Vous devez être enregistré en tant que partenaire pour accéder à cette page.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <a href="/register?role=partner">S'inscrire en tant que partenaire</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UnauthorizedAccess;
