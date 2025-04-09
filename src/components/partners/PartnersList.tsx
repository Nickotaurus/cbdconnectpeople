
import PartnerCard from '@/components/partners/PartnerCard';
import { PartnerCategory } from "@/types/auth";
import { Partner } from '@/data/partnersData';

interface PartnersListProps {
  partners: Partner[];
  isProfessional: boolean;
  hasPremium: boolean;
  onContactClick: (partnerId: string) => void;
}

const PartnersList = ({ 
  partners,
  isProfessional,
  hasPremium,
  onContactClick
}: PartnersListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {partners.map(partner => (
        <PartnerCard
          key={partner.id}
          partner={partner}
          isProfessional={isProfessional}
          hasPremium={hasPremium}
          onContactClick={onContactClick}
        />
      ))}
    </div>
  );
};

export default PartnersList;
