
import { Link } from 'react-router-dom';
import { Briefcase, Store } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BusinessGuideSectionProps {
  content: Array<{
    id: string;
    title: string;
    icon: JSX.Element;
    content: string;
    partnerCategory: string;
  }>;
  searchTerm: string;
  onResetSearch: () => void;
}

const BusinessGuideSection = ({ content, searchTerm, onResetSearch }: BusinessGuideSectionProps) => {
  return (
    <>
      {content.length > 0 ? (
        <div className="grid gap-6">
          {content.map((item) => (
            <Card key={item.id} className="relative overflow-hidden">
              <span className="absolute top-0 right-0 bg-primary/10 px-3 py-1 text-xs font-medium rounded-bl-lg">
                Professionnel
              </span>
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  {item.icon}
                </div>
                <div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>Guide spécifique pour les professionnels du CBD</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <p>{item.content}</p>
                <div className="flex justify-end">
                  <Link to={`/partners?category=${item.partnerCategory}`}>
                    <Button variant="outline">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Trouver un partenaire
                    </Button>
                  </Link>
                </div>
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
      
      <div className="mt-8 p-6 border rounded-lg bg-primary/5">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 rounded-full bg-primary/10">
            <Store className="h-12 w-12 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Vous êtes un professionnel du CBD ?</h3>
            <p className="mb-4 text-muted-foreground">
              Accédez à notre annuaire de partenaires spécialisés pour vous accompagner dans le développement 
              de votre activité : banques, assurances, comptables, et bien plus encore.
            </p>
            <Link to="/partners">
              <Button>
                <Briefcase className="mr-2 h-4 w-4" />
                Consulter l'annuaire des partenaires
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessGuideSection;
