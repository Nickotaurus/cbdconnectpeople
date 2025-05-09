
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from 'lucide-react';

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
      <div className={`px-6 py-4 flex items-center justify-between ${isPremium ? 'bg-primary/20' : 'bg-primary/10'}`}>
        <div>
          <h3 className="text-xl font-bold">{offer.title}</h3>
          <p className="text-sm text-muted-foreground">{offer.description}</p>
        </div>
        {offer.icon}
      </div>
      
      <CardContent className="pt-6">
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
              <strong>Rejoindre le réseau professionnel</strong> pour contribuer à l'évolution du secteur CBD et bénéficier du partage d'expérience.
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button 
          className="w-full gap-2" 
          variant={isPremium ? 'default' : 'secondary'}
          onClick={() => navigate('/register?role=partner')}
        >
          Rejoindre le réseau
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PartnerOfferCard;
