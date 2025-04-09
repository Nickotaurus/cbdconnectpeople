
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, MapPin, Lock } from "lucide-react";
import { PartnerCategory } from "@/types/auth";

interface PartnerCardProps {
  partner: {
    id: string;
    name: string;
    category: PartnerCategory;
    location: string;
    description: string;
    certifications: string[];
    distance: number;
    imageUrl: string;
  };
  getCategoryIcon: (category: PartnerCategory) => React.ReactNode;
  getCategoryLabel: (category: PartnerCategory) => string;
  isProfessional: boolean;
  hasPremium: boolean;
  onContactClick: (partnerId: string) => void;
}

const PartnerCard = ({
  partner,
  getCategoryIcon,
  getCategoryLabel,
  isProfessional,
  hasPremium,
  onContactClick
}: PartnerCardProps) => {
  return (
    <Card key={partner.id} className="overflow-hidden flex flex-col h-full">
      <div className="h-48 overflow-hidden">
        <img 
          src={partner.imageUrl} 
          alt={partner.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <Badge variant="secondary" className="flex items-center gap-1 text-base px-3 py-1.5 mb-2 font-semibold">
          {getCategoryIcon(partner.category)}
          {getCategoryLabel(partner.category)}
        </Badge>
        <CardTitle className="text-xl">{partner.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {partner.location} • <span>{partner.distance} km</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <p className="text-sm text-muted-foreground mb-3">{partner.description}</p>
        
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
      </CardContent>
      <CardFooter className="pt-2">
        {isProfessional ? (
          <Button 
            className="w-full gap-2"
            onClick={() => onContactClick(partner.id)}
          >
            {!hasPremium && <Lock className="h-4 w-4 mr-1" />}
            {hasPremium ? "Contacter" : "Voir les coordonnées"}
          </Button>
        ) : (
          <Button variant="outline" className="w-full">Voir le détail</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PartnerCard;
