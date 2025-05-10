
import { Badge } from "@/components/ui/badge";

interface EcommerceSpecialtiesProps {
  specialties: string[];
}

const EcommerceSpecialties = ({ specialties }: EcommerceSpecialtiesProps) => {
  return (
    <div className="mb-3">
      <h4 className="text-xs font-medium mb-1">Spécialités:</h4>
      <div className="flex flex-wrap gap-1">
        {specialties.map(specialty => (
          <Badge key={specialty} variant="outline" className="text-xs">
            {specialty}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default EcommerceSpecialties;
