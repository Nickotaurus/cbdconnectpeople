
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SubscriptionPlans from '@/components/SubscriptionPlans';

interface PartnerSubscriptionModalProps {
  onClose: () => void;
  onSubscribe: (planId: string) => void;
}

const PartnerSubscriptionModal = ({ onClose, onSubscribe }: PartnerSubscriptionModalProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Accès aux coordonnées des partenaires</CardTitle>
        <CardDescription>
          Avec un abonnement premium, accédez aux coordonnées complètes de tous nos partenaires
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SubscriptionPlans onSelectPlan={onSubscribe} />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PartnerSubscriptionModal;
