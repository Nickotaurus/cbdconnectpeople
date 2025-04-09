
import { TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BadgeEuro } from "lucide-react";

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
          L'inscription de votre boutique physique est <strong>gratuite</strong>. 
          Pour référencer votre site e-commerce, un abonnement sera nécessaire.
        </AlertDescription>
      </Alert>
    </TabsContent>
  );
};

export default StoreRegistrationInfo;
