
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface SubscriptionOffer {
  id: string;
  title: string;
  description: string;
  prices: {
    yearly: number;
    biennial: number;
  };
  savings: number;
  benefits: string[];
  icon: React.ReactNode;
}

interface PartnerOfferCardProps {
  offer: SubscriptionOffer;
  selectedDuration: string;
  onSelectDuration: (duration: string) => void;
  isPremium?: boolean;
}

const PartnerOfferCard = ({ 
  offer, 
  selectedDuration, 
  onSelectDuration,
  isPremium 
}: PartnerOfferCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className={`border ${isPremium ? 'border-2 border-primary' : 'border-primary/20'} overflow-hidden`}
    >
      {isPremium && (
        <Badge className="absolute top-4 right-4 bg-primary">Recommandé</Badge>
      )}
      
      <div className={`px-6 py-4 flex items-center justify-between ${isPremium ? 'bg-primary/20' : 'bg-primary/10'}`}>
        <div>
          <h3 className="text-xl font-bold">{offer.title}</h3>
          <p className="text-sm text-muted-foreground">{offer.description}</p>
        </div>
        {offer.icon}
      </div>
      
      <CardContent className="pt-6">
        <div className="flex gap-4 mb-6">
          <div 
            className={`cursor-pointer flex-1 text-center px-4 py-3 rounded-lg border ${
              selectedDuration === "1" 
                ? "border-primary bg-primary/10" 
                : "border-muted bg-muted/50"
            }`}
            onClick={() => onSelectDuration("1")}
          >
            <p className="font-medium">1 An</p>
            <p className="text-lg font-bold mt-1">{offer.prices.yearly}€</p>
          </div>
          
          <div 
            className={`cursor-pointer flex-1 text-center px-4 py-3 rounded-lg border relative overflow-hidden ${
              selectedDuration === "2" 
                ? "border-primary bg-primary/10" 
                : "border-muted bg-muted/50"
            }`}
            onClick={() => onSelectDuration("2")}
          >
            <div className="absolute -right-7 -top-1 bg-primary text-primary-foreground px-8 py-0.5 text-xs rotate-45">
              -{offer.savings}€
            </div>
            <p className="font-medium">2 Ans</p>
            <p className="text-lg font-bold mt-1">{offer.prices.biennial}€</p>
            <p className="text-xs text-muted-foreground mt-1">
              au lieu de {offer.prices.yearly * 2}€
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium">Ce que vous obtenez :</h4>
          <ul className="space-y-2">
            {offer.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="mt-1">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">{benefit}</span>
              </li>
            ))}
          </ul>
          
          <div className="pt-4 bg-muted/30 p-3 rounded-lg mt-4">
            <p className="text-sm">
              <strong>Pourquoi choisir 2 ans ? </strong>
              Économisez {offer.savings}€ et assurez une visibilité prolongée pour votre entreprise.
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button 
          className="w-full gap-2" 
          variant={isPremium ? 'default' : 'secondary'}
          onClick={() => navigate('/partners/subscription', { 
            state: { 
              offer: offer.id,
              duration: selectedDuration
            } 
          })}
        >
          Sélectionner cette offre
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PartnerOfferCard;
