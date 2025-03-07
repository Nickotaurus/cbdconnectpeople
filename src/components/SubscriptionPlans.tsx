
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { subscriptionPlans } from "@/utils/data";

interface SubscriptionPlansProps {
  onSelectPlan?: (planId: string) => void;
  className?: string;
}

const SubscriptionPlans = ({ onSelectPlan, className }: SubscriptionPlansProps) => {
  const handleSelectPlan = (planId: string) => {
    toast({
      title: "Abonnement sélectionné",
      description: "Dans une version en production, vous seriez redirigé vers la page de paiement.",
    });
    
    if (onSelectPlan) {
      onSelectPlan(planId);
    }
  };

  return (
    <div className={`grid gap-6 md:grid-cols-3 ${className}`}>
      {subscriptionPlans.map((plan) => (
        <Card 
          key={plan.id}
          className={`flex flex-col relative ${
            plan.isPopular 
              ? "border-primary shadow-md shadow-primary/10" 
              : ""
          }`}
        >
          {plan.isPopular && (
            <div className="absolute top-0 right-0">
              <div className="bg-primary text-primary-foreground text-xs font-medium py-1 px-2 rounded-bl-md rounded-tr-md">
                Recommandé
              </div>
            </div>
          )}
          
          <CardHeader>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription>
              {plan.price > 0 
                ? `${plan.price.toFixed(2)}€ / mois` 
                : "Gratuit"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 flex-1">
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="pt-3">
            <Button 
              variant={plan.isPopular ? "default" : "outline"}
              className="w-full"
              onClick={() => handleSelectPlan(plan.id)}
            >
              {plan.price > 0 ? "S'abonner" : "Sélectionner"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
