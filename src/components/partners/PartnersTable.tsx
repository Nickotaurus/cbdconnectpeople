
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { PartnerIcon } from "@/components/partners/PartnerIcon";
import { PartnerCategory } from "@/types/auth";

interface Partner {
  id: string;
  name: string;
  category: PartnerCategory;  // Changed from string to PartnerCategory
  description: string;
  isPremium: boolean;
  location: string;
}

interface PartnersTableProps {
  partners: Partner[];
  hasPremium: boolean;
  onViewContact: (partnerId: string) => void;
  getCategoryName: (category: string) => string;
}

const PartnersTable = ({ 
  partners, 
  hasPremium, 
  onViewContact,
  getCategoryName 
}: PartnersTableProps) => {
  const navigate = useNavigate();

  const handleContactClick = (partnerId: string) => {
    if (hasPremium) {
      onViewContact(partnerId);
    } else {
      // Redirect non-premium users to subscription page
      navigate('/partners/subscription');
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Partenaire</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Localisation</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.length > 0 ? (
            partners.map((partner) => (
              <TableRow key={partner.id} className={partner.isPremium ? "bg-primary/5" : ""}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {partner.isPremium && (
                      <span className="bg-primary text-primary-foreground text-xs py-0.5 px-1.5 rounded-sm">
                        Premium
                      </span>
                    )}
                    {partner.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <PartnerIcon category={partner.category} />
                    {getCategoryName(partner.category)}
                  </div>
                </TableCell>
                <TableCell>{partner.location}</TableCell>
                <TableCell className="hidden md:table-cell">{partner.description}</TableCell>
                <TableCell>
                  <Button 
                    variant={hasPremium ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => handleContactClick(partner.id)}
                  >
                    {hasPremium ? "Voir contact" : "Contact premium"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Aucun partenaire trouvé avec les critères sélectionnés
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PartnersTable;
