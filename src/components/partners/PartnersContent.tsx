
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import PartnersList from '@/components/partners/PartnersList';
import { Partner } from '@/hooks/usePartners';

interface PartnersContentProps {
  isLoading: boolean;
  error: string | null;
  filteredPartners: Partner[];
  partnerProfilesCount: number;
  isProfessional: boolean;
  hasPremium: boolean;
  onContactClick: (partnerId: string) => void;
}

const PartnersContent = ({
  isLoading,
  error,
  filteredPartners,
  partnerProfilesCount,
  isProfessional,
  hasPremium,
  onContactClick
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
            Pour qu'un partenaire apparaisse dans cette liste, son profil doit avoir :
            <ul className="list-disc pl-5 mt-2">
              <li>Le rôle "partner" dans la base de données</li>
              <li>Le champ "is_verified" doit être à true</li>
              <li>Une catégorie de partenaire définie (partner_category)</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <>
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
