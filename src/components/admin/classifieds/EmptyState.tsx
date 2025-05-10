
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const EmptyState = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Aucune annonce trouvée</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground">
        <p>Il n'y a aucune annonce à afficher pour le moment.</p>
      </CardContent>
    </Card>
  );
};
