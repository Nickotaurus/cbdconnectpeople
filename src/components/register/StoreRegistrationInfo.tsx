
import { TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BadgeEuro, Store, Globe } from "lucide-react";

const StoreRegistrationInfo = () => {
  return (
    <TabsContent value="store" className="mt-2 space-y-4">
      <p className="text-sm text-muted-foreground">
        Référencez votre boutique CBD, gérez votre présence en ligne, offrez des réductions pour 
        attirer plus de clients et connectez-vous avec des producteurs.
      </p>
      
      <Alert className="bg-primary/5 border-primary/20">
        <BadgeEuro className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm mt-1">
          <span className="font-medium">Processus d'inscription :</span>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>L'inscription de votre boutique physique est <strong>gratuite</strong>.</li>
            <li>Pour les sites e-commerce, vous créerez d'abord votre boutique physique, puis vous serez dirigé vers les options d'abonnement.</li>
          </ul>
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="border rounded-lg p-3 flex items-start space-x-3">
          <Store className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="text-sm font-medium">Boutique Physique</h4>
            <p className="text-xs text-muted-foreground">Référencement gratuit et illimité</p>
          </div>
        </div>
        <div className="border rounded-lg p-3 flex items-start space-x-3">
          <Globe className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="text-sm font-medium">E-commerce</h4>
            <p className="text-xs text-muted-foreground">Abonnement requis après inscription</p>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default StoreRegistrationInfo;
