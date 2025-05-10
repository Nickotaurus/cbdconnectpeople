import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import PartnersList from '@/components/partners/PartnersList';
import { Partner } from '@/types/partners';

interface PartnersContentProps {
  isLoading: boolean;
  error: string | null;
  filteredPartners: Partner[];
  partnerProfilesCount: number;
  isProfessional: boolean;
  hasPremium: boolean;
  onContactClick: (partnerId: string) => void;
  useTestData?: boolean;
}

const PartnersContent = ({
  isLoading,
  error,
  filteredPartners,
  partnerProfilesCount,
  isProfessional,
  hasPremium,
  onContactClick,
  useTestData = false
}: PartnersContentProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="rounded-lg overflow-hidden border shadow">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>{error}</p>
      </div>
    );
  }
  
  if (filteredPartners.length === 0) {
    return (
      <div className="text-center py-10">
        <p>Aucun partenaire ne correspond à votre recherche</p>
        <p className="mt-4 font-medium">Partenaires disponibles: {partnerProfilesCount}</p>
        
        <Alert className="mt-6 max-w-xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertTitle>Information sur la visibilité des partenaires</AlertTitle>
          <AlertDescription>
            Pour qu'un partenaire apparaisse dans cette liste, son profil doit avoir exactement :
            <ul className="list-disc pl-5 mt-2">
              <li>Le champ "role" doit être exactement "partner" (sensible à la casse)</li>
              <li>Le champ "is_verified" doit être à true (et pas un autre champ comme "verified")</li>
              <li>Le champ "partner_category" doit contenir une des catégories valides</li>
            </ul>
            <div className="mt-2 bg-muted p-2 rounded text-xs">
              <p className="font-semibold">Vérifier dans la console les logs qui montrent les détails des partenaires récupérés</p>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <>
      {useTestData && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Données de démonstration</AlertTitle>
          <AlertDescription>
            Aucun partenaire réel n'a été trouvé dans la base de données. Des données de test sont affichées à titre de démonstration.
          </AlertDescription>
        </Alert>
      )}
      <div className="mb-2 text-sm text-muted-foreground">
        {filteredPartners.length} partenaire(s) trouvé(s)
      </div>
      <PartnersList
        partners={filteredPartners}
        isProfessional={isProfessional}
        hasPremium={hasPremium}
        onContactClick={onContactClick}
      />
    </>
  );
};

export default PartnersContent;
