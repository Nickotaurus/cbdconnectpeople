
import { Briefcase } from "lucide-react";

interface JobSearchInfoBoxProps {
  isJobSearch: boolean;
}

const JobSearchInfoBox = ({ isJobSearch }: JobSearchInfoBoxProps) => {
  if (!isJobSearch) return null;

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
      <div className="flex items-center gap-2">
        <Briefcase className="text-primary h-5 w-5" />
        <h3 className="font-medium">Détails de votre recherche d'emploi</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Décrivez votre profil, votre expérience, et le type de poste recherché dans le champ "Description" ci-dessous.
        N'hésitez pas à mentionner vos compétences, formations, et disponibilités.
      </p>
    </div>
  );
};

export default JobSearchInfoBox;
