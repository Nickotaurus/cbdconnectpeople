
import React from 'react';
import { Classified, ClassifiedType, ClassifiedCategory } from '@/types/classified';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Tag, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClassifiedCardProps {
  classified: Classified;
  onViewClick: (classified: Classified) => void;
}

const ClassifiedCard = ({ classified, onViewClick }: ClassifiedCardProps) => {
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

  return (
    <Card key={classified.id} className={cn("overflow-hidden", classified.isPremium && "border-2 border-primary")}>
      {classified.images && classified.images.length > 0 && (
        <div className="h-48 overflow-hidden">
          <img 
            src={classified.images[0].url}
            alt={classified.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className={cn("pb-2", !classified.images && "pt-6")}>
        <div className="flex justify-between items-start mb-2">
          <Badge className={getTypeBadgeColor(classified.type)}>
            {getTypeLabel(classified.type)}
          </Badge>
          {classified.isPremium && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              Premium
            </Badge>
          )}
        </div>
        
        <CardTitle className="text-xl">{classified.title}</CardTitle>
        
        <div className="flex items-center gap-2 mt-1">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <CardDescription>{classified.location}</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {classified.description}
        </p>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="bg-gray-50">
            <Tag className="h-3 w-3 mr-1" />
            {getCategoryLabel(classified.category)}
          </Badge>
          
          {classified.price && (
            <Badge variant="secondary" className="font-semibold">
              {classified.price}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          {new Date(classified.date).toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          })}
        </div>
        
        <Button 
          variant="default"
          onClick={() => onViewClick(classified)}
        >
          Voir l'annonce
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClassifiedCard;
