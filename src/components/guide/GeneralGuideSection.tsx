
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GeneralGuideSectionProps {
  content: Array<{ id: string; title: string; content: string }>;
  searchTerm: string;
  onResetSearch: () => void;
}

const GeneralGuideSection = ({ content, searchTerm, onResetSearch }: GeneralGuideSectionProps) => {
  return (
    <>
      {content.length > 0 ? (
        <div className="grid gap-6">
          {content.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Aucun résultat trouvé pour "{searchTerm}"</p>
          <Button variant="outline" className="mt-4" onClick={onResetSearch}>
            Réinitialiser la recherche
          </Button>
        </div>
      )}
    </>
  );
};

export default GeneralGuideSection;
