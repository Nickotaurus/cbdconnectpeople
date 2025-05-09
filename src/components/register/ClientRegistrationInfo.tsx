
import { TabsContent } from "@/components/ui/tabs";

const ClientRegistrationInfo = () => {
  return (
    <TabsContent value="client" className="mt-2">
      <p className="text-sm text-muted-foreground">
        Notre plateforme est destinée aux professionnels du CBD uniquement.
        Si vous êtes une boutique ou un partenaire professionnel, merci de sélectionner
        le profil correspondant.
      </p>
    </TabsContent>
  );
};

export default ClientRegistrationInfo;
