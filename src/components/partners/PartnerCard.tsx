
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, MapPin, Lock } from "lucide-react";
import { PartnerCategory } from "@/types/auth";
import { getCategoryLabel } from "@/utils/partnerUtils";
import { PartnerIcon } from "./PartnerIcon";
import { Partner } from "@/types/partners/partner";

interface PartnerCardProps {
  partner: Partner;
  isProfessional: boolean;
  hasPremium: boolean;
  onContactClick: (partnerId: string) => void;
}

const PartnerCard = ({
  partner,
  isProfessional,
  hasPremium,
  onContactClick
}: PartnerCardProps) => {
  const handleContactClick = () => {
    onContactClick(partner.id);
  };

  return (
    <Card key={partner.id} className="overflow-hidden flex flex-col h-full">
      <div className="h-48 overflow-hidden">
        <img 
          src={partner.imageUrl || 'https://via.placeholder.com/150'} 
          alt={partner.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <Badge variant="secondary" className="flex items-center gap-1 text-base px-3 py-1.5 mb-2 font-semibold">
          <PartnerIcon category={partner.category as PartnerCategory} />
          {getCategoryLabel(partner.category as PartnerCategory)}
        </Badge>
        <CardTitle className="text-xl">{partner.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {partner.location || partner.city || 'Non spécifiée'} {partner.distance && `• ${partner.distance} km`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <p className="text-sm text-muted-foreground mb-3">{partner.description}</p>
        
        {partner.certifications && partner.certifications.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium mb-1.5">Certifications:</p>
            <div className="flex flex-wrap gap-1.5">
              {partner.certifications.map(cert => (
                <Badge key={cert} variant="outline" className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          className="w-full gap-2"
          onClick={handleContactClick}
          variant={hasPremium ? "default" : "secondary"}
        >
          {!hasPremium && <Lock className="h-4 w-4" />}
          {hasPremium ? "Voir les coordonnées" : "Se connecter pour voir"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PartnerCard;
