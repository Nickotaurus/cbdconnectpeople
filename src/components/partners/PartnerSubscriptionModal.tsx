
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SubscriptionPlans from '@/components/SubscriptionPlans';
import { Lock } from "lucide-react";

interface PartnerSubscriptionModalProps {
  onClose: () => void;
  onSubscribe: (planId: string) => void;
}

const PartnerSubscriptionModal = ({ onClose, onSubscribe }: PartnerSubscriptionModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-primary" />
            <div>
              <DialogTitle>Accès aux coordonnées des partenaires</DialogTitle>
              <DialogDescription>
                Avec un abonnement premium, accédez aux coordonnées complètes de tous nos partenaires
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <SubscriptionPlans onSelectPlan={onSubscribe} />
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerSubscriptionModal;
