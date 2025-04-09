
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import PartnerSubscriptionConfirmDialog from './PartnerSubscriptionConfirmDialog';

interface SubscriptionCardProps {
  offer: {
    id: string;
    name: string;
    prices: {
      yearly: number;
      biennial: number;
    };
    savings: number;
    features: string[];
    icon: React.ReactNode;
  };
  selectedDurations: {
    [key: string]: string;
  };
  setSelectedDurations: React.Dispatch<React.SetStateAction<{
    [key: string]: string;
  }>>;
  setSelectedOffer: (offer: string | null) => void;
}

const PartnerSubscriptionCard = ({ 
  offer, 
  selectedDurations, 
  setSelectedDurations,
  setSelectedOffer 
}: SubscriptionCardProps) => {
  return (
    <Card key={offer.id} className="overflow-visible">
      <CardHeader>
        <div className="flex items-center gap-4">
          {offer.icon}
          <div>
            <CardTitle>{offer.name}</CardTitle>
            <CardDescription>
              Référencement pour votre société partenaire CBD
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 mb-6">
          <div 
            className={`cursor-pointer flex-1 text-center px-4 py-3 rounded-lg border ${
              selectedDurations[offer.id] === "1" 
                ? "border-primary bg-primary/10" 
                : "border-muted bg-muted/50"
            }`}
            onClick={() => setSelectedDurations(prev => ({...prev, [offer.id]: "1"}))}
          >
            <p className="font-medium">1 An</p>
            <p className="text-lg font-bold mt-1">{offer.prices.yearly}€</p>
          </div>
          
          <div 
            className={`cursor-pointer flex-1 text-center px-4 py-3 rounded-lg border relative overflow-hidden ${
              selectedDurations[offer.id] === "2" 
                ? "border-primary bg-primary/10" 
                : "border-muted bg-muted/50"
            }`}
            onClick={() => setSelectedDurations(prev => ({...prev, [offer.id]: "2"}))}
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
            {offer.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="mt-1">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">{feature}</span>
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
      <CardFooter>
        <PartnerSubscriptionConfirmDialog 
          offer={offer} 
          duration={selectedDurations[offer.id]} 
          setSelectedOffer={setSelectedOffer}
        />
      </CardFooter>
    </Card>
  );
};

export default PartnerSubscriptionCard;
