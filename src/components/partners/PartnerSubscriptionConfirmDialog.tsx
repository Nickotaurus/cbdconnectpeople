
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface PartnerSubscriptionConfirmDialogProps {
  offer: {
    id: string;
    name: string;
    prices: {
      yearly: number;
      biennial: number;
    };
  };
  duration: string;
  setSelectedOffer: (offer: string | null) => void;
}

const PartnerSubscriptionConfirmDialog = ({ offer, duration, setSelectedOffer }: PartnerSubscriptionConfirmDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubscribe = () => {
    setSelectedOffer(offer.name);
    toast({
      title: "Offre sélectionnée",
      description: `Vous avez choisi l'offre ${offer.name} pour ${duration} an${duration === "2" ? "s" : ""}. Complétez votre inscription pour finaliser.`,
      duration: 5000,
    });
    
    navigate(`/register?role=partner&offer=${encodeURIComponent(offer.name)}&duration=${duration}`);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          Souscrire à cette offre
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmer votre choix</DialogTitle>
          <DialogDescription>
            Vous avez sélectionné : {offer.name} pour {duration} an{duration === "2" ? "s" : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-2">
            Pour finaliser votre inscription et bénéficier de cette offre, vous devez :
          </p>
          <ol className="list-decimal pl-4 space-y-2">
            <li>Créer un compte partenaire</li>
            <li>Renseigner les informations de votre entreprise</li>
            <li>Procéder au paiement</li>
          </ol>
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm font-medium">
              Montant total : {duration === "1" ? offer.prices.yearly : offer.prices.biennial}€
            </p>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <DialogTrigger asChild>
            <Button variant="outline">Annuler</Button>
          </DialogTrigger>
          <Button onClick={handleSubscribe}>
            Continuer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerSubscriptionConfirmDialog;
