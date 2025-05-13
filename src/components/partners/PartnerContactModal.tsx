
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone, Mail, MapPin, Globe, X } from "lucide-react";
import { Partner } from "@/types/partners/partner";

interface PartnerContactModalProps {
  partner: Partner | null;
  isOpen: boolean;
  onClose: () => void;
}

const PartnerContactModal = ({ partner, isOpen, onClose }: PartnerContactModalProps) => {
  if (!partner) return null;

  // Données fictives pour les coordonnées (normalement elles viendraient de la base de données)
  const contactInfo = {
    phone: partner.phone || "+33 1 23 45 67 89",
    email: partner.email || `contact@${partner.name.toLowerCase().replace(/\s/g, "-")}.com`,
    address: (partner.location || partner.city || partner.address || 'Non spécifiée') + ", France",
    website: partner.website || `https://www.${partner.name.toLowerCase().replace(/\s/g, "-")}.fr`,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Coordonnées de {partner.name}
          </DialogTitle>
          <DialogDescription>
            Vous pouvez contacter ce partenaire directement via les coordonnées ci-dessous.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <a href={`tel:${contactInfo.phone}`} className="text-primary hover:underline">
              {contactInfo.phone}
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">
              {contactInfo.email}
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span>{contactInfo.address}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <a 
              href={contactInfo.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline"
            >
              {contactInfo.website}
            </a>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerContactModal;
