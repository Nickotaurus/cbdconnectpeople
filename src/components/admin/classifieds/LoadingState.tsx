
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LoadingState = () => {
  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Chargement des annonces</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>Veuillez patienter pendant le chargement des annonces...</p>
        </CardContent>
      </Card>
    </div>
  );
};
