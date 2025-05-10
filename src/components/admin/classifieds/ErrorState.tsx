
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ErrorState = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto text-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Une erreur est survenue</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>Impossible de charger les annonces. Veuillez réessayer plus tard.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
