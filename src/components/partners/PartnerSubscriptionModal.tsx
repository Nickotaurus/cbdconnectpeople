
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SubscriptionPlans from '@/components/SubscriptionPlans';
import { Lock } from "lucide-react";

interface PartnerSubscriptionModalProps {
  onClose: () => void;
  onSubscribe: (planId: string) => void;
}

const PartnerSubscriptionModal = ({ onClose, onSubscribe }: PartnerSubscriptionModalProps) => {
  return (
    <Card className="mb-8 fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="max-w-4xl w-full p-6 bg-background rounded-lg shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Accès aux coordonnées des partenaires</CardTitle>
              <CardDescription>
                Avec un abonnement premium, accédez aux coordonnées complètes de tous nos partenaires
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SubscriptionPlans onSelectPlan={onSubscribe} />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default PartnerSubscriptionModal;
