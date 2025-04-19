
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import PartnersList from '@/components/partners/PartnersList';
import { Partner } from '@/data/partnersData';
import { mockPartners } from '@/data/partnersData';

interface PartnersContentProps {
  isLoading: boolean;
  error: string | null;
  filteredPartners: Partner[];
  partnerProfilesCount: number;
  isProfessional: boolean;
  hasPremium: boolean;
  useMockData: boolean;
  onContactClick: (partnerId: string) => void;
}

const PartnersContent = ({
  isLoading,
  error,
  filteredPartners,
  partnerProfilesCount,
  isProfessional,
  hasPremium,
  useMockData,
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
        <p className="mt-2 mb-6">Affichage des partenaires par défaut</p>
        <PartnersList
          partners={mockPartners}
          isProfessional={isProfessional}
          hasPremium={hasPremium}
          onContactClick={onContactClick}
        />
      </div>
    );
  }
  
  if (filteredPartners.length === 0) {
    return (
      <div className="text-center py-10">
        <p>Aucun partenaire ne correspond à votre recherche</p>
        <p className="mt-4 font-medium">Partenaires disponibles: {partnerProfilesCount}</p>
      </div>
    );
  }
  
  return (
    <>
      {useMockData && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Données d'exemple</AlertTitle>
          <AlertDescription>
            Actuellement, seuls des partenaires fictifs sont affichés car aucun partenaire réel n'a été trouvé dans la base de données.
          </AlertDescription>
        </Alert>
      )}
      <div className="mb-2 text-sm text-muted-foreground">
        {filteredPartners.length} partenaire(s) trouvé(s){useMockData ? ' (exemples)' : ''}
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
