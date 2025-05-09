
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { subscriptionPlans } from "@/data/subscriptionData";

interface SubscriptionPlansProps {
  onSelectPlan?: (planId: string) => void;
  className?: string;
}

const SubscriptionPlans = ({ onSelectPlan, className }: SubscriptionPlansProps) => {
  const handleSelectPlan = (planId: string) => {
    toast({
      title: "Plan sélectionné",
      description: "Vous avez rejoint notre réseau professionnel.",
    });
    
    if (onSelectPlan) {
      onSelectPlan(planId);
    }
  };

  return (
    <div className={`grid ${className}`}>
      {subscriptionPlans.map((plan) => (
        <Card 
          key={plan.id}
          className="flex flex-col relative"
        >
          <CardHeader>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription>
              Réseau d'entraide pour professionnels du CBD
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
              className="w-full"
              onClick={() => handleSelectPlan(plan.id)}
            >
              Rejoindre le réseau
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
