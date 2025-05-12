
import React from 'react';
import { Classified, ClassifiedCategory, ClassifiedType } from '@/types/classified';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Tag, Clock, Mail, User } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

interface ClassifiedDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classified: Classified | null;
}

const ClassifiedDetailDialog = ({ open, onOpenChange, classified }: ClassifiedDetailDialogProps) => {
  const getTypeLabel = (type: ClassifiedType) => {
    switch (type) {
      case 'buy': return 'Achat';
      case 'sell': return 'Vente';
      case 'service': return 'Service';
      default: return type;
    }
  };
  
  const getCategoryLabel = (category: ClassifiedCategory) => {
    switch (category) {
      case 'store': return 'Boutique CBD';
      case 'ecommerce': return 'E-commerce CBD';
      case 'realestate': return 'Immobilier CBD';
      case 'employer': return 'Employeur CBD';
      case 'employee': return 'Employé CBD';
      default: return category;
    }
  };
  
  const getTypeBadgeColor = (type: ClassifiedType) => {
    switch (type) {
      case 'buy': return 'bg-blue-100 text-blue-800';
      case 'sell': return 'bg-green-100 text-green-800';
      case 'service': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!classified) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Détails de l'annonce</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {classified.images && classified.images.length > 0 && (
            <div className="h-64 overflow-hidden rounded-md">
              <img 
                src={classified.images[0].url}
                alt={classified.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Badge className={getTypeBadgeColor(classified.type)}>
              {getTypeLabel(classified.type)}
            </Badge>
            
            <Badge variant="outline" className="bg-gray-50">
              <Tag className="h-3 w-3 mr-1" />
              {getCategoryLabel(classified.category)}
            </Badge>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-2">{classified.title}</h2>
            
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{classified.location}</span>
            </div>
            
            {classified.price && (
              <div className="mb-4">
                <Badge variant="secondary" className="text-lg px-4 py-1 font-semibold">
                  {classified.price}
                </Badge>
              </div>
            )}
            
            <div className="bg-muted/30 p-4 rounded-md my-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="whitespace-pre-wrap">{classified.description}</p>
            </div>
            
            <div className="border-t pt-4 mt-6">
              <h3 className="font-medium mb-3">Informations sur l'annonceur</h3>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{classified.user.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{classified.user.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Publiée le {new Date(classified.date).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClassifiedDetailDialog;
