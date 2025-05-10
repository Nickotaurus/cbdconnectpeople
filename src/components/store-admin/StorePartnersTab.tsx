
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Partner } from "@/types/partners/partner";
import { PartnerCategory } from "@/types/auth";
import { PartnerIcon } from "@/components/partners/PartnerIcon";
import { getCategoryLabel } from "@/utils/partnerUtils";

interface StorePartnersTabProps {
  favoritePartners: Partner[];
  isLoadingPartners: boolean;
}

const StorePartnersTab = ({ favoritePartners, isLoadingPartners }: StorePartnersTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vos partenaires favoris</CardTitle>
        <CardDescription>
          Retrouvez rapidement les partenaires que vous avez marqués comme favoris
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingPartners ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full mx-auto mb-4"></div>
            <p>Chargement de vos partenaires favoris...</p>
          </div>
        ) : favoritePartners.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favoritePartners.map((partner) => (
              <div key={partner.id} className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <PartnerIcon category={partner.category} />
                  <div>
                    <h3 className="font-medium">{partner.name}</h3>
                    <p className="text-sm text-muted-foreground">{getCategoryLabel(partner.category)}</p>
                  </div>
                </div>
                <p className="text-sm mt-2 line-clamp-2">{partner.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">{partner.location}</div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/partners?id=${partner.id}`}>Contacter</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-secondary/50 rounded-md">
            <p className="text-muted-foreground mb-4">
              Vous n'avez aucun partenaire favori pour le moment.
            </p>
            <Button asChild>
              <Link to="/partners">Explorer les partenaires</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StorePartnersTab;
